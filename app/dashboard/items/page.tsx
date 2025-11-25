// ==================================================================
// 
// DESCRIPTION: Main medications management page for pharmacy system
// ==================================================================

"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../config/supabase";
import { Medication, NewMedication } from "../models/ItemModel";
import MedicationModal from "../components/Modal/ItemModal";

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [newMedication, setNewMedication] = useState<NewMedication>({
    img: "",
    name: "",
    generic_name: "",
    description: "",
    category: "",
    dosage_form: "",
    strength: "",
    manufacturer: "",
    stock_quantity: 0,
    reorder_level: 10,
    unit_price: 0,
    expiry_date: "",
    batch_number: "",
    prescription_required: false,
  });

  // LOAD MEDICATIONS
  const loadMedications = async () => {
    const { data, error } = await supabase.from("medications").select("*").order('name');
    if (error) console.error(error);
    if (data) setMedications(data);
  };

  // LOAD CATEGORIES
  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data.map((c: any) => c.name));
  };

  useEffect(() => {
    loadMedications();
    loadCategories();
  }, []);

  // -------------------- IMAGE UPLOAD --------------------
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        Swal.fire("Invalid File", "Please upload an image file (JPEG, PNG, GIF, or WebP)", "error");
        return null;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire("File Too Large", "Image must be less than 5MB", "error");
        return null;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      let baseName = file.name.replace(/\.[^/.]+$/, "");
      baseName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);
      
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomStr}-${baseName}.${ext}`;

      console.log("📤 Uploading file:", fileName);

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

  // -------------------- ADD MEDICATION --------------------
  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.category) {
      Swal.fire("Missing Fields", "Please fill in medication name and category", "warning");
      return;
    }

    let imageUrl = newMedication.img as string;
    
    if (newMedication.img instanceof File) {
      const uploaded = await uploadImage(newMedication.img);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const { error } = await supabase.from("medications").insert([{
      img: imageUrl,
      name: newMedication.name,
      generic_name: newMedication.generic_name,
      description: newMedication.description,
      category: newMedication.category,
      dosage_form: newMedication.dosage_form,
      strength: newMedication.strength,
      manufacturer: newMedication.manufacturer,
      stock_quantity: newMedication.stock_quantity,
      reorder_level: newMedication.reorder_level,
      unit_price: newMedication.unit_price,
      expiry_date: newMedication.expiry_date || null,
      batch_number: newMedication.batch_number,
      prescription_required: newMedication.prescription_required,
    }]);

    if (error) return Swal.fire("Error", error.message, "error");

    Swal.fire("Success!", "Medication added successfully", "success");
    loadMedications();
    resetForm();
  };

  // -------------------- UPDATE MEDICATION --------------------
  const handleUpdateMedication = async () => {
    if (!editingMedication) return;

    if (!newMedication.name || !newMedication.category) {
      Swal.fire("Missing Fields", "Please fill in medication name and category", "warning");
      return;
    }

    let imageUrl = newMedication.img as string;
    
    if (newMedication.img instanceof File) {
      const uploaded = await uploadImage(newMedication.img);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const { error } = await supabase.from("medications").update({
      img: imageUrl,
      name: newMedication.name,
      generic_name: newMedication.generic_name,
      description: newMedication.description,
      category: newMedication.category,
      dosage_form: newMedication.dosage_form,
      strength: newMedication.strength,
      manufacturer: newMedication.manufacturer,
      stock_quantity: newMedication.stock_quantity,
      reorder_level: newMedication.reorder_level,
      unit_price: newMedication.unit_price,
      expiry_date: newMedication.expiry_date || null,
      batch_number: newMedication.batch_number,
      prescription_required: newMedication.prescription_required,
    }).eq("id", editingMedication.id);

    if (error) return Swal.fire("Error", error.message, "error");

    Swal.fire("Updated!", "Medication updated successfully", "success");
    loadMedications();
    resetForm();
  };

  // -------------------- DELETE MEDICATION --------------------
  const handleDeleteMedication = (id: number) => {
    Swal.fire({
      title: "Delete medication?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("medications").delete().eq("id", id);
        
        if (error) {
          Swal.fire("Error", error.message, "error");
        } else {
          Swal.fire("Deleted!", "Medication removed successfully", "success");
          loadMedications();
        }
      }
    });
  };

  // -------------------- EDIT MEDICATION --------------------
  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setNewMedication({
      img: medication.img,
      name: medication.name,
      generic_name: medication.generic_name || "",
      description: medication.description,
      category: medication.category,
      dosage_form: medication.dosage_form || "",
      strength: medication.strength || "",
      manufacturer: medication.manufacturer || "",
      stock_quantity: medication.stock_quantity,
      reorder_level: medication.reorder_level,
      unit_price: medication.unit_price,
      expiry_date: medication.expiry_date || "",
      batch_number: medication.batch_number || "",
      prescription_required: medication.prescription_required,
    });
    setIsAddModalOpen(true);
  };

  // -------------------- RESET FORM --------------------
  const resetForm = () => {
    setNewMedication({
      img: "",
      name: "",
      generic_name: "",
      description: "",
      category: "",
      dosage_form: "",
      strength: "",
      manufacturer: "",
      stock_quantity: 0,
      reorder_level: 10,
      unit_price: 0,
      expiry_date: "",
      batch_number: "",
      prescription_required: false,
    });
    setEditingMedication(null);
    setIsAddModalOpen(false);
  };

  // -------------------- FILTER MEDICATIONS --------------------
  const filteredMedications = medications.filter((med) => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.generic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "" || med.category === categoryFilter;
    
    const matchesLowStock = !showLowStock || med.stock_quantity <= med.reorder_level;
    
    const matchesExpiring = !showExpiringSoon || 
      (med.expiry_date && new Date(med.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesCategory && matchesLowStock && matchesExpiring;
  });

  // Check if medication is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(expiryDate) <= thirtyDaysFromNow;
  };

  // Check if medication is expired
  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">💊 Pharmacy Inventory</h1>
        <p className="text-gray-600">Manage your medication stock efficiently</p>
      </div>

      {/* FILTERS AND SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search medications..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showLowStock 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showLowStock ? '✓ ' : ''}Low Stock
          </button>
          <button
            onClick={() => setShowExpiringSoon(!showExpiringSoon)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showExpiringSoon 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showExpiringSoon ? '✓ ' : ''}Expiring Soon
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Medication
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Total Medications</div>
          <div className="text-2xl font-bold text-blue-600">{medications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Low Stock Items</div>
          <div className="text-2xl font-bold text-orange-600">
            {medications.filter(m => m.stock_quantity <= m.reorder_level).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Expiring Soon</div>
          <div className="text-2xl font-bold text-red-600">
            {medications.filter(m => isExpiringSoon(m.expiry_date)).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Total Stock Value</div>
          <div className="text-2xl font-bold text-green-600">
            ${medications.reduce((sum, m) => sum + (m.stock_quantity * m.unit_price), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* MEDICATIONS GRID */}
      {filteredMedications.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          <p className="text-lg">No medications found</p>
          <p className="text-sm">Try adjusting your filters or add a new medication</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedications.map((med) => (
            <div 
              key={med.id} 
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white"
            >
              {/* Image */}
              <div className="w-full h-48 bg-gray-100 relative">
                <img
                  src={med.img}
                  alt={med.name}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                           e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
                }}
                />

                {med.prescription_required && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    ℞ Rx
                  </span>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{med.name}</h3>
                {med.generic_name && (
                  <p className="text-xs text-gray-500 mb-1 italic">({med.generic_name})</p>
                )}
                
                <div className="flex gap-2 mb-2 text-xs">
                  {med.strength && (
                    <span className="font-medium text-blue-600">{med.strength}</span>
                  )}
                  {med.dosage_form && (
                    <span className="text-gray-600">• {med.dosage_form}</span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{med.description}</p>
                
                {/* Manufacturer */}
                {med.manufacturer && (
                  <p className="text-xs text-gray-500 mb-2">Mfr: {med.manufacturer}</p>
                )}

                {/* Expiry Warning */}
                {med.expiry_date && (
                  <div className={`mb-2 px-2 py-1 text-xs rounded ${
                    isExpired(med.expiry_date)
                      ? 'bg-red-100 text-red-700'
                      : isExpiringSoon(med.expiry_date)
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isExpired(med.expiry_date) 
                      ? '⚠️ EXPIRED' 
                      : isExpiringSoon(med.expiry_date)
                      ? '⚠️ Expiring Soon'
                      : `Exp: ${new Date(med.expiry_date).toLocaleDateString()}`
                    }
                  </div>
                )}
                
                {/* Stock Warning */}
                {med.stock_quantity <= med.reorder_level && (
                  <div className="mb-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                    ⚠️ Low Stock: {med.stock_quantity} units
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-green-600">
                    ${med.unit_price.toFixed(2)}
                  </span>
                  <span className={`text-sm font-semibold ${
                    med.stock_quantity <= med.reorder_level ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Stock: {med.stock_quantity}
                  </span>
                </div>
                
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-2">
                  {med.category}
                </span>
                
                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleEditMedication(med)} 
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteMedication(med.id)} 
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
      <MedicationModal
        isOpen={isAddModalOpen}
        editingMedication={editingMedication}
        newMedication={newMedication}
        setNewMedication={setNewMedication}
        onClose={resetForm}
        onSubmit={editingMedication ? handleUpdateMedication : handleAddMedication}
        categories={categories}
        refreshCategories={loadCategories}
      />
    </div>
  );
}