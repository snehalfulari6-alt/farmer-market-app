import type { NextFunction, Request, Response } from "express";
import { auth } from "./auth";
import { prisma } from "./prisma";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (session?.user?.id) {
      req.user = session.user;
      req.session = session.session;
      return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dbSession = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!dbSession?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (new Date(dbSession.expiresAt).getTime() <= Date.now()) {
      return res.status(401).json({ error: "Session expired" });
    }

    req.user = dbSession.user as any;
    req.session = dbSession as any;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
