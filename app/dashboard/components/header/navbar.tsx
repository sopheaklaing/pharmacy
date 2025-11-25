"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/config/supabase";
import type { User } from "@supabase/supabase-js";
import { Bell, Menu, X, ChevronDown } from "lucide-react";
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

  const mockNotifications: Notification[] = [
    { id: "1", title: "New Order Received", message: "Order #ORD-2024-001 placed", time: "2 min ago", type: "order", read: false, orderId: "ORD-2024-001" },
    { id: "2", title: "Payment Confirmed", message: "Payment for order #ORD-2024-001 processed", time: "10 min ago", type: "payment", read: false, paymentId: "pay_001", orderId: "ORD-2024-001" },
    { id: "3", title: "System Update", message: "New features available", time: "1 hr ago", type: "system", read: true }
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

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
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) {
      setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
      setUnreadCount(prev => prev - 1);
    }
    switch (n.type) {
      case "order": n.orderId ? router.push(`/dashboard/orders?highlight=${n.orderId}`) : router.push("/dashboard/orders"); break;
      case "payment": n.paymentId ? router.push(`/dashboard/customers?highlight=${n.paymentId}`) : router.push("/dashboard/customers"); break;
      case "system": router.push("/dashboard/settings"); break;
      default: router.push("/dashboard");
    }
    setIsNotificationsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-6 py-3 flex justify-between items-center">
        {/* Left: Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 group"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" /> :
          <Menu className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />}
        </button>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-ping">{unreadCount}</span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl overflow-hidden animate-in fade-in-0 zoom-in-90 duration-200">
                
                {/* Dropdown Header */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Notifications</span>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                {/* Dropdown List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="p-4 text-gray-500 text-center">No notifications</div>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                        n.read ? "opacity-60" : "opacity-100"
                      }`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="mr-3">
                        {n.type === "order" && <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">O</span>}
                        {n.type === "payment" && <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">P</span>}
                        {n.type === "system" && <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm">S</span>}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{n.title}</div>
                        <div className="text-sm text-gray-500">{n.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 text-center">
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Close
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-medium">{user?.email?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <span className="hidden sm:block text-gray-700 font-medium">{user?.email?.split("@")[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
