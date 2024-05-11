import { Routes, Route } from "react-router-dom";
import { VmsMap } from "./components/map/VmsMap.tsx";
import Landing from "./pages/Landing.tsx";
import { Signup } from "./pages/Signup.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/dashboard" element={<VmsMap />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Landing />} />
        </Routes>
    );

}
