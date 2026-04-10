import { apiRequest, apiUpload } from "./api";

export type Category = {
  id: string;
  name: string;
  icon?: string | null;
};

export type CreateListingPayload = {
  cropName: string;
  categoryId?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  grade?: string;
  harvestDate?: string;
  availableFrom?: string;
  photos: string[];
  description?: string;
  locationName?: string;
};

export type ListingStatus = "ACTIVE" | "SOLD" | "DELETED";

export type Listing = {
  id: string;
  cropName: string;
  categoryId?: string | null;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  grade?: string | null;
  harvestDate?: string | null;
  availableFrom?: string | null;
  description?: string | null;
  status: ListingStatus;
  photos: string[];
  locationName?: string | null;
  category?: Category | null;
  createdAt: string;
};

export async function getCategories() {
  const res = await apiRequest<{ success: boolean; categories: Category[] }>(
    "/api/v1/categories",
  );
  return res.categories;
}

export async function createListing(payload: CreateListingPayload) {
  return apiRequest<{ success: boolean; listing: any }>("/api/v1/listings", {
    method: "POST",
    body: payload,
  });
}

export async function uploadListingPhoto(fileUri: string) {
  const result = await apiUpload(fileUri);
  return result.url;
}

export async function getMyListings(status?: Exclude<ListingStatus, "DELETED">) {
  const query = status ? `?status=${status}` : "";
  const res = await apiRequest<{ success: boolean; listings: Listing[] }>(
    `/api/v1/listings${query}`,
  );
  return res.listings;
}

export async function deleteListing(id: string) {
  return apiRequest<{ success: boolean }>(`/api/v1/listings/${id}`, {
    method: "DELETE",
  });
}

export async function getListingById(id: string) {
  const res = await apiRequest<{ success: boolean; listing: Listing }>(
    `/api/v1/listings/${id}`,
  );
  return res.listing;
}

export async function updateListingStatus(id: string, status: "ACTIVE" | "SOLD" | "DELETED") {
  const res = await apiRequest<{ success: boolean; listing: Listing }>(`/api/v1/listings/${id}`, {
    method: "PATCH",
    body: { status },
  });
  return res.listing;
}

export async function updateListing(id: string, payload: Partial<CreateListingPayload>) {
  const res = await apiRequest<{ success: boolean; listing: Listing }>(`/api/v1/listings/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return res.listing;
}
