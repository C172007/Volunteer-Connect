import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SubmitNeed from "./pages/SubmitNeed";
import RegisterVolunteer from "./pages/RegisterVolunteer";
import VolunteerMatch from "./pages/VolunteerMatch";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit" element={<SubmitNeed />} />
        <Route path="/register" element={<RegisterVolunteer />} />
        <Route path="/match" element={<VolunteerMatch />} />
      </Routes>
    </BrowserRouter>
  );
}