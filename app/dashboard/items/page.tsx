"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../config/supabase";
import { Item, NewItem } from "../models/ItemModel";
import ItemModal from "../components/Modal/ItemModal";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<NewItem>({
    img: "",
    nameproduce: "",
    description: "",
    category: "",
  });

  // LOAD ITEMS
  const loadItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (error) console.error(error);
    if (data) setItems(data);
  };

  // LOAD CATEGORIES
  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data.map((c: any) => c.name));
  };

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  // -------------------- IMAGE UPLOAD --------------------
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        Swal.fire("Invalid File", "Please upload an image file (JPEG, PNG, GIF, or WebP)", "error");
        return null;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire("File Too Large", "Image must be less than 5MB", "error");
        return null;
      }

      // Get file extension
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      
      // Sanitize filename - remove all special characters and spaces
      let baseName = file.name.replace(/\.[^/.]+$/, "");
      baseName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")  // Replace any non-alphanumeric with dash
        .replace(/-+/g, "-")          // Replace multiple dashes with single dash
        .replace(/^-+|-+$/g, "")      // Remove leading/trailing dashes
        .substring(0, 50);            // Limit length
      
      // Create unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomStr}-${baseName}.${ext}`;

      console.log("📤 Uploading file:", fileName);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("items")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("❌ Supabase upload error:", error);
        Swal.fire("Upload Error", error.message, "error");
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("items")
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        Swal.fire("Error", "Failed to get image URL", "error");
        return null;
      }

      console.log("✅ Upload successful:", urlData.publicUrl);
      return urlData.publicUrl;

    } catch (err: any) {
      console.error("❌ Upload exception:", err);
      Swal.fire("Upload Error", err.message || "Unknown error occurred", "error");
      return null;
    }
  };

  // -------------------- ADD ITEM --------------------
  const handleAddItem = async () => {
    // Validate required fields
    if (!newItem.nameproduce || !newItem.category) {
      Swal.fire("Missing Fields", "Please fill in all required fields", "warning");
      return;
    }

    let imageUrl = newItem.img as string;
    
    // Upload image if it's a File
    if (newItem.img instanceof File) {
      const uploaded = await uploadImage(newItem.img);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    // Insert into database
    const { error } = await supabase.from("items").insert([{
      img: imageUrl,
      nameproduce: newItem.nameproduce,
      description: newItem.description,
      category: newItem.category,
    }]);

    if (error) return Swal.fire("Error", error.message, "error");

    Swal.fire("Success!", "Item added successfully", "success");
    loadItems();
    resetForm();
  };

  // -------------------- UPDATE ITEM --------------------
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    // Validate required fields
    if (!newItem.nameproduce || !newItem.category) {
      Swal.fire("Missing Fields", "Please fill in all required fields", "warning");
      return;
    }

    let imageUrl = newItem.img as string;
    
    // Upload new image if selected
    if (newItem.img instanceof File) {
      const uploaded = await uploadImage(newItem.img);
      if (!uploaded) return;
      imageUrl = uploaded;

      // Optional: Delete old image from storage
      // Extract filename from old URL and delete it
      // const oldFileName = editingItem.img.split('/').pop();
      // if (oldFileName) {
      //   await supabase.storage.from("items").remove([oldFileName]);
      // }
    }

    // Update in database
    const { error } = await supabase.from("items").update({
      img: imageUrl,
      nameproduce: newItem.nameproduce,
      description: newItem.description,
      category: newItem.category,
    }).eq("id", editingItem.id);

    if (error) return Swal.fire("Error", error.message, "error");

    Swal.fire("Updated!", "Item updated successfully", "success");
    loadItems();
    resetForm();
  };

  // -------------------- DELETE ITEM --------------------
  const handleDeleteItem = (id: number) => {
    Swal.fire({
      title: "Delete item?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Optional: Delete image from storage before deleting item
        // const item = items.find(i => i.id === id);
        // if (item) {
        //   const fileName = item.img.split('/').pop();
        //   if (fileName) {
        //     await supabase.storage.from("items").remove([fileName]);
        //   }
        // }

        const { error } = await supabase.from("items").delete().eq("id", id);
        
        if (error) {
          Swal.fire("Error", error.message, "error");
        } else {
          Swal.fire("Deleted!", "Item removed successfully", "success");
          loadItems();
        }
      }
    });
  };

  // -------------------- EDIT ITEM --------------------
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

  // -------------------- RESET FORM --------------------
  const resetForm = () => {
    setNewItem({ img: "", nameproduce: "", description: "", category: "" });
    setEditingItem(null);
    setIsAddModalOpen(false);
  };

  // -------------------- FILTER ITEMS --------------------
  const filteredItems = items.filter(
    (item) =>
      (item.nameproduce.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "" || item.category === categoryFilter)
  );

  return (
    <div className="p-4">
      {/* HEADER - Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search items..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
        >
          + Add New Item
        </button>
      </div>

      {/* ITEMS GRID */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No items found</p>
          <p className="text-sm">Try adjusting your search or add a new item</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white"
            >
              {/* Image */}
              <div className="w-full h-48 bg-gray-100">
                <img 
                  src={item.img} 
                  alt={item.nameproduce} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{item.nameproduce}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {item.category}
                </span>
                
                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleEditItem(item)} 
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)} 
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
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