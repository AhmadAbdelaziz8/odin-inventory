// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SwordList from "./components/SwordList";
import SwordForm from "./components/SwordForm";
// Import SwordDetail when created

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SwordList />} />
          <Route path="/swords/new" element={<SwordForm />} />
          <Route path="/swords/:id/edit" element={<SwordForm />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
