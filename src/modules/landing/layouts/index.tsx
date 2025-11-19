import Navbar from "../components/navbar";
import Hero from "../components/hero";

export default function LandingLayout() {
    return (
        <>
            <Navbar />
            <div className="flex flex-row items-center justify-center w-full">
                <Hero />
            </div>
        </>
    )
}
