// src/services/swordService.ts

export interface Sword {
    id: number;
    name: string;
    category_id: number;
    origin_id: number;
    // Include other sword properties as needed
  }
  
  const API_BASE = '/api/swords'; // Using the proxy from the React package.json
  
  // Helper function to handle responses
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'An error occurred');
    }
    return response.json();
  };
  
  export const getSwords = async (): Promise<Sword[]> => {
    const response = await fetch(API_BASE);
    return handleResponse(response);
  };
  
  export const getSwordById = async (id: number): Promise<Sword> => {
    const response = await fetch(`${API_BASE}/${id}`);
    return handleResponse(response);
  };
  
  export const createSword = async (sword: Partial<Sword>): Promise<Sword> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sword),
    });
    return handleResponse(response);
  };
  
  export const updateSword = async (id: number, sword: Partial<Sword>): Promise<Sword> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sword),
    });
    return handleResponse(response);
  };
  
  export const deleteSword = async (id: number, adminPassword: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminPassword }),
    });
    // If you don't expect a response body, simply check for errors.
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'An error occurred');
    }
  };
  