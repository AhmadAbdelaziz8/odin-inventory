export interface Material {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const API_URL = "/api";

export const getMaterials = async (): Promise<Material[]> => {
  const response = await fetch(`${API_URL}/materials`);
  if (!response.ok) {
    throw new Error("Failed to fetch materials");
  }
  return response.json();
};

export const getMaterialById = async (id: number): Promise<Material> => {
  const response = await fetch(`${API_URL}/materials/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch material");
  }
  return response.json();
};

export const createMaterial = async (
  material: Omit<Material, "id" | "created_at" | "updated_at">
): Promise<Material> => {
  const response = await fetch(`${API_URL}/materials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(material),
  });
  if (!response.ok) {
    throw new Error("Failed to create material");
  }
  return response.json();
};

export const updateMaterial = async (
  id: number,
  material: Omit<Material, "id" | "created_at" | "updated_at">
): Promise<Material> => {
  const response = await fetch(`${API_URL}/materials/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(material),
  });
  if (!response.ok) {
    throw new Error("Failed to update material");
  }
  return response.json();
};

export const deleteMaterial = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/materials/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete material");
  }
};
