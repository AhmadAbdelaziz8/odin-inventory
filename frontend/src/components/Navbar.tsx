import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 dark:bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              Swords
            </Link>
            <Link
              to="/materials"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              Materials
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
