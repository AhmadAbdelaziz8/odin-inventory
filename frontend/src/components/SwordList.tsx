// src/components/SwordList.tsx
import React, { useEffect, useState } from "react";
import { getSwords, deleteSword, Sword } from "../services/swordService";
import { Link } from "react-router-dom";

const SwordList: React.FC = () => {
  const [swords, setSwords] = useState<Sword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSwords = async () => {
    try {
      const data = await getSwords();
      setSwords(data);
    } catch (err) {
      setError("Error fetching swords");
      console.error("Error fetching swords:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwords();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Swords
        </h1>
        <Link
          to="/swords/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Add Sword
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {swords.map((sword) => (
          <div
            key={sword.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {sword.name}
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-medium">Type:</span> {sword.type}
              </p>
              <p>
                <span className="font-medium">Length:</span> {sword.length} cm
              </p>
              <p>
                <span className="font-medium">Weight:</span> {sword.weight} kg
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(sword.created_at)}
              </p>
              <p>
                <span className="font-medium">Materials:</span>{" "}
                {(sword.materials || []).map((m) => m.name).join(", ")}
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Link
                to={`/swords/${sword.id}/edit`}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(sword.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
