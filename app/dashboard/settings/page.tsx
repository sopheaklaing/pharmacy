// ==================================================================
// FILE: app/stock/page.tsx
// DESCRIPTION: Stock management page with IN/OUT transactions
// ==================================================================

"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../config/supabase";
import { Medication } from "../models/ItemModel";

interface StockLog {
  id: number;
  medication_id: number;
  quantity: number;
  transaction_type: 'in' | 'out';
  reason?: string;
  batch_number?: string;
  expiry_date?: string;
  created_at: string;
  medications?: {
    name: string;
    strength?: string;
    dosage_form?: string;
  };
}

export default function StockPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [reason, setReason] = useState<string>("");
  const [batchNumber, setBatchNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [recentLogs, setRecentLogs] = useState<StockLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Load medications
  const loadMedications = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .order('name');
      
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      setMedications(data);
    }

    setIsLoading(false);
  };

  // Load recent stock logs
  const loadRecentLogs = async () => {
    const { data, error } = await supabase
      .from("stock_logs")
      .select(`
        *,
        medications (name, strength, dosage_form)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setRecentLogs(data);
    }
  };

  useEffect(() => {
    loadMedications();
    loadRecentLogs();
  }, []);

  // Add/Remove stock
  const handleStockTransaction = async () => {
    if (!selectedMedication || quantity <= 0) {
      Swal.fire("Warning", "Select a medication & enter valid quantity", "warning");
      return;
    }

    // Find selected medication
    const medication = medications.find(m => m.id === selectedMedication);
    if (!medication) return;

    // Check if removing more stock than available
    if (transactionType === 'out' && medication.stock_quantity < quantity) {
      Swal.fire("Error", `Only ${medication.stock_quantity} units available`, "error");
      return;
    }

    setIsAdding(true);

    // Calculate new stock quantity
    const quantityChange = transactionType === 'in' ? quantity : -quantity;
    const newStockQuantity = medication.stock_quantity + quantityChange;

    // Insert stock log
    const { error: logError } = await supabase.from("stock_logs").insert([
      {
        medication_id: selectedMedication,
        quantity: quantityChange,
        transaction_type: transactionType,
        reason: reason || null,
        batch_number: batchNumber || null,
        expiry_date: expiryDate || null,
      },
    ]);

    if (logError) {
      Swal.fire("Error", logError.message, "error");
      setIsAdding(false);
      return;
    }

    // Update medication stock quantity
    const { error: updateError } = await supabase
      .from("medications")
      .update({ stock_quantity: newStockQuantity })
      .eq("id", selectedMedication);

    if (updateError) {
      Swal.fire("Error", updateError.message, "error");
      setIsAdding(false);
      return;
    }

    Swal.fire({
      icon: "success",
      title: transactionType === 'in' ? "Stock Added" : "Stock Removed",
      text: `${transactionType === 'in' ? 'Added' : 'Removed'} ${quantity} units`,
      timer: 1800,
      showConfirmButton: false,
    });

    // Reset form
    setQuantity(0);
    setSelectedMedication(null);
    setReason("");
    setBatchNumber("");
    setExpiryDate("");

    await loadMedications();
    await loadRecentLogs();
    setIsAdding(false);
  };

  const getStockLevelColor = (medication: Medication) => {
    if (medication.stock_quantity === 0) return "text-red-500 bg-red-50 border-red-200";
    if (medication.stock_quantity <= medication.reorder_level) return "text-orange-500 bg-orange-50 border-orange-200";
    return "text-green-500 bg-green-50 border-green-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">📦 Stock Management</h1>
          <p className="text-gray-600">Track and manage medication inventory</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600">Total Medications</div>
            <div className="text-2xl font-bold text-blue-600">{medications.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600">Out of Stock</div>
            <div className="text-2xl font-bold text-red-600">
              {medications.filter(m => m.stock_quantity === 0).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600">Low Stock</div>
            <div className="text-2xl font-bold text-orange-600">
              {medications.filter(m => m.stock_quantity > 0 && m.stock_quantity <= m.reorder_level).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600">Total Items in Stock</div>
            <div className="text-2xl font-bold text-green-600">
              {medications.reduce((sum, m) => sum + m.stock_quantity, 0)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT - Add/Remove Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-lg lg:sticky lg:top-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Stock Transaction</h2>

            {/* Transaction Type */}
            <label className="block mb-2 text-sm font-medium">Transaction Type</label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTransactionType('in')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  transactionType === 'in'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ➕ Stock In
              </button>
              <button
                onClick={() => setTransactionType('out')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  transactionType === 'out'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ➖ Stock Out
              </button>
            </div>

            {/* Select Medication */}
            <label className="block mb-2 text-sm font-medium">Choose Medication</label>
            <select
              className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedMedication || ""}
              onChange={(e) => setSelectedMedication(Number(e.target.value))}
            >
              <option value="">-- Select medication --</option>
              {medications.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.name} {med.strength && `- ${med.strength}`} (Stock: {med.stock_quantity})
                </option>
              ))}
            </select>

            {/* Quantity */}
            <label className="block mb-2 text-sm font-medium">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter quantity..."
            />

            {/* Reason */}
            <label className="block mb-2 text-sm font-medium">Reason (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={transactionType === 'in' ? 'e.g., New stock arrival' : 'e.g., Sale, Expired, Damaged'}
            />

            {/* Additional fields for Stock In */}
            {transactionType === 'in' && (
              <>
                <label className="block mb-2 text-sm font-medium">Batch Number (Optional)</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Batch/Lot number"
                />

                <label className="block mb-2 text-sm font-medium">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </>
            )}

            <button
              onClick={handleStockTransaction}
              disabled={isAdding}
              className={`w-full py-3 text-white rounded-xl transition disabled:opacity-50 ${
                transactionType === 'in'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAdding ? "Processing..." : transactionType === 'in' ? "Add Stock" : "Remove Stock"}
            </button>
          </div>

          {/* RIGHT - Stock List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Current Stock Levels</h2>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
              >
                {showLogs ? 'Hide' : 'Show'} Transaction Logs
              </button>
            </div>

            {showLogs ? (
              // Transaction Logs
              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Recent Transactions</h3>
                {recentLogs.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No transactions yet</p>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {recentLogs.map((log: StockLog) => (
                      <div
                        key={log.id}
                        className={`p-3 border rounded-lg flex justify-between items-start ${
                          log.transaction_type === 'in' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {log.medications?.name} {log.medications?.strength && `- ${log.medications.strength}`}
                          </div>
                          {log.reason && (
                            <div className="text-sm text-gray-600">{log.reason}</div>
                          )}
                          {log.batch_number && (
                            <div className="text-xs text-gray-500">Batch: {log.batch_number}</div>
                          )}
                          {log.expiry_date && (
                            <div className="text-xs text-gray-500">Expiry: {new Date(log.expiry_date).toLocaleDateString()}</div>
                          )}
                          <div className="text-xs text-gray-400">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className={`font-bold text-lg ${log.transaction_type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                          {log.transaction_type === 'in' ? '+' : ''}{log.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Stock List
              <>
                {medications.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">No medications found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medications.map((med) => (
                      <div
                        key={med.id}
                        className={`p-4 border-2 rounded-xl hover:shadow-md transition flex gap-4 items-start ${
                          getStockLevelColor(med)
                        }`}
                      >
                        <img
                          src={med.img || "https://via.placeholder.com/80x80?text=No+Image"}
                          alt={med.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold">{med.name}</h3>
                          {med.strength && (
                            <p className="text-sm font-medium">{med.strength}</p>
                          )}
                          {med.dosage_form && (
                            <p className="text-xs text-gray-600">{med.dosage_form}</p>
                          )}
                          <span className="text-xs bg-white px-2 py-1 rounded-full inline-block mt-1">
                            {med.category}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-medium">Stock</div>
                          <div className="text-2xl font-bold">
                            {med.stock_quantity}
                          </div>
                          <div className="text-xs">
                            Min: {med.reorder_level}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}