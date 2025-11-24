"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../config/supabase";
import {Item} from "./../models/ItemModel";

export default function StockPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [stockTotals, setStockTotals] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Load items
  const loadItems = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.from("items").select("*");
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      setItems(data);
      await calculateStockTotals(data);
    }

    setIsLoading(false);
  };

  // Calculate stock totals
  const calculateStockTotals = async (itemsList: Item[]) => {
    const totals: { [key: number]: number } = {};

    for (const item of itemsList) {
      const { data: logs, error } = await supabase
        .from("stock_logs")
        .select("quantity")
        .eq("item_id", item.id);

      if (!error && logs) {
        totals[item.id] = logs.reduce(
          (sum, log: any) => sum + log.quantity,
          0
        );
      }
    }

    setStockTotals(totals);
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Add stock
  const handleAddStock = async () => {
    if (!selectedItem || quantity <= 0) {
      Swal.fire("Warning", "Select an item & enter valid quantity", "warning");
      return;
    }

    setIsAdding(true);

    const { error } = await supabase.from("stock_logs").insert([
      {
        item_id: selectedItem,
        quantity: quantity,
      },
    ]);

    if (error) {
      Swal.fire("Error", error.message, "error");
      setIsAdding(false);
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Stock Added",
      text: `Added ${quantity} pcs`,
      timer: 1800,
      showConfirmButton: false,
    });

    setQuantity(0);
    setSelectedItem(null);

    await loadItems();
    setIsAdding(false);
  };

  const getStockLevelColor = (qty: number) => {
    if (qty === 0) return "text-red-500 bg-red-50";
    if (qty < 10) return "text-orange-500 bg-orange-50";
    return "text-green-500 bg-green-50";
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Stock Management</h1>
          <p className="text-gray-600">Manage your inventory simply</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT - Add Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Add Stock</h2>

            {/* Select Item */}
            <label className="block mb-2 text-sm font-medium">Choose Item</label>
            <select
              className="w-full p-3 border rounded-xl mb-4"
              value={selectedItem || ""}
              onChange={(e) => setSelectedItem(Number(e.target.value))}
            >
              <option value="">-- Select item --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameproduce} (Stock: {stockTotals[item.id] || 0})
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
              className="w-full p-3 border rounded-xl mb-4"
              placeholder="Enter quantity..."
            />

            <button
              onClick={handleAddStock}
              disabled={isAdding}
              className="w-full bg-blue-600 py-3 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add Stock"}
            </button>
          </div>

          {/* RIGHT - Stock List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Current Stock</h2>
              <span className="text-sm text-gray-500">{items.length} items</span>
            </div>

            {items.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No items found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-xl hover:border-blue-300 transition flex gap-4 items-start"
                  >
                    <img
                      src={item.img || "/api/placeholder/80/80"}
                      alt={item.nameproduce}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.nameproduce}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-2 rounded-lg text-center ${getStockLevelColor(
                        stockTotals[item.id] || 0
                      )}`}
                    >
                      <div className="text-sm">Stock</div>
                      <div className="text-lg font-bold">
                        {stockTotals[item.id] || 0}
                      </div>
                      <div className="text-xs">pcs</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
