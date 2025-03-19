// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SwordList from "./components/SwordList";
import SwordForm from "./components/SwordForm";
// Import SwordDetail when created

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Inventory</Link>
        <Link to="/add">Add Sword</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SwordList />} />
        <Route path="/add" element={<SwordForm />} />
        {/* <Route path="/sword/:id" element={<SwordDetail />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
