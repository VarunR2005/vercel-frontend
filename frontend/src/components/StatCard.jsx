const StatCard = ({ icon, label, value, unit, sub, progress, progressColor, iconBg }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: iconBg || 'rgba(124,58,237,0.15)' }}>
      {icon}
    </div>
    <div className="stat-value">
      {value}<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: 4 }}>{unit}</span>
    </div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
    {progress !== undefined && (
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, progress)}%`,
            background: progressColor || 'var(--gradient-primary)',
          }}
        />
      </div>
    )}
  </div>
);

export default StatCard;
