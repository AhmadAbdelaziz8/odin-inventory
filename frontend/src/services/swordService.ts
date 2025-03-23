// src/services/swordService.ts

export interface Sword {
  id: number;
  name: string;
  category_id: number;
  origin_id: number;
  length: number;
  weight: number;
  is_battle_ready: boolean;
  in_stock: number;
  price: number;
  description: string;
  category_name?: string;
  origin_name?: string;
  materials?: Material[];
}

export interface SwordCreateUpdate {
  name: string;
  category_id: number;
  origin_id: number;
  length: number;
  weight: number;
  is_battle_ready: boolean;
  in_stock: number;
  price: number;
  description: string;
  materials: number[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Origin {
  id: number;
  name: string;
  region: string;
  historical_period: string;
}

export interface Material {
  id: number;
  name: string;
  description: string;
}

const API_BASE = "/api";

// Helper function to handle responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "An error occurred");
  }
  return response.json();
};

// Sword endpoints
export const getSwords = async (): Promise<Sword[]> => {
  const response = await fetch(`${API_BASE}/swords`);
  return handleResponse(response);
};

export const getSwordById = async (id: number): Promise<Sword> => {
  const response = await fetch(`${API_BASE}/swords/${id}`);
  return handleResponse(response);
};

export const createSword = async (sword: SwordCreateUpdate): Promise<Sword> => {
  const response = await fetch(`${API_BASE}/swords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sword),
  });
  return handleResponse(response);
};

export const updateSword = async (
  id: number,
  sword: SwordCreateUpdate
): Promise<Sword> => {
  const response = await fetch(`${API_BASE}/swords/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sword),
  });
  return handleResponse(response);
};

export const deleteSword = async (
  id: number,
  adminPassword: string
): Promise<void> => {
  const response = await fetch(`${API_BASE}/swords/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminPassword }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "An error occurred");
  }
};

// Category endpoints
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/categories`);
  return handleResponse(response);
};

// Origin endpoints
export const getOrigins = async (): Promise<Origin[]> => {
  const response = await fetch(`${API_BASE}/origins`);
  return handleResponse(response);
};

// Material endpoints
export const getMaterials = async (): Promise<Material[]> => {
  const response = await fetch(`${API_BASE}/materials`);
  return handleResponse(response);
};
