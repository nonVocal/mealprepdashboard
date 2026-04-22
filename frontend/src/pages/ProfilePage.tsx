import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { authAPI } from '../api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, setUser, setError, setLoading } = useStore();
  const [telegramId, setTelegramId] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user?.telegram_id) {
      setTelegramId(user.telegram_id);
    }
    if (user?.telegram_username) {
      setTelegramUsername(user.telegram_username);
    }
  }, [user]);

  const handleLinkTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId || !telegramUsername) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await authAPI.linkTelegram(telegramId, telegramUsername);
      setUser({ ...user!, telegram_id: telegramId, telegram_username: telegramUsername });
      setEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to link Telegram account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>👤 Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-info">
          <h3>Email</h3>
          <p>{user?.email}</p>
        </div>

        <div className="profile-section">
          <h3>🤖 Telegram Connection</h3>
          {user?.telegram_id ? (
            <div className="telegram-linked">
              <p className="success-message">✅ Connected to Telegram</p>
              <div className="telegram-info">
                <p><strong>ID:</strong> {user.telegram_id}</p>
                <p><strong>Username:</strong> @{user.telegram_username}</p>
              </div>
              <button
                className="btn-secondary"
                onClick={() => setEditing(true)}
              >
                Update Telegram
              </button>
            </div>
          ) : (
            <p className="info-message">
              Link your Telegram account to control the bot and receive notifications
            </p>
          )}

          {editing && (
            <form onSubmit={handleLinkTelegram} className="telegram-form">
              <div className="form-group">
                <label>Telegram ID</label>
                <input
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Your Telegram numeric ID"
                  disabled={false}
                />
              </div>

              <div className="form-group">
                <label>Telegram Username</label>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="Your Telegram username (without @)"
                  disabled={false}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="help-section">
          <h3>❓ How to find your Telegram ID</h3>
          <ol>
            <li>Open Telegram and search for @userinfobot</li>
            <li>Send the bot a message</li>
            <li>Copy your numeric ID from the response</li>
            <li>Enter it above along with your username</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
