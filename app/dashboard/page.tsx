"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/config/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    revenue: 0,
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalUsers: 1243,
        activeSessions: 89,
        revenue: 12540,
      });
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back{user ? `, ${user.email}` : ''}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your dashboard today.
        </p>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div> */}

        {/* <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSessions}</p>
            </div>
          </div>
        </div> */}

        {/* <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              href="/dashboard/profile" 
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <span className="text-lg mr-3">👤</span>
              <span>View Profile</span>
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <span className="text-lg mr-3">⚙️</span>
              <span>Manage Settings</span>
            </Link>
          </div>
        </div> */}

        {/* <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span>You logged in successfully</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <span>Dashboard accessed</span>
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}