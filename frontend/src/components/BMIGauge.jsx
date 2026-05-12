const BMIGauge = ({ bmi, category, color, idealRange }) => {
  const clampedBmi = Math.min(Math.max(bmi || 0, 10), 40);
  const percent = ((clampedBmi - 10) / 30) * 100;

  const getColor = () => {
    if (!bmi) return '#94a3b8';
    if (bmi < 18.5) return '#3b82f6';
    if (bmi < 25) return '#10b981';
    if (bmi < 30) return '#f59e0b';
    return '#ef4444';
  };

  const bmiColor = getColor();

  return (
    <div className="bmi-gauge">
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
        <svg width="160" height="90" viewBox="0 0 160 90">
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={bmiColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percent / 100) * 220} 220`}
            style={{ filter: `drop-shadow(0 0 6px ${bmiColor})`, transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>
          <div className="bmi-value" style={{ color: bmiColor, fontSize: '2rem' }}>{bmi || '--'}</div>
        </div>
      </div>
      <div className="bmi-category" style={{ color: bmiColor }}>{category || 'Update profile to see BMI'}</div>
      <div className="bmi-scale" style={{ marginTop: 16 }}>
        <div className="bmi-scale-segment" style={{ background: '#3b82f6' }} title="Underweight" />
        <div className="bmi-scale-segment" style={{ background: '#10b981' }} title="Normal" />
        <div className="bmi-scale-segment" style={{ background: '#f59e0b' }} title="Overweight" />
        <div className="bmi-scale-segment" style={{ background: '#ef4444' }} title="Obese" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
        <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
      </div>
      {idealRange && (
        <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '8px 12px' }}>
          💚 Ideal weight: <strong>{idealRange.min} – {idealRange.max} kg</strong>
        </div>
      )}
    </div>
  );
};

export default BMIGauge;
