import { Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="journal" element={<Journal />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="notes" element={<Notes />} />
      </Route>
    </Routes>
  );
}

export default App;