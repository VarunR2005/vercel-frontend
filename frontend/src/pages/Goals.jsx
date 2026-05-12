import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'weight', targetValue: '', unit: 'kg', deadline: '' });

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data.goals);
    } catch { toast.error('Failed to load goals'); }
    finally { setLoading(false); }
  };

  const submitGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', form);
      toast.success('Goal created!');
      setShowModal(false);
      setForm({ title: '', type: 'weight', targetValue: '', unit: 'kg', deadline: '' });
      fetchGoals();
    } catch { toast.error('Failed to create goal'); }
  };

  const deleteGoal = async (id) => {
    if(!window.confirm('Delete this goal?')) return;
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
      toast.success('Goal deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading goals...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Goals</h1>
          <p className="page-subtitle">Track your long-term health targets</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">➕ New Goal</button>
      </div>

      <div className="grid-3">
        {goals.map(g => (
          <div key={g._id} className="card goal-card">
            <div className="goal-header">
              <div>
                <div className="goal-title">{g.title}</div>
                <div className="goal-type" style={{textTransform:'capitalize'}}>{g.type}</div>
              </div>
              <button onClick={() => deleteGoal(g._id)} style={{background:'none',border:'none',color:'var(--accent-red)',cursor:'pointer'}}>✖</button>
            </div>
            <div className="goal-progress">
              <div className="goal-progress-bar">
                <div className="goal-progress-fill" style={{width: `${g.progressPercent}%`}}></div>
              </div>
              <div className="goal-progress-text">
                <span>{g.currentValue} {g.unit}</span>
                <span>{g.targetValue} {g.unit} ({g.progressPercent}%)</span>
              </div>
            </div>
            {g.deadline && <div className="goal-deadline">📅 Deadline: {new Date(g.deadline).toLocaleDateString()}</div>}
            {g.achieved && <div style={{marginTop:8, color:'var(--accent-green)', fontSize:'0.8rem', fontWeight:'bold'}}>🎉 Goal Achieved!</div>}
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="card empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No goals set</h3>
          <p>Click "New Goal" to get started.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Create Goal</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✖</button>
            </div>
            <form onSubmit={submitGoal}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input required className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="weight">Weight</option>
                    <option value="calories">Calories</option>
                    <option value="water">Water</option>
                    <option value="exercise">Exercise</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Value</label>
                  <input required type="number" className="form-input" value={form.targetValue} onChange={e => setForm({...form, targetValue: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input required className="form-input" placeholder="kg, kcal, etc." value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input type="date" className="form-input" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full mt-4">Save Goal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
