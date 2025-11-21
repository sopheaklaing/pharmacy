"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../config/supabase";
import { Item } from "../models/ItemModel";
import ItemModal from "../components/Modal/ItemModal";

export default function ItemsManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [newItem, setNewItem] = useState<Omit<Item, "id">>({
    img: "",
    nameproduce: "",
    description: "",
    category: "",
  });

  // ----------------------------
  // Load items + categories 
  // ----------------------------
  const loadItems = async () => {
    const { data } = await supabase.from("items").select("*");
    if (data) setItems(data);
  };

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data.map((c: any) => c.name));
  };

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  // ----------------------------
  // Add item to supabase
  // ----------------------------
  const handleAddItem = async () => {
    const { data, error } = await supabase.from("items").insert([newItem]);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    Swal.fire("Success!", "Item added to database", "success");
    loadItems();
    resetForm();
  };

  // ----------------------------
  // Update item
  // ----------------------------
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from("items")
      .update(newItem)
      .eq("id", editingItem.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    Swal.fire("Updated!", "Item updated successfully", "success");
    loadItems();
    resetForm();
  };

  // ----------------------------
  // Delete item
  // ----------------------------
  const handleDeleteItem = (id: number) => {
    Swal.fire({
      title: "Delete item?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await supabase.from("items").delete().eq("id", id);
        Swal.fire("Deleted!", "Item removed", "success");
        loadItems();
      }
    });
  };

  // ----------------------------
  // Edit
  // ----------------------------
  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setNewItem({
      img: item.img,
      nameproduce: item.nameproduce,
      description: item.description,
      category: item.category,
    });
    setIsAddModalOpen(true);
  };

  // ----------------------------
  // Reset form & close modal
  // ----------------------------
  const resetForm = () => {
    setNewItem({ img: "", nameproduce: "", description: "", category: "" });
    setEditingItem(null);
    setIsAddModalOpen(false);
  };

  // ----------------------------
  // Filter items
  // ----------------------------
  const filteredItems = items.filter(
    (item) =>
      (item.nameproduce.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "" || item.category === categoryFilter)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Items Management
        </h1>
        <p className="text-gray-600">Manage your products and inventory</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 w-full md:w-auto flex gap-2">
          <input
            type="text"
            placeholder="Search items..."
            className="flex-1 px-4 py-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-3 border rounded-lg"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Add New Item
        </button>
      </div>

      {/* Item cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="p-4 border-b">
              <img
                src={item.img}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.nameproduce}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-indigo-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ItemModal
        isOpen={isAddModalOpen}
        editingItem={editingItem}
        newItem={newItem}
        setNewItem={setNewItem}
        onClose={resetForm}
        onSubmit={editingItem ? handleUpdateItem : handleAddItem}
        categories={categories}
        refreshCategories={loadCategories}
      />
    </div>
  );
}
