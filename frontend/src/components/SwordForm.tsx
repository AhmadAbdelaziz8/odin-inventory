// src/components/SwordForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSwordById,
  createSword,
  updateSword,
  getCategories,
  getOrigins,
  getMaterials,
  Category,
  Origin,
  Material,
  Sword,
  SwordCreateUpdate,
} from "../services/swordService";

const SwordForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<SwordCreateUpdate>>({
    name: "",
    category_id: 0,
    origin_id: 0,
    length: 0,
    weight: 0,
    is_battle_ready: false,
    in_stock: 0,
    price: 0,
    description: "",
    materials: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, originsData, materialsData] = await Promise.all([
          getCategories(),
          getOrigins(),
          getMaterials(),
        ]);
        setCategories(categoriesData);
        setOrigins(originsData);
        setMaterials(materialsData);

        if (isEditing && id) {
          const swordData = await getSwordById(parseInt(id));
          const { materials, ...swordWithoutMaterials } = swordData;
          setFormData({
            ...swordWithoutMaterials,
            materials: materials?.map((m) => m.id) || [],
          });
          if (swordData.materials) {
            setSelectedMaterials(
              swordData.materials.map((m: Material) => m.id)
            );
          }
        }
      } catch (error) {
        setError("Error loading data");
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData: SwordCreateUpdate = {
        ...formData,
        materials: selectedMaterials,
      } as SwordCreateUpdate;

      if (isEditing && id) {
        await updateSword(parseInt(id), submitData);
      } else {
        await createSword(submitData);
      }
      navigate("/");
    } catch (error) {
      setError("Error saving sword");
      console.error("Error saving sword:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setSelectedMaterials(selectedOptions);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Sword" : "Add New Sword"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter sword name"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-1">
            Category
          </label>
          <select
            id="category"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="origin" className="block mb-1">
            Origin
          </label>
          <select
            id="origin"
            name="origin_id"
            value={formData.origin_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select an origin</option>
            {origins.map((origin) => (
              <option key={origin.id} value={origin.id}>
                {origin.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="length" className="block mb-1">
            Length (cm)
          </label>
          <input
            id="length"
            type="number"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter length in centimeters"
            required
          />
        </div>

        <div>
          <label htmlFor="weight" className="block mb-1">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter weight in kilograms"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block mb-1">
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter price in dollars"
            required
          />
        </div>

        <div>
          <label htmlFor="in_stock" className="block mb-1">
            In Stock
          </label>
          <input
            id="in_stock"
            type="number"
            name="in_stock"
            value={formData.in_stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter quantity in stock"
            required
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_battle_ready"
              checked={formData.is_battle_ready}
              onChange={handleChange}
              className="mr-2"
              id="battle_ready"
            />
            <span id="battle_ready_label">Battle Ready</span>
          </label>
        </div>

        <div>
          <label htmlFor="materials" className="block mb-1">
            Materials
          </label>
          <select
            id="materials"
            multiple
            value={selectedMaterials.map(String)}
            onChange={handleMaterialChange}
            className="w-full p-2 border rounded"
            required
          >
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Enter sword description"
            required
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SwordForm;
