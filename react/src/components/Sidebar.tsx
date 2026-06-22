import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, LogOut } from "lucide-react";

const menuItems = [
  {
    name: "User Management",
    href: "/dashboard",
    icon: Users,
  },
];

export default function Sidebar() {
  const { token, logout } = useAuth();

  if (!token) return null;

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 text-zinc-100 flex flex-col h-screen shrink-0 shadow-lg">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/30">
          A
        </div>
        <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          AuthAdmin
        </span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`} />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
          Logout
        </button>
      </div>
    </aside>
  );
}
