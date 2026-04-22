import React, { useState } from 'react';
import { useStore } from '../store';
import { mealsAPI } from '../api';
import MealForm from '../components/MealForm';
import './MealsPage.css';

export default function MealsPage() {
  const { meals, addMeal, updateMeal, removeMeal, setError, setLoading } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  const handleSave = async (mealData: any) => {
    try {
      setLoading(true);
      if (selectedMeal) {
        const response = await mealsAPI.updateMeal(selectedMeal.id, mealData);
        updateMeal(selectedMeal.id, response.data);
      } else {
        const response = await mealsAPI.createMeal(mealData);
        addMeal(response.data);
      }
      setShowForm(false);
      setSelectedMeal(null);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save meal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this meal?')) return;

    try {
      setLoading(true);
      await mealsAPI.deleteMeal(id);
      removeMeal(id);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meals-page">
      <div className="page-header">
        <h1>🍽️ My Meals</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setSelectedMeal(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Meal'}
        </button>
      </div>

      {showForm && (
        <MealForm
          meal={selectedMeal}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedMeal(null);
          }}
        />
      )}

      <div className="meals-grid">
        {meals.length === 0 ? (
          <p className="empty-state">No meals yet. Create your first meal to get started!</p>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="meal-card">
              {meal.image_url && (
                <img src={meal.image_url} alt={meal.name} className="meal-image" />
              )}
              <div className="meal-content">
                <h3>{meal.name}</h3>
                {meal.description && <p className="meal-description">{meal.description}</p>}
                
                <div className="meal-nutrition">
                  <span>🔥 {Math.round(meal.calories)} cal</span>
                  <span>🥚 {Math.round(meal.protein_grams)}g</span>
                  <span>🌾 {Math.round(meal.carbs_grams)}g</span>
                  <span>🥑 {Math.round(meal.fat_grams)}g</span>
                </div>

                {meal.prep_day && <p className="prep-day">📅 Prep: {meal.prep_day}</p>}

                <div className="meal-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedMeal(meal);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(meal.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
