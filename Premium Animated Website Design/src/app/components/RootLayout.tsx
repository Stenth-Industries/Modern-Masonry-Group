import { Outlet } from "react-router";
import { CustomCursor } from "./CustomCursor";
import { Navigation } from "./Navigation";
import { ScrollProgress } from "./ScrollProgress";
import { Footer } from "./Footer";

export function RootLayout() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <main className="min-h-screen bg-[#FCFAF9]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
