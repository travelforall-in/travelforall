import {
  Package,
  Users,
  ChartBar,
  LogOut,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({
  isCollapsed,
  onLogout,
  onPackageClick,
  onManageUsersClick,
  onDashboardClick,
  onDestinationClick,
  onBookingsClick,
}: {
  isCollapsed: boolean;
  onLogout: () => void;
  onPackageClick: () => void;
  onManageUsersClick: () => void;
  onDashboardClick: () => void;
  onDestinationClick: () => void;
  onBookingsClick: () => void;
}) => (
  <aside
    className={`bg-zinc-200 fixed top-0 left-0 h-screen z-30 ${
      isCollapsed ? "w-20" : "w-64"
    } transition-all duration-300 p-4`}
  >
    <h1
      className={`text-2xl text-[#097C70] font-bold mt-5 mb-8 ${
        isCollapsed ? "hidden" : "block"
      }`}
    >
      Admin Panel
    </h1>
    <nav className="flex flex-col gap-6">
      <motion.button
        whileHover={{ scale: 1.05, x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-black flex items-center gap-2 hover:text-[#f1f2f3] hover:bg-[#087d71] px-3 py-2 rounded-md"
        onClick={onDashboardClick}
      >
        <LayoutDashboard size={20} /> {!isCollapsed && "Dashboard"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-black flex items-center gap-2 hover:text-[#f1f2f3] hover:bg-[#087d71] px-3 py-2 rounded-md"
        onClick={onManageUsersClick}
      >
        <Users size={20} /> {!isCollapsed && "Users"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-black flex items-center gap-2 hover:text-[#f1f2f3] hover:bg-[#087d71] px-3 py-2 rounded-md"
        onClick={onBookingsClick}
      >
        <ChartBar size={20} /> {!isCollapsed && "Bookings"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-black flex items-center gap-2 hover:text-[#f1f2f3] hover:bg-[#087d71] px-3 py-2 rounded-md"
        onClick={onDestinationClick}
      >
        <MapPin size={20} /> {!isCollapsed && "Destination"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-black flex items-center gap-2 hover:text-[#f1f2f3] hover:bg-[#087d71] px-3 py-2 rounded-md"
        onClick={onPackageClick}
      >
        <Package size={20} /> {!isCollapsed && "Packages"}
      </motion.button>
    </nav>

    <div className="absolute bottom-5">
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center gap-2 text-white bg-red-600 px-3 py-2 rounded-lg"
        onClick={onLogout}
      >
        <LogOut size={20} /> {!isCollapsed && "Logout"}
      </motion.button>
    </div>
  </aside>
);

export default Sidebar;
