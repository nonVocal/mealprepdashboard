import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from '../store';
import { mealsAPI, botAPI } from '../api';
import MealsPage from './MealsPage';
import SchedulePage from './SchedulePage';
import BotPage from './BotPage';
import ProfilePage from './ProfilePage';
import AIPlannerPage from './AIPlannerPage';
import Navigation from '../components/Navigation';
import './Dashboard.css';

export default function Dashboard() {
  const { meals, setMeals, setError, setLoading } = useStore();

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const response = await mealsAPI.getMeals();
      setMeals(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<MealsPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/ai" element={<AIPlannerPage />} />
          <Route path="/bot" element={<BotPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}
