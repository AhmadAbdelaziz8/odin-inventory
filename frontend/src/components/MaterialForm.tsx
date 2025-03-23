import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Material } from "../types/material";
import {
  getMaterialById,
  createMaterial,
  updateMaterial,
} from "../services/materialService";

const MaterialForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<
    Omit<Material, "id" | "created_at" | "updated_at">
  >({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMaterial = async () => {
        try {
          const material = await getMaterialById(parseInt(id));
          setFormData({
            name: material.name,
            description: material.description,
          });
        } catch (err) {
          setError(
            `Failed to fetch material: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      };
      fetchMaterial();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await updateMaterial(parseInt(id), formData);
      } else {
        await createMaterial(formData);
      }
      navigate("/materials");
    } catch (err) {
      setError(
        `Failed to save material: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id ? "Edit Material" : "New Material"}
        </h2>
        <button
          onClick={() => navigate("/materials")}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          aria-label="Close form"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
            placeholder="Enter material name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 resize-none"
            placeholder="Enter material description"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/materials")}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
