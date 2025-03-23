import { useRef, useEffect, MutableRefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTruck, FaBox } from "react-icons/fa";
import logo from "../assets/logo.png"; // Import the logo

const SideNavbar = () => {
  const dropdownRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 relative bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      {/* Header with Logo and Dashboard Text */}
      <div className="flex h-[80px] items-center border-b border-gray-300 dark:border-gray-700 px-6 bg-white dark:bg-gray-800">
        {/* Logo and Dashboard Text */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-5 w-auto" />
          <span className="text-lg text-gray-900 dark:text-white">
            Dashboard
          </span>
        </Link>
      </div>
      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2 bg-white dark:bg-gray-800">
        <nav className="grid gap-1 px-4 text-md font-medium">
          {/* Suppliers */}
          <NavLink
            to="/orders"
            icon={<FaTruck className="h-4 w-4" />}
            isActive={location.pathname === "/orders"}
          >
            Orders
          </NavLink>

          {/* Products */}
          <NavLink
            to="/products"
            icon={<FaBox className="h-4 w-4" />}
            isActive={location.pathname === "/products"}
          >
            Products
          </NavLink>
          <NavLink
            to="/props"
            icon={<FaBox className="h-4 w-4" />}
            isActive={location.pathname === "/props"}
          >
            Products Attributes
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

// Reusable NavLink Component
const NavLink = ({
  to,
  icon,
  children,
  isActive,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all 
    ${
      isActive
        ? "bg-primary text-white dark:bg-primary dark:text-white"
        : "text-gray-700 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white"
    }`}
  >
    {icon}
    {children}
  </Link>
);

export default SideNavbar;
