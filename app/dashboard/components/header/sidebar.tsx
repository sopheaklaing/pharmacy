  // // app/components/Sidebar.tsx
  // "use client";

  // import Image from "next/image";
  // import Link from "next/link";
  // import { usePathname, useRouter } from "next/navigation";
  // import { useEffect, useState } from "react";
  // import { supabase } from "@/app/config/supabase";
  // import type { User } from "@supabase/supabase-js";

  // // icons
  // import {
  //   FiHome,
  //   FiPackage,
  //   FiShoppingCart,
  //   FiUsers,
  //   FiTruck,
  //   FiBarChart2,
  //   FiSettings,
  //   FiLogOut,
  //   FiChevronLeft,
  //   FiChevronRight
  // } from "react-icons/fi";

  // import profileImg from "../../../../public/profile.png";

  // interface SidebarProps {
  //   isOpen: boolean;
  //   onToggle: () => void;
  // }

  // export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  //   const pathname = usePathname();
  //   const router = useRouter();
  //   const [user, setUser] = useState<User | null>(null);

  //   const menuItems = [
  //     { href: "/dashboard", label: "Dashboard", icon: <FiHome /> },
  //     { href: "/dashboard/items", label: "Item Management", icon: <FiPackage /> },
  //     { href: "/dashboard/orders", label: "Orders", icon: <FiShoppingCart /> },
  //     { href: "/dashboard/customers", label: "Customers", icon: <FiUsers /> },
  //     { href: "/dashboard/suppliers", label: "Suppliers", icon: <FiTruck /> },
  //     { href: "/dashboard/reports", label: "Reports", icon: <FiBarChart2 /> },
  //     { href: "/dashboard/settings", label: "Settings", icon: <FiSettings /> },
  //   ];

  //   // Get user info
  //   useEffect(() => {
  //     const getUser = async () => {
  //       const { data: { user } } = await supabase.auth.getUser();
  //       setUser(user);
  //     };
  //     getUser();
  //   }, []);

  //   const handleLogout = async () => {
  //     const { error } = await supabase.auth.signOut();
  //     if (!error) router.replace("/login");
  //   };

  //   return (
  //     <>
  //       <aside
  //         className={`
  //           fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-20
  //           transition-all duration-300 ease-in-out
  //           ${isOpen ? "w-64" : "w-20"}
  //         `}
  //       >
  //         {/* TOP SECTION */}
  //         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
  //           <div className="flex items-center space-x-3">
  //             <div className={`${isOpen ? "w-12 h-12" : "w-10 h-10"} rounded-full overflow-hidden`}>
  //               <Image
  //                 src={profileImg}
  //                 alt="Profile"
  //                 width={48}
  //                 height={48}
  //                 className="object-cover"
  //               />
  //             </div>

  //             {isOpen && (
  //               <span className="font-semibold text-gray-800 text-lg">Admin</span>
  //             )}
  //           </div>

  //           <button
  //             onClick={onToggle}
  //             className="p-2 rounded-lg hover:bg-gray-100 transition duration-200 ml-auto"
  //           >
  //             {isOpen ? (
  //               <FiChevronLeft className="text-lg" />
  //             ) : (
  //               <FiChevronRight className="text-lg" />
  //             )}
  //           </button>
  //         </div>

  //         {/* MENU ITEMS */}
  //         <nav className="mt-6 flex flex-col h-[calc(100vh-170px)]">
  //           <ul className="space-y-2 px-3 flex-1">
  //             {menuItems.map((item) => (
  //               <li key={item.href}>
  //                 <Link
  //                   href={item.href}
  //                   className={`
  //                     flex items-center rounded-lg transition duration-200 group
  //                     ${isOpen ? "px-4 py-3 space-x-3" : "px-3 py-3 justify-center"}
  //                     ${
  //                       pathname === item.href
  //                         ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700 font-semibold"
  //                         : "text-gray-700 hover:bg-gray-100"
  //                     }
  //                   `}
  //                   title={!isOpen ? item.label : ""}
  //                 >
  //                   <span className="text-lg flex-shrink-0">{item.icon}</span>
  //                   {isOpen && <span>{item.label}</span>}
  //                 </Link>
  //               </li>
  //             ))}
  //           </ul>

  //           {/* USER INFO + LOGOUT */}
  //           <div className="border-t border-gray-200 p-4">
  //             {/* User Info */}
  //             {user && (
  //               <div
  //                 className={`flex items-center mb-3 ${
  //                   isOpen ? "space-x-3" : "justify-center"
  //                 }`}
  //               >
  //                 <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
  //                   <span className="text-indigo-600 text-sm font-semibold">
  //                     {user.email?.charAt(0).toUpperCase()}
  //                   </span>
  //                 </div>

  //                 {isOpen && (
  //                   <div className="leading-tight">
  //                     <p className="text-sm font-medium text-gray-900">
  //                       {user.email}
  //                     </p>
  //                     <p className="text-xs text-gray-500">Administrator</p>
  //                   </div>
  //                 )}
  //               </div>
  //             )}

  //             {/* LOGOUT */}
  //             <button
  //               onClick={handleLogout}
  //               className={`
  //                 flex items-center w-full rounded-lg transition duration-200 text-red-600 hover:bg-red-50
  //                 ${isOpen ? "px-4 py-3 space-x-3" : "px-3 py-3 justify-center"}
  //               `}
  //               title={!isOpen ? "Logout" : ""}
  //             >
  //               <FiLogOut className="text-lg flex-shrink-0" />
  //               {isOpen && <span>Logout</span>}
  //             </button>
  //           </div>
  //         </nav>
  //       </aside>

  //       {/* MOBILE backdrop */}
  //       {isOpen && (
  //         <div
  //           className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
  //           onClick={onToggle}
  //         />
  //       )}
  //     </>
  //   );
  // }
