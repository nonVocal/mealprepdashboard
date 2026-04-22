import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { mealsAPI } from '../api';
import { format, startOfWeek, addDays } from 'date-fns';
import './SchedulePage.css';

export default function SchedulePage() {
  const { meals, setError, setLoading } = useStore();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealType, setMealType] = useState('breakfast');
  const [selectedMeal, setSelectedMeal] = useState('');

  useEffect(() => {
    loadSchedule();
  }, [selectedDate]);

  const loadSchedule = async () => {
    try {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = addDays(weekStart, 6);
      const response = await mealsAPI.getSchedule(
        format(weekStart, 'yyyy-MM-dd'),
        format(weekEnd, 'yyyy-MM-dd')
      );
      setSchedule(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to load schedule');
    }
  };

  const handleAddToSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeal) return;

    try {
      setLoading(true);
      await mealsAPI.addToSchedule(
        selectedMeal,
        format(selectedDate, 'yyyy-MM-dd'),
        mealType,
        1
      );
      setSelectedMeal('');
      await loadSchedule();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to add to schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSchedule = async (id: string) => {
    try {
      setLoading(true);
      await mealsAPI.removeFromSchedule(id);
      await loadSchedule();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to remove from schedule');
    } finally {
      setLoading(false);
    }
  };

  const getDaySchedule = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule.filter((s) => s.scheduled_date === dateStr);
  };

  return (
    <div className="schedule-page">
      <div className="page-header">
        <h1>📅 Weekly Schedule</h1>
      </div>

      <div className="schedule-form">
        <form onSubmit={handleAddToSchedule}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Meal Type</label>
            <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">🌞 Lunch</option>
              <option value="dinner">🌙 Dinner</option>
              <option value="snack">🍿 Snack</option>
            </select>
          </div>

          <div className="form-group">
            <label>Meal</label>
            <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
              <option value="">Select a meal...</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>
                  {meal.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Add to Schedule
          </button>
        </form>
      </div>

      <div className="weekly-schedule">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(startOfWeek(selectedDate), i);
          const daySchedule = getDaySchedule(date);

          return (
            <div key={i} className="day-column">
              <h3>{format(date, 'EEE, MMM d')}</h3>
              <div className="meals-list">
                {daySchedule.length === 0 ? (
                  <p className="empty">No meals</p>
                ) : (
                  daySchedule.map((item) => (
                    <div key={item.id} className="scheduled-meal">
                      <span className="meal-type">{item.meal_type}</span>
                      <span className="meal-name">{item.name}</span>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveFromSchedule(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
