import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-6 bg-blue-600 text-white text-center text-2xl font-bold">
        Bitsorter Admin
      </header>
      <main>
        {/* Outlet renders nested admin routes */}
        <Outlet />
      </main>
    </div>
  );
}
