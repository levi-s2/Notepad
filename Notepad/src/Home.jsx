import { useState } from "react";
import Entries from "./Entries";
import NavBar from "./NavBar";
import Diary from "./Diary";
import Notes from "./Notes";

function Home() {
  const [view, setView] = useState('home');

  const handleNavigate = (target) => setView(target || 'home');

  let content = <Entries />;
  if (view === 'diary') content = <Diary />;
  else if (view === 'notes') content = <Notes />;

  return (
    <div>
      <h1>NotePad</h1>
      <NavBar onNavigate={handleNavigate} />
      {content}
    </div>
  );
}

export default Home;