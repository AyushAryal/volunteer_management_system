import { Routes, Route } from "react-router-dom";
import { Map } from "./components/map/Map.tsx";
import Landing from "./pages/Landing.tsx";
import { Signup } from "./pages/Signup.tsx";
import { Login } from "./components/Login.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Map />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}
