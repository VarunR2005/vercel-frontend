import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities?limit=50');
      setActivities(res.data.activities);
    } catch {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await api.delete(`/activities/${id}`);
      setActivities(activities.filter(a => a._id !== id));
      toast.success('Activity deleted');
    } catch {
      toast.error('Failed to delete activity');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading logs...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity Log</h1>
          <p className="page-subtitle">Your recent health entries</p>
        </div>
      </div>

      <div className="card table-wrapper">
        {activities.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Calories (kcal)</th>
                <th>Water (ml)</th>
                <th>Sleep (h)</th>
                <th>Exercise (m)</th>
                <th>Mood</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act._id}>
                  <td>{new Date(act.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                  <td><span style={{ textTransform: 'capitalize' }}>{act.exerciseType}</span></td>
                  <td>{act.calories || '-'}</td>
                  <td>{act.water || '-'}</td>
                  <td>{act.sleep || '-'}</td>
                  <td>{act.exercise || '-'}</td>
                  <td>
                    {act.mood === 'excellent' && '😄'}
                    {act.mood === 'good' && '🙂'}
                    {act.mood === 'neutral' && '😐'}
                    {act.mood === 'bad' && '😕'}
                    {act.mood === 'terrible' && '😢'}
                  </td>
                  <td>
                    <button onClick={() => deleteActivity(act._id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No entries found</h3>
            <p>Go to the Dashboard to log your first activity.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
