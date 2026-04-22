import React, { useState, useEffect } from 'react';
import './MealForm.css';

interface MealFormProps {
  meal?: any;
  onSave: (meal: any) => Promise<void>;
  onCancel: () => void;
}

export default function MealForm({ meal, onSave, onCancel }: MealFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0,
    prepDay: '',
    servings: 1,
    imageUrl: '',
  });

  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.name,
        description: meal.description || '',
        protein: meal.protein_grams,
        carbs: meal.carbs_grams,
        fat: meal.fat_grams,
        calories: meal.calories,
        prepDay: meal.prep_day || '',
        servings: meal.servings,
        imageUrl: meal.image_url || '',
      });
    }
  }, [meal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['protein', 'carbs', 'fat', 'calories', 'servings'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please fill in the meal name');
      return;
    }
    await onSave(formData);
  };

  return (
    <div className="meal-form-container">
      <form onSubmit={handleSubmit} className="meal-form">
        <div className="form-group">
          <label>Meal Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Grilled Chicken with Rice"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your meal..."
            rows={3}
          />
        </div>

        <div className="nutrition-grid">
          <div className="form-group">
            <label>Protein (g)</label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Carbs (g)</label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Fat (g)</label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Calories</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              min="0"
              step="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Prep Day</label>
          <select name="prepDay" value={formData.prepDay} onChange={handleChange}>
            <option value="">Select a day...</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <div className="form-group">
          <label>Servings</label>
          <input
            type="number"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            min="1"
            step="1"
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {meal ? 'Update Meal' : 'Create Meal'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
