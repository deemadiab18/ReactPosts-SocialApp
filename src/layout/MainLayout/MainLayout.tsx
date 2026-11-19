import { Outlet } from "react-router-dom";
import NavBar from "../../components/layout/NavBar/NavBar";
import SideBar from "../../components/layout/SideBar/SideBar";
import MobileBottomNav from "../../components/layout/MobileBottomNav";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <NavBar />
      <div className="home-shell mx-auto flex w-full max-w-[1400px] pt-16">
        <SideBar />
        <main className="home-main min-h-[calc(100vh-4rem)] min-w-0 flex-1 px-4 py-6 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}