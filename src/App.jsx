/* ============================================================
   🗺 APP.JSX — Route configuration
   📍 WHAT TO CHANGE WHERE:
   - Add new pages → add a new <Route> here
   - Change landing page → change element on path="/"
   - Hide Navbar on landing → see conditional below
   ============================================================ */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar            from "./components/Navbar";
import Landing           from "./pages/Landing";
import Dashboard         from "./pages/Dashboard";
import SubmitNeed        from "./pages/SubmitNeed";
import RegisterVolunteer from "./pages/RegisterVolunteer";
import VolunteerMatch    from "./pages/VolunteerMatch";

/* ============================================================
   🎨 NAVBAR VISIBILITY — Navbar is hidden on the landing page
   because Landing has its own built-in nav.
   To show Navbar on all pages: remove the condition and always render <Navbar />
   ============================================================ */
function AppLayout() {
  const { pathname } = useLocation();
  const showNavbar   = pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* ============================================================
            🗺 ROUTES — Add new pages here
            format: <Route path="/your-path" element={<YourComponent />} />
            ============================================================ */}
        <Route path="/"          element={<Landing />}           />
        <Route path="/dashboard" element={<Dashboard />}         />
        <Route path="/submit"    element={<SubmitNeed />}        />
        <Route path="/register"  element={<RegisterVolunteer />} />
        <Route path="/match"     element={<VolunteerMatch />}    />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}