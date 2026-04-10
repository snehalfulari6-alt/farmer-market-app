import type { auth } from "../lib/auth";

type Session = typeof auth.$Infer.Session;

declare global {
  namespace Express {
    interface Request {
      user: Session["user"] | undefined;
      session: Session["session"] | undefined;
    }
  }
}
