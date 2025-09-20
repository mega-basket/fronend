import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import Home from "./components/home/Home";
import Layout from "./components/layout/Layout";
import SignUp from "./pages/login/SignUp";
import Login from "./pages/login/Login";
import { Toaster } from "react-hot-toast";
import Fashion from "./pages/categories/fashion/Fashion";
import FashionDetails from "./pages/categories/fashion/components/FashionDetails";

function App() {
  // JS: prevent scroll increment
  document.addEventListener(
    "wheel",
    function (e) {
      if (e.target.type === "number") {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Layout wrapper */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/fashion" element={<Fashion />} />
            <Route path="/fashion/:id" element={<FashionDetails />} />
          </Route>

          {/* Pages without Layout */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
