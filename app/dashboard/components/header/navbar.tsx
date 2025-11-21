// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/app/config/supabase";
// import type { User } from "@supabase/supabase-js";

// interface HeaderProps {
//   onToggleSidebar: () => void;
//   isSidebarOpen: boolean;
// }
// export default function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     getUser();
//   }, []);
//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 z-10">
//       <div className="px-6 py-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             {/* Sidebar Toggle Button */}
//             <button
//               onClick={onToggleSidebar}
//               className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
//             >
//               {isSidebarOpen ? (
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
            
//             <div>
//               <h1 className="text-xl font-semibold text-gray-900">
                
//               </h1>
//             </div>
//           </div>
          

//           {/* User Info */}
//           <div className="flex items-center space-x-4">
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-medium text-gray-900">
//                 {user?.email}
//               </p>
//               <p className="text-xs text-gray-500">
//                 Administrator
//               </p>
//             </div>
//             <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
//               <span className="text-indigo-600 text-sm font-semibold">
//                 {user?.email?.charAt(0).toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/config/supabase";
import type { User } from "@supabase/supabase-js";

// Import Bell icon
import { Bell } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* LEFT SIDE */}
          <div className="flex items-center space-x-4">

            {/* Sidebar Toggle Button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              {isSidebarOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <div>
              <h1 className="text-xl font-semibold text-gray-900"></h1>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6">

            {/* 🔔 Notification Bell */}
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900" />

              {/* Example red notification dot */}
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Info */}
            {/* <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>

            {/* User Avatar */}
            {/* <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-sm font-semibold">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div> */} 

          </div>
        </div>
      </div>
    </header>
  );
}
