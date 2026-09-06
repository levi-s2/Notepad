import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;