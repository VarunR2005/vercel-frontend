/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import api from '../services/api';
import { CalorieChart, SleepChart, WaterChart, ExerciseChart } from '../components/Charts';
import { toast } from 'react-hot-toast';

const Reports = () => {
  const [period, setPeriod] = useState('weekly');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define fetchReport BEFORE using it in useEffect
  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${period}`);
      setReportData(res.data);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  // Now useEffect can safely call fetchReport
  useEffect(() => {
    fetchReport();
  }, [period]);

  if (loading && !reportData) return <div className="loading-screen"><div className="spinner" /><p>Analyzing your data...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Health Reports</h1>
          <p className="page-subtitle">Detailed analytics and AI-powered insights</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${period === 'weekly' ? 'active' : ''}`} onClick={() => setPeriod('weekly')}>7 Days</button>
        <button className={`tab-btn ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>30 Days</button>
      </div>

      {reportData && (
        <>
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div className="chart-title" style={{ marginBottom: 16 }}>💡 Health Insights</div>
            {reportData.insights?.length > 0 ? (
              reportData.insights.map((ins, i) => (
                <div key={i} className={`insight-item ${ins.type}`}>
                  <div className="insight-icon">
                    {ins.type === 'success' ? '✅' : ins.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </div>
                  <div className="insight-text">{ins.message}</div>
                </div>
              ))
            ) : (
              <p className="text-muted">Not enough data to generate insights yet.</p>
            )}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Avg Daily Calories</div>
              <div className="stat-value">{reportData.averages?.calories || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Daily Water</div>
              <div className="stat-value">{reportData.averages?.water || 0} <span className="text-sm">ml</span></div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Daily Sleep</div>
              <div className="stat-value">{reportData.averages?.sleep || 0} <span className="text-sm">h</span></div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Daily Exercise</div>
              <div className="stat-value">{reportData.averages?.exercise || 0} <span className="text-sm">m</span></div>
            </div>
          </div>

          {period === 'monthly' && reportData.weeklyTrend && (
            <div className="grid-2">
              <div className="card chart-container">
                <div className="chart-title mb-4">Monthly Calorie Trend</div>
                <CalorieChart data={reportData.weeklyTrend.map((w, i) => ({ date: `Week ${i + 1}`, calories: w.calories }))} />
              </div>
              <div className="card chart-container">
                <div className="chart-title mb-4">Monthly Exercise Trend</div>
                <ExerciseChart data={reportData.weeklyTrend.map((w, i) => ({ date: `Week ${i + 1}`, exercise: w.exercise }))} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;