"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../config/supabase";

interface Item {
  id: number;
  img: string;
  nameproduce: string;
  description: string;
  category: string;
}

export default function StockPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [stockTotals, setStockTotals] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Load all items
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

  // Calculate total stock per item
  const calculateStockTotals = async (itemsList: Item[]) => {
    const totals: { [key: number]: number } = {};
    for (const item of itemsList) {
      const { data: logs, error } = await supabase
        .from("stock_logs")
        .select("quantity")
        .eq("item_id", item.id);
      if (!error && logs) {
        totals[item.id] = logs.reduce((sum, log: any) => sum + log.quantity, 0);
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
      Swal.fire("Warning", "Select an item and enter a valid quantity", "warning");
      return;
    }

    setIsAdding(true);
    const { error } = await supabase.from("stock_logs").insert([
      { item_id: selectedItem, quantity }
    ]);

    if (error) {
      Swal.fire("Error", error.message, "error");
      setIsAdding(false);
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Stock Added",
      text: `Added ${quantity} units to ${items.find(item => item.id === selectedItem)?.nameproduce}`,
      timer: 2000,
      showConfirmButton: false
    });
    
    setQuantity(0);
    setSelectedItem(null);
    await loadItems();
    setIsAdding(false);
  };

  const getStockLevelColor = (quantity: number) => {
    if (quantity === 0) return "text-red-500 bg-red-50";
    if (quantity < 10) return "text-orange-500 bg-orange-50";
    return "text-green-500 bg-green-50";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Stock Management</h1>
          <p className="text-gray-600">Manage your inventory and track stock levels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Stock Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Add Stock</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    value={selectedItem || ""}
                    onChange={(e) => setSelectedItem(Number(e.target.value))}
                  >
                    <option value="">-- Choose an item --</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nameproduce} {stockTotals[item.id] !== undefined && `(Stock: ${stockTotals[item.id]})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Add</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Enter quantity..."
                  />
                </div>

                <button
                  onClick={handleAddStock}
                  disabled={isAdding}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding Stock...
                    </span>
                  ) : (
                    "Add Stock"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Stock Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Current Stock</h2>
                </div>
                <span className="text-sm text-gray-500">{items.length} items</span>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 text-lg">No items found</p>
                  <p className="text-gray-400 text-sm mt-1">Add some items to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                    >
                      <div className="flex gap-4 items-start">
                        <img
                          src={item.img || "/api/placeholder/80/80"}
                          alt={item.nameproduce}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{item.nameproduce}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-2 rounded-lg font-bold text-center ${getStockLevelColor(stockTotals[item.id] || 0)}`}>
                          <div className="text-sm font-medium">Stock</div>
                          <div className="text-lg">{stockTotals[item.id] || 0}</div>
                          <div className="text-xs">pcs</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}