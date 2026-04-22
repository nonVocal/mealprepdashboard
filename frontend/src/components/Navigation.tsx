import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import './Navigation.css';

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-logo">
        <h1>🍽️ Meal Prep</h1>
      </div>

      <ul className="nav-links">
        <li>
          <button onClick={() => navigate('/dashboard/meals')}>
            🍽️ Meals
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/dashboard/schedule')}>
            📅 Schedule
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/dashboard/ai')}>
            🧠 AI Planner
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/dashboard/bot')}>
            🤖 Bot
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/dashboard/profile')}>
            👤 Profile
          </button>
        </li>
      </ul>

      <div className="nav-user">
        <span className="user-email">{user?.email}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
