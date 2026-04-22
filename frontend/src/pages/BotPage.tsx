import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { botAPI } from '../api';
import './BotPage.css';

export default function BotPage() {
  const { setError, setLoading } = useStore();
  const [botStatus, setBotStatus] = useState<any>(null);
  const [commandHistory, setCommandHistory] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBotStatus();
    loadCommandHistory();
  }, []);

  const loadBotStatus = async () => {
    try {
      const response = await botAPI.getStatus();
      setBotStatus(response.data);
    } catch (error: any) {
      setError('Failed to load bot status');
    }
  };

  const loadCommandHistory = async () => {
    try {
      const response = await botAPI.getCommandHistory(20);
      setCommandHistory(response.data);
    } catch (error: any) {
      setError('Failed to load command history');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      await botAPI.sendMessage(message);
      setMessage('');
      await loadCommandHistory();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bot-page">
      <div className="page-header">
        <h1>🤖 Telegram Bot Control</h1>
      </div>

      {botStatus && (
        <div className={`bot-status ${botStatus.botConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-info">
            <span className="status-indicator"></span>
            <div>
              <h3>{botStatus.botConnected ? 'Connected' : 'Not Connected'}</h3>
              {botStatus.botConnected && (
                <p>@{botStatus.telegramUsername || botStatus.telegramId}</p>
              )}
              {!botStatus.botConnected && (
                <p>Link your Telegram account in your profile to start using the bot</p>
              )}
            </div>
          </div>
          <p className="status-badge">{botStatus.status.toUpperCase()}</p>
        </div>
      )}

      {botStatus?.botConnected && (
        <div className="message-form">
          <h3>Send Message</h3>
          <form onSubmit={handleSendMessage}>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message to send to your Telegram bot..."
                rows={3}
              />
            </div>
            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </div>
      )}

      <div className="command-history">
        <h3>📋 Command History</h3>
        {commandHistory.length === 0 ? (
          <p className="empty-state">No commands yet</p>
        ) : (
          <div className="history-list">
            {commandHistory.map((cmd, idx) => (
              <div key={idx} className="history-item">
                <code>{cmd.command}</code>
                <time>{new Date(cmd.executed_at).toLocaleString()}</time>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bot-commands">
        <h3>📖 Available Bot Commands</h3>
        <div className="commands-list">
          <div className="command-item">
            <code>/meals</code>
            <p>View your meal recipes</p>
          </div>
          <div className="command-item">
            <code>/today</code>
            <p>View today's meal schedule</p>
          </div>
          <div className="command-item">
            <code>/schedule</code>
            <p>View this week's meal schedule</p>
          </div>
          <div className="command-item">
            <code>/stats</code>
            <p>View today's nutrition stats</p>
          </div>
          <div className="command-item">
            <code>/help</code>
            <p>Show available commands</p>
          </div>
        </div>
      </div>
    </div>
  );
}
