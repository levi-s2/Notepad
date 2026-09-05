function NavBar({ onNavigate }) {
  return (
    <nav>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
        <li>
          <button type="button" onClick={() => onNavigate && onNavigate('home')}>Home</button>
        </li>
        <li>
          <button type="button" onClick={() => onNavigate && onNavigate('diary')}>Diary</button>
        </li>
        <li>
          <button type="button" onClick={() => onNavigate && onNavigate('notes')}>Notes</button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;