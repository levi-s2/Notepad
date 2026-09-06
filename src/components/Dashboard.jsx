import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Dashboard() {
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tasksResponse, journalResponse, notesResponse] =
          await Promise.all([
            fetch("/api/tasks"),
            fetch("/api/journal"),
            fetch("/api/notes"),
          ]);

        if (
          !tasksResponse.ok ||
          !journalResponse.ok ||
          !notesResponse.ok
        ) {
          throw new Error("Failed to load dashboard data.");
        }

        const [tasksData, journalData, notesData] =
          await Promise.all([
            tasksResponse.json(),
            journalResponse.json(),
            notesResponse.json(),
          ]);

        setTasks(tasksData);
        setJournalEntries(journalData);
        setNotes(notesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [location.pathname]);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const recentJournalEntries = journalEntries.slice(0, 3);
  const recentNotes = notes.slice(0, 3);

  const isDashboardHome = location.pathname === "/";

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        {isDashboardHome ? (
          <section className="dashboard">
            <div className="dashboard-intro">
              <h2>Welcome back</h2>
              <p>Here's what's happening in your Notepad.</p>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="dashboard-grid">
                <section className="dashboard-card tasks-card">
                  <div className="dashboard-card-header">
                    <h3>Tasks</h3>
                    <Link to="/tasks">View all</Link>
                  </div>

                  <div className="task-summary">
                    <div>
                      <strong>{activeTasks.length}</strong>
                      <span>Active</span>
                    </div>

                    <div>
                      <strong>{completedTasks.length}</strong>
                      <span>Completed</span>
                    </div>
                  </div>

                  {activeTasks.length > 0 ? (
                    <div className="dashboard-task-list">
                      {activeTasks.slice(0, 3).map((task) => (
                        <p key={task.id}>{task.title}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="dashboard-empty">
                      No active tasks.
                    </p>
                  )}
                </section>

                <section className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Recent Journal</h3>
                    <Link to="/journal">View all</Link>
                  </div>

                  {recentJournalEntries.length > 0 ? (
                    <div className="dashboard-list">
                      {recentJournalEntries.map((entry) => (
                        <Link
                          key={entry.id}
                          to="/journal"
                          className="dashboard-list-item"
                        >
                          <strong>{entry.title}</strong>
                          <span>{entry.date}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="dashboard-empty">
                      No journal entries yet.
                    </p>
                  )}
                </section>

                <section className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Recent Notes</h3>
                    <Link to="/notes">View all</Link>
                  </div>

                  {recentNotes.length > 0 ? (
                    <div className="dashboard-list">
                      {recentNotes.map((note) => (
                        <Link
                          key={note.id}
                          to="/notes"
                          className="dashboard-list-item"
                        >
                          <strong>{note.title}</strong>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="dashboard-empty">
                      No notes yet.
                    </p>
                  )}
                </section>
              </div>
            )}
          </section>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

export default Dashboard;