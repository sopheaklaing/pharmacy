"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/config/supabase";
import type { User } from "@supabase/supabase-js";
import { Bell, Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "order" | "payment" | "system";
  read: boolean;
  orderId?: string;
  paymentId?: string;
}

export default function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock notifications data with proper IDs for navigation
  const mockNotifications: Notification[] = [
    {
      id: "1",
      title: "New Order Received",
      message: "Order #ORD-2024-001 has been placed",
      time: "2 minutes ago",
      type: "order",
      read: false,
      orderId: "ORD-2024-001"
    },
    {
      id: "2",
      title: "Payment Confirmed",
      message: "Payment for order #ORD-2024-001 has been processed",
      time: "10 minutes ago",
      type: "payment",
      read: false,
      paymentId: "pay_001",
      orderId: "ORD-2024-001"
    },
    {
      id: "3",
      title: "Ready for Pickup",
      message: "Order #ORD-2023-156 is ready for collection",
      time: "1 hour ago",
      type: "order",
      read: true,
      orderId: "ORD-2023-156"
    },
    {
      id: "4",
      title: "Payment Failed",
      message: "Payment for order #ORD-2024-002 failed to process",
      time: "30 minutes ago",
      type: "payment",
      read: false,
      paymentId: "pay_002",
      orderId: "ORD-2024-002"
    },
    {
      id: "5",
      title: "System Update",
      message: "New features available in your dashboard",
      time: "2 hours ago",
      type: "system",
      read: true
    }
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Load notifications
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      setNotifications(notifications.map(notif => 
        notif.id === notification.id ? { ...notif, read: true } : notif
      ));
      setUnreadCount(prev => prev - 1);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "order":
        // Navigate to orders page, optionally with order ID
        if (notification.orderId) {
          router.push(`/dashboard/orders?highlight=${notification.orderId}`);
        } else {
          router.push("/dashboard/orders");
        }
        break;
      
      case "payment":
        // Navigate to customers page, optionally with payment ID
        if (notification.paymentId) {
          router.push(`/dashboard/customers?highlight=${notification.paymentId}`);
        } else {
          router.push("/dashboard/customers");
        }
        break;
      
      case "system":
        // For system notifications, you might want to go to a system page or do nothing
        router.push("/dashboard/settings");
        break;
      
      default:
        // Default fallback
        router.push("/dashboard");
    }
    
    setIsNotificationsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "🛒";
      case "payment":
        return "💳";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const handleViewAllNotifications = () => {
    setIsNotificationsOpen(false);
    router.push("/dashboard/notifications");
  };

  const handleViewAllOrders = () => {
    setIsNotificationsOpen(false);
    router.push("/dashboard/orders");
  };

  const handleViewAllPayments = () => {
    setIsNotificationsOpen(false);
    router.push("/dashboard/customers");
  };

  // Filter notifications by type for the footer buttons
  const orderNotifications = notifications.filter(n => n.type === "order");
  const paymentNotifications = notifications.filter(n => n.type === "payment");

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-6 py-3">
        <div className="flex justify-between items-center">

          {/* LEFT SIDE - Menu Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 
                         border border-transparent hover:border-gray-200 group"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              )}
            </button>
            
            {/* Breadcrumb or Title can go here */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
          </div>

          {/* RIGHT SIDE - Notifications & User */}
          <div className="flex items-center space-x-4">
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 
                           border border-transparent hover:border-gray-200 group"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                
                {/* Unread indicator */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 
                                 text-white text-xs rounded-full flex items-center justify-center 
                                 border-2 border-white shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-sm 
                              shadow-xl border border-gray-200 rounded-2xl overflow-hidden 
                              animate-in fade-in-0 zoom-in-95 duration-200">
                  
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 
                                   transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group
                                      ${notification.read 
                                        ? 'bg-white hover:bg-gray-50' 
                                        : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                                      }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg 
                                            flex items-center justify-center text-sm 
                                            shadow-sm border">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <p className={`text-sm font-medium truncate ${
                                    notification.read ? 'text-gray-900' : 'text-gray-900'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 
                                                         group-hover:opacity-100 transition-opacity 
                                                         flex-shrink-0 mt-1" />
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center 
                                      justify-center mx-auto mb-4">
                          <Bell className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium">No notifications</p>
                        <p className="text-gray-500 text-sm mt-1">
                          We'll notify you when something arrives
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer with multiple action buttons */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
                    {/* View All Notifications */}
                    <button
                      onClick={handleViewAllNotifications}
                      className="w-full py-2 px-4 bg-white border border-gray-200 rounded-xl 
                               text-sm font-medium text-gray-700 hover:bg-gray-50 
                               hover:border-gray-300 transition-all duration-200 
                               flex items-center justify-center space-x-2"
                    >
                      <span>View all notifications</span>
                      <ChevronDown className="w-4 h-4 transform rotate-270" />
                    </button>

                    {/* Quick Action Buttons */}
                    <div className="flex space-x-2">
                      {orderNotifications.length > 0 && (
                        <button
                          onClick={handleViewAllOrders}
                          className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg 
                                   text-sm font-medium hover:bg-blue-700 transition-colors 
                                   flex items-center justify-center space-x-1"
                        >
                          <span>Orders ({orderNotifications.length})</span>
                        </button>
                      )}
                      
                      {paymentNotifications.length > 0 && (
                        <button
                          onClick={handleViewAllPayments}
                          className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg 
                                   text-sm font-medium hover:bg-green-700 transition-colors 
                                   flex items-center justify-center space-x-1"
                        >
                          <span>Payments ({paymentNotifications.length})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile (Placeholder) */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 
                            rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}