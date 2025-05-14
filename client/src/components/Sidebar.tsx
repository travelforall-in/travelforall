import {
  Package,
  Users,
  ChartBar,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const Sidebar = ({
  isCollapsed,
  onLogout,
  onPackageClick,
  onManageUsersClick,
  onDashboardClick,
}: {
  isCollapsed: boolean;
  onLogout: () => void;
  onPackageClick: () => void;
  onManageUsersClick: () => void;
  onDashboardClick: () => void;
}) => (
  <aside
    className={`bg-zinc-200 ${
      isCollapsed ? "w-20" : "w-64"
    } transition-all duration-300 min-h-screen p-4 relative`}
  >
    <h1
      className={`text-xl text-green-800 font-bold mb-8 ${
        isCollapsed ? "hidden" : "block"
      }`}
    >
      Admin Panel
    </h1>
    <nav className="flex flex-col gap-6">
      <button
        className="text-black flex items-center gap-2 hover:text-green-800"
        onClick={onDashboardClick}
      >
        <LayoutDashboard size={20} /> {!isCollapsed && "Dashboard"}
      </button>
      <button
        className="text-black flex items-center gap-2 hover:text-green-800"
        onClick={onManageUsersClick}
      >
        <Users size={20} /> {!isCollapsed && "Users"}
      </button>
      <button className="text-black flex items-center gap-2 hover:text-green-800">
        <ChartBar size={20} /> {!isCollapsed && "Bookings"}
      </button>
      <button
        className="text-black flex items-center gap-2 hover:text-green-800"
        onClick={onPackageClick}
      >
        <Package size={20} />
        {!isCollapsed && "Packages"}
      </button>
    </nav>
    <div className="absolute bottom-5">
      <button
        className="flex items-center gap-2 text-white bg-red-600 px-3 py-2 rounded-lg"
        onClick={onLogout}
      >
        <LogOut size={20} /> {!isCollapsed && "Logout"}
      </button>
    </div>
  </aside>
);

export default Sidebar;
