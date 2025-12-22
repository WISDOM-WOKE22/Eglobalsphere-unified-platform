import LandingLayout from "@/modules/landing/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to eGlobalSphere Unified Platform. Streamline your global operations today.",
};

export default function Home() {
  return (
    <LandingLayout />
  );
}
