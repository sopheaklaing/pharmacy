
"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, Download, Eye, MoreVertical, Calendar, ArrowUpDown } from "lucide-react";
import { Order } from "../models/ItemModel";
import { mockOrders } from "../data/mockOrders";
// interface Order {
//   id: string;
//   customer: string;
//   customerEmail: string;
//   item_name: string;
//   total: string;
//   status: "pending" | "processing" | "completed" | "cancelled";
//   date: string;
//   items: number;
// }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Mock data - replace with actual API call
  // const mockOrders: Order[] = [
  //   {
  //     id: "ORD-2024-001",
  //     customer: "John Doe",
  //     customerEmail: "john.doe@example.com",
  //     item_name: "Wireless Headphones",
  //     total: "$149.99",
  //     status: "completed",
  //     date: "2024-01-15",
  //     items: 1
  //   },
  //   {
  //     id: "ORD-2024-002",
  //     customer: "Jane Smith",
  //     customerEmail: "jane.smith@example.com",
  //     item_name: "Smart Watch + Accessories",
  //     total: "$299.50",
  //     status: "processing",
  //     date: "2024-01-15",
  //     items: 2
  //   },
  //   {
  //     id: "ORD-2024-003",
  //     customer: "Mike Johnson",
  //     customerEmail: "mike.johnson@example.com",
  //     item_name: "Laptop Bag",
  //     total: "$89.99",
  //     status: "pending",
  //     date: "2024-01-14",
  //     items: 1
  //   },
  //   {
  //     id: "ORD-2024-004",
  //     customer: "Sarah Wilson",
  //     customerEmail: "sarah.wilson@example.com",
  //     item_name: "Phone Case",
  //     total: "$24.99",
  //     status: "completed",
  //     date: "2024-01-14",
  //     items: 1
  //   },
  //   {
  //     id: "ORD-2024-005",
  //     customer: "David Brown",
  //     customerEmail: "david.brown@example.com",
  //     item_name: "Tablet + Stylus",
  //     total: "$450.00",
  //     status: "cancelled",
  //     date: "2024-01-13",
  //     items: 2
  //   },
  //   {
  //     id: "ORD-2024-006",
  //     customer: "Emily Davis",
  //     customerEmail: "emily.davis@example.com",
  //     item_name: "Wireless Earbuds",
  //     total: "$129.99",
  //     status: "completed",
  //     date: "2024-01-13",
  //     items: 1
  //   }
  // ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
              <p className="text-gray-600">Manage and track all customer orders</p>
            </div>
            <button className="mt-4 lg:mt-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" />
              Export Orders
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by customer, order ID, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </button>

              <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      Order ID
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{order.item_name}</p>
                        <p className="text-xs text-gray-500">{order.items} item{order.items > 1 ? 's' : ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">{order.total}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters to see more results"
                  : "No orders have been placed yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredOrders.length}</span> of{" "}
                <span className="font-medium">{orders.length}</span> orders
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}