// app/components/Sidebar.tsx
// app/components/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/config/supabase";
import type { User } from "@supabase/supabase-js";
 import profileImg from "../../../../public/pharmart.png";
// icons
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiTruck,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
} from "react-icons/fi";
import { MdInventory } from "react-icons/md";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { href: "/dashboard/items", label: "Item Management", icon: <FiPackage /> },
    { href: "/dashboard/orders", label: "Orders", icon: <FiShoppingCart /> },
    { href: "/dashboard/customers", label: "Customers", icon: <FiUsers /> },
    { href: "/dashboard/suppliers", label: "Suppliers", icon: <FiTruck /> },
    { href: "/dashboard/reports", label: "Reports", icon: <FiBarChart2 /> },
    { href: "/dashboard/settings", label: "Stock", icon: <MdInventory /> },
  ];

  // Check mobile screen and get user info
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.replace("/login");
  };

  const sidebarWidth = isMobile ? (isOpen ? "w-64" : "w-0") : (isOpen ? "w-64" : "w-20");

  return (
    <>
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarWidth}
          shadow-sm
        `}
      >
        {/* HEADER SECTION - Simplified */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          {/* Logo/Title Section */}
          {/* Logo/Title Section */}
<div className={`flex items-center ${isOpen ? "space-x-3" : "justify-center w-full"}`}>
  {isOpen ? (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        <Image
          src={profileImg} // or your image path
          alt="Logo"
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-500">Management System</p>
      </div>
    </div>
  ) : (
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
      <Image
        src={profileImg} // or your image path
        alt="Logo"
        width={40}
        height={40}
        className="object-cover w-full h-full"
      />
    </div>
  )}
</div>

          {/* Toggle Button - Cleaner */}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600"
            >
              {isOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
            </button>
          )}
        </div>

        {/* NAVIGATION MENU - Clean and Professional */}
        <nav className="mt-4 flex flex-col h-[calc(100vh-120px)]">
          <ul className="space-y-1 px-3 flex-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center transition-all duration-200 group
                      ${isOpen ? "px-3 py-3 space-x-3" : "px-3 py-3 justify-center"}
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                      rounded-lg
                    `}
                    title={!isOpen ? item.label : ""}
                  >
                    <span className={`
                      text-lg transition-colors duration-200
                      ${isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"}
                    `}>
                      {item.icon}
                    </span>
                    
                    {isOpen && (
                      <span className="text-sm font-medium tracking-wide">
                        {item.label}
                      </span>
                    )}

                    {/* Hover tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded 
                                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 
                                    whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* USER SECTION & LOGOUT - Clean */}
          <div className="border-t border-gray-200 p-4 bg-gray-50/50">
            {/* User Info */}
            {user && (
              <div
                className={`
                  flex items-center mb-3
                  ${isOpen ? "space-x-3" : "justify-center"}
                `}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                )}
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`
                flex items-center w-full transition-colors duration-200 
                text-gray-600 hover:text-red-600 hover:bg-red-50
                rounded-lg
                ${isOpen ? "px-3 py-3 space-x-3" : "px-3 py-3 justify-center"}
              `}
              title={!isOpen ? "Logout" : ""}
            >
              <FiLogOut className="text-lg" />
              
              {isOpen && (
                <span className="text-sm font-medium">Logout</span>
              )}

              {/* Hover tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded 
                              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 
                              whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </nav>
      </aside>

      {/* MOBILE BACKDROP */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button when sidebar is closed */}
      {!isOpen && isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm lg:hidden"
        >
          <FiMenu size={20} className="text-gray-600" />
        </button>
      )}
    </>
  );
}