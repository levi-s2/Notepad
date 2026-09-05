import { NavLink } from "react-router";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Notepad</h1>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/notes">Notes</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;