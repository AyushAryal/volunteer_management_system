import { volunteering } from "@assets/index";
import { Footer, Navbar } from "@components/landing";


export function RegistrationSuccess() {
    return <div>
        <Navbar />
        <div
            style={{
                backgroundImage: `url(${volunteering})`,
            }}
            className="flex flex-column h-screen justify-content-center align-items-center bg-cover">
            <div className="flex flex-column w-5 p-5 border-round-3xl text-100 align-items-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <h1 className="text-teal-500">Registration was successful!</h1>
                <div> Welcome to NDRRMA Volunteer Management System.</div>
                <a href="/"
                    className="font-semibold text-orange-300 no-underline">
                    Go back to main page
                </a>
            </div>
        </div>
        <Footer />
    </div>
}