import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
    dailyWaterGoal: user?.dailyWaterGoal || 2500,
    dailySleepGoal: user?.dailySleepGoal || 8,
    dailyExerciseGoal: user?.dailyExerciseGoal || 30,
  });
  const [loading, setLoading] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser({ ...user, ...data.user });
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Update your personal info and daily goals</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: 32 }}>
          <div className="chart-title mb-6">Personal Information</div>
          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-input" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="number" className="form-input" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="number" className="form-input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full mt-4" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div className="chart-title mb-6">Daily Target Goals</div>
          <form onSubmit={saveProfile}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Calories (kcal)</label>
                <input type="number" className="form-input" value={form.dailyCalorieGoal} onChange={e => setForm({...form, dailyCalorieGoal: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Water (ml)</label>
                <input type="number" className="form-input" value={form.dailyWaterGoal} onChange={e => setForm({...form, dailyWaterGoal: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sleep (hours)</label>
                <input type="number" className="form-input" value={form.dailySleepGoal} onChange={e => setForm({...form, dailySleepGoal: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Exercise (min)</label>
                <input type="number" className="form-input" value={form.dailyExerciseGoal} onChange={e => setForm({...form, dailyExerciseGoal: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary btn-full mt-4" disabled={loading}>
              Update Goals
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
