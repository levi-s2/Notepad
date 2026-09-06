import { useLocation } from "react-router";

function Header() {
  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/journal": "Journal",
    "/tasks": "Tasks",
    "/notes": "Notes",
  };

  const title = pageTitles[location.pathname] || "Notepad";

  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
}

export default Header;