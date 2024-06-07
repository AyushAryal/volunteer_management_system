import { Routes, Route } from "react-router-dom";
import { VmsMap } from "./components/map/VmsMap.tsx";
import Landing from "./pages/Landing.tsx";
import { Signup } from "./pages/Signup.tsx";

export default function App() {
    //<Route path="/reset-password" element={} />
    return (
        <Routes>
            <Route path="/dashboard" element={<VmsMap />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Landing />} />
            <Route path="/registration-success" element={<h1> Your email has been verified</h1>} />
            <Route path="/verify-email" element={<h1> Email verification failed</h1>} />
        </Routes>
    );

}
