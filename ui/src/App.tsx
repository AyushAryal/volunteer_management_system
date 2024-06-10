import { Routes, Route } from "react-router-dom";
import { VmsMap } from "./components/map/VmsMap.tsx";
import Landing from "./pages/Landing.tsx";
import { Signup } from "./pages/Signup.tsx";
import { RegistrationSuccess } from "./pages/RegistrationSuccess.tsx";

export default function App() {
    //<Route path="/reset-password" element={} />
    return (
        <Routes>
            <Route path="/dashboard" element={<VmsMap />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Landing />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/verify-email" element={<h1> Email verification failed</h1>} />
        </Routes>
    );

}
