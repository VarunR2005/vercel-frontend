import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 56px;
        }
        .login-left-bg {
          position: absolute;
          inset: 0;
          background-image: url('/login-bg.png');
          background-size: cover;
          background-position: center;
          filter: brightness(0.7);
        }
        .login-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10,1,24,0.3) 0%,
            rgba(124,58,237,0.25) 40%,
            rgba(6,182,212,0.2) 70%,
            rgba(10,1,24,0.85) 100%
          );
        }
        .login-left-content { position: relative; z-index: 2; }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 8px 18px;
          margin-bottom: 28px;
          width: fit-content;
        }
        .brand-badge span { font-size: 0.88rem; font-weight: 700; color: #fff; letter-spacing: 0.02em; }

        .hero-heading {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 16px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .hero-heading .highlight {
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          max-width: 440px;
          margin-bottom: 36px;
        }

        .stat-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .stat-chip {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 14px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: chipIn 0.5s ease both;
        }
        .stat-chip:nth-child(2) { animation-delay: 0.1s; }
        .stat-chip:nth-child(3) { animation-delay: 0.2s; }
        .stat-chip:nth-child(4) { animation-delay: 0.3s; }
        .stat-chip .icon { font-size: 22px; }
        .stat-chip .val { font-size: 1.1rem; font-weight: 800; color: #fff; }
        .stat-chip .lbl { font-size: 0.7rem; color: rgba(255,255,255,0.6); margin-top: 1px; }

        .trust-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .trust-avatars { display: flex; }
        .trust-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          margin-left: -8px;
        }
        .trust-avatar:first-child { margin-left: 0; }
        .trust-text { font-size: 0.82rem; color: rgba(255,255,255,0.65); }
        .trust-text strong { color: #fff; }

        /* ── RIGHT PANEL ── */
        .login-right {
          width: 480px;
          flex-shrink: 0;
          background: #0a0118;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .login-right::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%);
          top: -150px; right: -100px;
          pointer-events: none;
        }
        .login-right::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%);
          bottom: -100px; left: -50px;
          pointer-events: none;
        }

        .form-wrap {
          width: 100%;
          max-width: 360px;
          position: relative;
          z-index: 1;
          animation: formIn 0.6s ease both;
        }

        .form-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .form-logo-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          box-shadow: 0 0 24px rgba(168,85,247,0.5);
        }
        .form-logo-text { font-size: 1.4rem; font-weight: 900; color: #fff; }

        .form-title { font-size: 2rem; font-weight: 900; color: #f1f5f9; margin-bottom: 6px; }
        .form-subtitle { font-size: 0.88rem; color: #475569; margin-bottom: 32px; }

        .f-group { margin-bottom: 20px; }
        .f-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .f-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          color: #f1f5f9;
          font-size: 0.92rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.25s;
        }
        .f-input::placeholder { color: #334155; }
        .f-input:focus {
          border-color: #a855f7;
          background: rgba(168,85,247,0.06);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.15);
        }

        .f-pass-wrap { position: relative; }
        .f-eye {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; font-size: 18px; padding: 4px;
          color: #475569; transition: color 0.2s;
        }
        .f-eye:hover { color: #a855f7; }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 30px rgba(124,58,237,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 35px rgba(124,58,237,0.6);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: wait; }
        .submit-btn .shimmer {
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-20deg);
          animation: shimmer 2.5s ease-in-out infinite;
        }

        .divider { display: flex; align-items: center; gap: 14px; margin: 24px 0; }
        .div-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .div-text { font-size: 0.75rem; color: #334155; }

        .register-link {
          text-align: center;
          font-size: 0.85rem;
          color: #475569;
          margin-bottom: 24px;
        }
        .register-link a {
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-decoration: none;
        }

        .feature-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .tag {
          font-size: 0.68rem; font-weight: 600;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.2);
          color: #d8b4fe;
        }

        @keyframes chipIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes formIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }

        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right { width: 100%; }
        }
      `}</style>

      <div className="login-page">
        {/* ─── LEFT: HERO ─── */}
        <div className="login-left">
          <div className="login-left-bg" />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <div className="brand-badge">
              <span>❤️</span>
              <span>HealthTrack — Personal Health Dashboard</span>
            </div>

            <h1 className="hero-heading">
              Your Health.<br />
              <span className="highlight">Tracked. Analysed.</span><br />
              Improved.
            </h1>
            <p className="hero-sub">
              Monitor calories, water intake, sleep, exercise and BMI — all from one beautiful dashboard built for your university project and beyond.
            </p>

            <div className="stat-row">
              {[
                { icon: '🔥', val: '2,400', lbl: 'Calories Tracked' },
                { icon: '💧', val: '3.2 L', lbl: 'Water Logged' },
                { icon: '😴', val: '8.1 h', lbl: 'Avg Sleep' },
                { icon: '🏃', val: '45 m', lbl: 'Exercise / Day' },
              ].map((s, i) => (
                <div className="stat-chip" key={i}>
                  <div className="icon">{s.icon}</div>
                  <div>
                    <div className="val">{s.val}</div>
                    <div className="lbl">{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="trust-row">
              <div className="trust-avatars">
                {['🧑‍💻','👩','🧔','👩‍🦱','🧑'].map((a, i) => (
                  <div className="trust-avatar" key={i}>{a}</div>
                ))}
              </div>
              <span className="trust-text">Trusted by <strong>1,000+</strong> health enthusiasts</span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: FORM ─── */}
        <div className="login-right">
          <div className="form-wrap">
            <div className="form-logo">
              <div className="form-logo-icon">❤️</div>
              <div className="form-logo-text">HealthTrack</div>
            </div>

            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to your personal health dashboard</p>

            <form onSubmit={submit}>
              <div className="f-group">
                <label className="f-label">Email Address</label>
                <input id="email" name="email" type="email" className="f-input"
                  placeholder="you@example.com" value={form.email} onChange={handle} required />
              </div>

              <div className="f-group">
                <label className="f-label">Password</label>
                <div className="f-pass-wrap">
                  <input id="password" name="password" type={showPass ? 'text' : 'password'}
                    className="f-input" style={{ paddingRight: 48 }}
                    placeholder="••••••••" value={form.password} onChange={handle} required />
                  <button type="button" className="f-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button id="login-btn" type="submit" className="submit-btn" disabled={loading}>
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {loading ? '⏳ Signing in...' : '🚀 Sign In'}
                </span>
                <div className="shimmer" />
              </button>
            </form>

            <div className="divider">
              <div className="div-line" />
              <span className="div-text">or</span>
              <div className="div-line" />
            </div>

            <div className="register-link">
              Don&apos;t have an account? <Link to="/register">Create one free ✨</Link>
            </div>

            <div className="feature-tags">
              {['🔐 JWT Secured', '📊 Live Charts', '🎯 Goal Tracking', '⚖️ BMI Monitor'].map((f, i) => (
                <span className="tag" key={i}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
