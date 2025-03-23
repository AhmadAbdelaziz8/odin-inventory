import React from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Sword Inventory
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-gray-300">
              Swords
            </Link>
            <Link to="/categories" className="hover:text-gray-300">
              Categories
            </Link>
            <Link to="/materials" className="hover:text-gray-300">
              Materials
            </Link>
            <Link to="/origins" className="hover:text-gray-300">
              Origins
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
