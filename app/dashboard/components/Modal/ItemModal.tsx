"use client";

import React, { useState } from "react";
import { supabase } from "../../../config/supabase";
import { Item } from "../../models/ItemModel";

interface ItemModalProps {
  isOpen: boolean;
  editingItem: Item | null;
  newItem: Omit<Item, "id">;
  setNewItem: React.Dispatch<
    React.SetStateAction<Omit<Item, "id">>
  >;
  onClose: () => void;
  onSubmit: () => void;
  categories: string[];
  refreshCategories: () => void;
}

export default function ItemModal({
  isOpen,
  editingItem,
  newItem,
  setNewItem,
  onClose,
  onSubmit,
  categories,
  refreshCategories,
}: ItemModalProps) {
  const [newCategory, setNewCategory] = useState("");

  if (!isOpen) return null;

  // Create category
  const createCategory = async () => {
    if (!newCategory) return;

    await supabase.from("categories").insert([{ name: newCategory }]);

    setNewCategory("");
    refreshCategories();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingItem ? "Edit Item" : "Add New Item"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Image URL"
            className="w-full px-3 py-2 border rounded-lg"
            value={newItem.img}
            onChange={(e) =>
              setNewItem({ ...newItem, img: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Product Name"
            className="w-full px-3 py-2 border rounded-lg"
            value={newItem.nameproduce}
            onChange={(e) =>
              setNewItem({ ...newItem, nameproduce: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            rows={3}
            className="w-full px-3 py-2 border rounded-lg"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
          />

          {/* Category dropdown */}
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>

            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Create new category */}
          <div className="flex gap-2 pt-2">
            <input
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button
              onClick={createCategory}
              className="px-3 py-2 bg-green-600 text-white rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {editingItem ? "Update" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
