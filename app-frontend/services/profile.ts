import { apiRequest, apiUpload } from "./api";

export type FarmerProfilePayload = {
  state: string;
  district: string;
  pincode: string;
  village?: string;
  cropTypes: string[];
  profilePhoto?: string;
};

export async function createFarmerProfile(payload: FarmerProfilePayload) {
  return apiRequest<{ success: boolean; profile: any }>("/api/v1/profile/farmer", {
    method: "POST",
    body: payload,
  });
}

export async function uploadImage(fileUri: string) {
  const result = await apiUpload(fileUri);
  return result.url;
}

export async function getMyProfile() {
  return apiRequest<{
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      image?: string | null;
      role?: "FARMER" | "BUYER" | null;
    };
    profile: any;
    hasProfile: boolean;
  }>("/api/v1/profile/me");
}
