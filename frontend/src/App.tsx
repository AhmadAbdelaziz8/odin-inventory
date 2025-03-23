// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import Navbar from "./components/Navbar.tsx";
import SwordList from "./components/SwordList";
import SwordForm from "./components/SwordForm";
import MaterialList from "./components/MaterialList.tsx";
import MaterialForm from "./components/MaterialForm.tsx";
// Import SwordDetail when created

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <ThemeToggle />
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<SwordList />} />
              <Route path="/swords/new" element={<SwordForm />} />
              <Route path="/swords/:id/edit" element={<SwordForm />} />
              <Route path="/materials" element={<MaterialList />} />
              <Route path="/materials/new" element={<MaterialForm />} />
              <Route path="/materials/:id/edit" element={<MaterialForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
