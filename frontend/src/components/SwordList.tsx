// src/components/SwordList.tsx
import React, { useEffect, useState } from "react";
import { getSwords, deleteSword, Sword } from "../services/swordService";
import { Link } from "react-router-dom";

const SwordList: React.FC = () => {
  const [swords, setSwords] = useState<Sword[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSwords();
  }, []);

  const fetchSwords = async () => {
    try {
      const data = await getSwords();
      setSwords(data);
    } catch (error) {
      setError("Error fetching swords");
      console.error("Error fetching swords:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this sword?")) {
      try {
        await deleteSword(id, "admin123"); // In a real app, get this from a secure source
        fetchSwords();
      } catch (error) {
        setError("Error deleting sword");
        console.error("Error deleting sword:", error);
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sword Inventory</h2>
        <Link
          to="/swords/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Sword
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {swords.map((sword) => (
          <div
            key={sword.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{sword.name}</h3>
            <div className="space-y-2 text-gray-600">
              <p>Category: {sword.category_name}</p>
              <p>Origin: {sword.origin_name}</p>
              <p>Length: {sword.length} cm</p>
              <p>Weight: {sword.weight} kg</p>
              <p>Price: ${sword.price}</p>
              <p>In Stock: {sword.in_stock}</p>
              <p>Battle Ready: {sword.is_battle_ready ? "Yes" : "No"}</p>
              <p className="mt-2">{sword.description}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link
                to={`/swords/${sword.id}/edit`}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(sword.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwordList;
