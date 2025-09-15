import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';
import Serbar from './components/bar';
import Menubar from './components/menubar';
import Profile from './components/profile';
import AdminPage from './components/admin';

function App() {
  return(
   <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Serbar />
              <Menubar />
            </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
