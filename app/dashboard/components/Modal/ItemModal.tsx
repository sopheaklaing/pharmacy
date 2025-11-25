// ==================================================================
// FILE: app/components/Modal/MedicationModal.tsx
// DESCRIPTION: Modal component for adding and editing medications
// ==================================================================

"use client";

import React, { useState } from "react";
import { supabase } from "../../../config/supabase";
import { NewMedication, Medication, MedicationModalProps } from "../../models/ItemModel";

export default function MedicationModal({
  isOpen,
  editingMedication,
  newMedication,
  setNewMedication,
  onClose,
  onSubmit,
  categories,
  refreshCategories,
}: MedicationModalProps) {
  const [newCategory, setNewCategory] = useState("");

  if (!isOpen) return null;

  // Create new category
  const createCategory = async () => {
    if (!newCategory) return;
    await supabase.from("categories").insert([{ name: newCategory }]);
    setNewCategory("");
    refreshCategories();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">
            {editingMedication ? "Edit Medication" : "Add New Medication"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium mb-2">Medication Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewMedication({ ...newMedication, img: e.target.files[0] });
                }
              }}
            />
            {newMedication.img && typeof newMedication.img === 'string' && (
              <img src={newMedication.img} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded border" />
            )}
          </div>

          {/* NAME (REQUIRED) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Medication Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Paracetamol"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newMedication.name}
              onChange={(e) =>
                setNewMedication({ ...newMedication, name: e.target.value })
              }
            />
          </div>

          {/* GENERIC NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">Generic Name</label>
            <input
              type="text"
              placeholder="e.g., Acetaminophen"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newMedication.generic_name}
              onChange={(e) =>
                setNewMedication({ ...newMedication, generic_name: e.target.value })
              }
            />
          </div>

          {/* DOSAGE FORM & STRENGTH */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Dosage Form</label>
              <select
                value={newMedication.dosage_form}
                onChange={(e) => setNewMedication({ ...newMedication, dosage_form: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Form</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Cream">Cream</option>
                <option value="Ointment">Ointment</option>
                <option value="Drops">Drops</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Powder">Powder</option>
                <option value="Suppository">Suppository</option>
                <option value="Solution">Solution</option>
                <option value="Suspension">Suspension</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Strength</label>
              <input
                type="text"
                placeholder="e.g., 500mg"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newMedication.strength}
                onChange={(e) => setNewMedication({ ...newMedication, strength: e.target.value })}
              />
            </div>
          </div>

          {/* MANUFACTURER */}
          <div>
            <label className="block text-sm font-medium mb-2">Manufacturer</label>
            <input
              type="text"
              placeholder="Manufacturer name"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newMedication.manufacturer}
              onChange={(e) =>
                setNewMedication({ ...newMedication, manufacturer: e.target.value })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Description and usage instructions"
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newMedication.description}
              onChange={(e) =>
                setNewMedication({ ...newMedication, description: e.target.value })
              }
            />
          </div>

          {/* CATEGORY (REQUIRED) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={newMedication.category}
              onChange={(e) =>
                setNewMedication({ ...newMedication, category: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* NEW CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-2">Add New Category</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Category"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                onClick={createCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* STOCK & REORDER LEVEL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newMedication.stock_quantity}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, stock_quantity: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reorder Level</label>
              <input
                type="number"
                min="0"
                placeholder="10"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newMedication.reorder_level}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, reorder_level: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* PRICE & EXPIRY DATE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newMedication.unit_price}
                onChange={(e) => setNewMedication({ ...newMedication, unit_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newMedication.expiry_date}
                onChange={(e) => setNewMedication({ ...newMedication, expiry_date: e.target.value })}
              />
            </div>
          </div>

          {/* BATCH NUMBER */}
          <div>
            <label className="block text-sm font-medium mb-2">Batch Number</label>
            <input
              type="text"
              placeholder="Batch/Lot number"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newMedication.batch_number}
              onChange={(e) =>
                setNewMedication({ ...newMedication, batch_number: e.target.value })
              }
            />
          </div>

          {/* PRESCRIPTION REQUIRED */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="prescription_required"
              checked={newMedication.prescription_required}
              onChange={(e) => setNewMedication({ ...newMedication, prescription_required: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="prescription_required" className="text-sm font-medium cursor-pointer">
              Prescription Required
            </label>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingMedication ? "Update Medication" : "Add Medication"}
          </button>
        </div>
      </div>
    </div>
  );
}