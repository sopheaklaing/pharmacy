"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/config/supabase";
import type { User } from "@supabase/supabase-js";
import { Search, Filter, Download, Eye, Calendar } from "lucide-react";
import {Payment} from "./../models/ItemModel";
import { mockPayments } from "../data/mockPayments";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Mock data - replace with actual API calls
  // const mockPayments: Payment[] = [
  //   {
  //     id: "pay_001",
  //     orderId: "ORD-2024-001",
  //     userId: "user_001",
  //     userName: "John Doe",
  //     userEmail: "john.doe@example.com",
  //     amount: 149.99,
  //     currency: "USD",
  //     status: "completed",
  //     paymentMethod: "credit_card",
  //     createdAt: "2024-01-15T10:30:00Z",
  //     processedAt: "2024-01-15T10:31:00Z"
  //   },
  //   {
  //     id: "pay_002",
  //     orderId: "ORD-2024-002",
  //     userId: "user_002",
  //     userName: "Jane Smith",
  //     userEmail: "jane.smith@example.com",
  //     amount: 299.50,
  //     currency: "USD",
  //     status: "pending",
  //     paymentMethod: "paypal",
  //     createdAt: "2024-01-15T11:15:00Z",
  //     processedAt: null
  //   },
  //   {
  //     id: "pay_003",
  //     orderId: "ORD-2024-003",
  //     userId: "user_003",
  //     userName: "Mike Johnson",
  //     userEmail: "mike.johnson@example.com",
  //     amount: 89.99,
  //     currency: "USD",
  //     status: "completed",
  //     paymentMethod: "credit_card",
  //     createdAt: "2024-01-14T14:20:00Z",
  //     processedAt: "2024-01-14T14:22:00Z"
  //   },
  //   {
  //     id: "pay_004",
  //     orderId: "ORD-2024-004",
  //     userId: "user_004",
  //     userName: "Sarah Wilson",
  //     userEmail: "sarah.wilson@example.com",
  //     amount: 199.99,
  //     currency: "USD",
  //     status: "failed",
  //     paymentMethod: "credit_card",
  //     createdAt: "2024-01-14T16:45:00Z",
  //     processedAt: null
  //   },
  //   {
  //     id: "pay_005",
  //     orderId: "ORD-2024-005",
  //     userId: "user_005",
  //     userName: "David Brown",
  //     userEmail: "david.brown@example.com",
  //     amount: 450.00,
  //     currency: "USD",
  //     status: "refunded",
  //     paymentMethod: "bank_transfer",
  //     createdAt: "2024-01-13T09:10:00Z",
  //     processedAt: "2024-01-13T09:12:00Z"
  //   }
  // ];

  useEffect(() => {
    // Simulate API call
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // In real app, you would fetch from your API
        // const { data, error } = await supabase.from('payments').select('*');
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply date filter (simplified)
    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt).toDateString() === today.toDateString()
          );
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
      }
    }

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, dateFilter, payments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
          <p className="text-gray-600">Manage and view all payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalRevenue, "USD")}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.filter(p => p.status === 'pending').length}
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
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
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
                placeholder="Search payments by user, order ID, or payment ID..."
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
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>

              <button className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment & User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {payment.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {payment.userName}
                            </p>
                            <p className="text-sm text-gray-500">{payment.userEmail}</p>
                            <p className="text-xs text-gray-400 mt-1">Order: {payment.orderId}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {payment.paymentMethod === 'credit_card' ? '💳' : 
                           payment.paymentMethod === 'paypal' ? '🔵' : 
                           payment.paymentMethod === 'bank_transfer' ? '🏦' : '💰'}
                        </span>
                        <span className="text-sm text-gray-900 capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.createdAt)}
                      </div>
                      {payment.processedAt && (
                        <div className="text-xs text-gray-500">
                          Processed: {formatDate(payment.processedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "No payment transactions have been processed yet"}
              </p>
            </div>
          )}

          {/* Pagination would go here */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredPayments.length}</span> payments
              </p>
              {/* Pagination controls would go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}