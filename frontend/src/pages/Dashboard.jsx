import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { CalorieChart, WaterChart, SleepChart, MoodDonut } from '../components/Charts';
import BMIGauge from '../components/BMIGauge';

const StatCard = ({ icon, value, unit, label, goal, color, gradFrom, gradTo }) => {
  const pct = goal ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${gradFrom}` }}>
      <div className="stat-icon" style={{ background: `linear-gradient(135deg,${gradFrom}22,${gradTo}22)` }}>
        {icon}
      </div>
      <div className="stat-value">
        {value}<span className="stat-unit">{unit}</span>
      </div>
      <div className="stat-label">{label}</div>
      {goal && (
        <>
          <div className="stat-sub">Goal: {goal} {unit}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg,${gradFrom},${gradTo})`,
            }} />
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    calories: '', water: '', sleep: '', exercise: '', mood: 'good', notes: '',
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  const fetchData = async () => {
    try {
      const [todayRes, weeklyRes] = await Promise.all([
        api.get('/activities/today'),
        api.get('/activities/weekly'),
      ]);
      setToday(todayRes.data.summary);          // backend returns { summary: {...} }
      setWeekly(weeklyRes.data.weeklyData || []); // backend returns { weeklyData: [...] }
    } catch {
      // no data yet
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitLog = async (e) => {
    e.preventDefault();
    if (!form.calories && !form.water && !form.sleep && !form.exercise)
      return toast.error('Fill at least one field');
    setSubmitting(true);
    try {
      await api.post('/activities', {
        calories: Number(form.calories) || 0,
        water: Number(form.water) || 0,
        sleep: Number(form.sleep) || 0,
        exercise: Number(form.exercise) || 0,
        mood: form.mood,
        notes: form.notes,
        date: new Date(),
      });
      toast.success('Activity logged! 🎉');
      setForm({ calories: '', water: '', sleep: '', exercise: '', mood: 'good', notes: '' });
      fetchData();
    } catch { toast.error('Failed to log activity'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-container"><div className="spinner" /></div>;

  const t = today || {};
  const stats = [
    { icon: '🔥', value: t.calories || 0, unit: 'kcal', label: 'Calories Consumed', goal: user?.dailyCalorieGoal, gradFrom: '#ec4899', gradTo: '#f43f5e' },
    { icon: '💧', value: t.water || 0, unit: 'ml', label: 'Water Intake', goal: user?.dailyWaterGoal, gradFrom: '#06b6d4', gradTo: '#3b82f6' },
    { icon: '😴', value: t.sleep || 0, unit: 'hrs', label: 'Sleep Duration', goal: user?.dailySleepGoal, gradFrom: '#a855f7', gradTo: '#7c3aed' },
    { icon: '🏃', value: t.exercise || 0, unit: 'min', label: 'Exercise Time', goal: user?.dailyExerciseGoal, gradFrom: '#f97316', gradTo: '#f59e0b' },
  ];

  return (
    <div className="page-container">
      {/* Greeting Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #ede9fe 100%)',
        border: '1.5px solid #fce7f3',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 24px rgba(236,72,153,0.1)',
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e1b4b', marginBottom: 4 }}>
            {greeting}, {user?.name?.split(' ')[0]}! {greetEmoji}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Here's your health summary for today</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {user?.bmi && (
            <div style={{ background: 'white', border: '1.5px solid #fce7f3', borderRadius: 14, padding: '12px 20px', boxShadow: '0 2px 10px rgba(236,72,153,0.08)' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your BMI</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ec4899' }}>{user.bmi}</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts + Quick Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts Column (Takes up 2/3 of space on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <div className="card min-w-0">
            <div className="chart-container">
              <div className="chart-header">
                <div>
                  <div className="chart-title">🔥 Weekly Calories</div>
                  <div className="chart-subtitle">7-day calorie intake trend</div>
                </div>
              </div>
              {weekly.length > 0 ? <CalorieChart data={weekly} /> : (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <div className="empty-icon">📊</div>
                  <p>Log activities to see your calorie chart</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
            <div className="card min-w-0">
              <div className="chart-container">
                <div className="chart-header">
                  <div className="chart-title">💧 Water Intake</div>
                </div>
                {weekly.length > 0 ? <WaterChart data={weekly} /> : <div className="empty-state" style={{ padding: 30 }}><div className="empty-icon" style={{ fontSize: 32 }}>💧</div><p style={{ fontSize: '0.78rem' }}>No data yet</p></div>}
              </div>
            </div>
            <div className="card min-w-0">
              <div className="chart-container">
                <div className="chart-header">
                  <div className="chart-title">😴 Sleep</div>
                </div>
                {weekly.length > 0 ? <SleepChart data={weekly} /> : <div className="empty-state" style={{ padding: 30 }}><div className="empty-icon" style={{ fontSize: 32 }}>😴</div><p style={{ fontSize: '0.78rem' }}>No data yet</p></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Quick Log & Donut - Takes up 1/3) */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Quick Log */}
          <div className="card">
            <div className="p-6 pb-4 border-b-2 border-pink-100 mb-4">
              <h3 className="text-base font-extrabold text-indigo-950 mb-1">⚡ Quick Log</h3>
              <p className="text-sm text-gray-400">Log today's health metrics</p>
            </div>
            <form onSubmit={submitLog} className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group m-0">
                  <label className="form-label">🔥 Calories</label>
                  <input name="calories" type="number" className="form-input" placeholder="e.g. 1800" value={form.calories} onChange={handle} min={0} />
                </div>
                <div className="form-group m-0">
                  <label className="form-label">💧 Water (ml)</label>
                  <input name="water" type="number" className="form-input" placeholder="e.g. 2000" value={form.water} onChange={handle} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group m-0">
                  <label className="form-label">😴 Sleep (hrs)</label>
                  <input name="sleep" type="number" className="form-input" placeholder="e.g. 7" value={form.sleep} onChange={handle} step={0.5} min={0} />
                </div>
                <div className="form-group m-0">
                  <label className="form-label">🏃 Exercise (min)</label>
                  <input name="exercise" type="number" className="form-input" placeholder="e.g. 45" value={form.exercise} onChange={handle} min={0} />
                </div>
              </div>
              <div className="form-group mb-5">
                <label className="form-label">😊 Mood</label>
                <select name="mood" className="form-select" value={form.mood} onChange={handle}>
                  <option value="excellent">😄 Excellent</option>
                  <option value="good">🙂 Good</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="bad">😕 Bad</option>
                  <option value="terrible">😣 Terrible</option>
                </select>
              </div>
              <button type="submit" id="log-activity-btn" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
                {submitting ? '⏳ Logging...' : '✅ Log Activity'}
              </button>
            </form>
          </div>

          {/* Mood Donut */}
          {weekly.length > 0 && (
            <div className="card min-w-0">
              <div className="chart-container">
                <div className="chart-header">
                  <div className="chart-title">😊 Mood Distribution</div>
                  <div className="chart-subtitle">This week</div>
                </div>
                <MoodDonut activities={weekly} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
