// Sword interface
export interface Sword {
    id: number;
    name: string;
    category_id: number;
    origin_id: number | null;
    length: number | null;
    weight: number | null;
    date_manufactured: Date | null;
    is_battle_ready: boolean;
    in_stock: number;
    price: number | null;
    description: string | null;
    image_url: string | null;
    created_at: Date;
    updated_at: Date;
  }
  
  // Category interface
  export interface Category {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
  }
  
  // Material interface
  export interface Material {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
  }
  
  // Origin interface
  export interface Origin {
    id: number;
    name: string;
    region: string | null;
    historical_period: string | null;
    description: string | null;
    created_at: Date;
    updated_at: Date;
  }
  
  // Extended sword interface with related data
  export interface SwordWithDetails extends Sword {
    category_name?: string;
    origin_name?: string;
    materials?: Material[];
  }
  
  // For creating new swords (without requiring ID fields)
  export interface CreateSwordDTO {
    name: string;
    category_id: number;
    origin_id?: number;
    length?: number;
    weight?: number;
    date_manufactured?: Date;
    is_battle_ready?: boolean;
    in_stock?: number;
    price?: number;
    description?: string;
    image_url?: string;
    material_ids?: number[];
  }
  
  // For updating existing swords
  export interface UpdateSwordDTO extends Partial<CreateSwordDTO> {}
  
  // Simple DTO interfaces for other entities
  export interface CategoryDTO {
    name: string;
    description?: string;
  }
  
  export interface MaterialDTO {
    name: string;
    description?: string;
  }
  
  export interface OriginDTO {
    name: string;
    region?: string;
    historical_period?: string;
    description?: string;
  }
  
  // For admin authentication
  export interface AdminAuth {
    password: string;
  }