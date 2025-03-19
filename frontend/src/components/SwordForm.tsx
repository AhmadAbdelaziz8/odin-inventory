// src/components/SwordForm.tsx
import React, { useState } from "react";
import { createSword } from "../services/swordService";

const SwordForm: React.FC = () => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [originId, setOriginId] = useState(0);
  // Add other state variables as needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSword({ name, category_id: categoryId, origin_id: originId });
      alert("Sword added!");
      // Optionally, reset the form or redirect
    } catch (error) {
      console.error("Error creating sword:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="swordName">Sword Name:</label>
        <input
          id="swordName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="categoryId">Category ID:</label>
        <input
          id="categoryId"
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(+e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="originId">Origin ID:</label>
        <input
          id="originId"
          type="number"
          value={originId}
          onChange={(e) => setOriginId(+e.target.value)}
          required
        />
      </div>
      {/* Add other fields as needed */}
      <button type="submit">Add Sword</button>
    </form>
  );
};

export default SwordForm;
