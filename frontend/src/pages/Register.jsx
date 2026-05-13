import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const steps = [
  { title: 'Account Setup', sub: 'Create your login credentials' },
  { title: 'Health Profile', sub: 'Tell us about yourself' },
];

const Register = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: '', height: '', weight: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setStep(1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const features = [
    { icon: '📊', title: 'Smart Dashboard', desc: 'Real-time health overview with beautiful charts' },
    { icon: '🎯', title: 'Goal Tracking', desc: 'Set targets and watch your progress daily' },
    { icon: '💡', title: 'AI Insights', desc: 'Personalised health recommendations' },
    { icon: '⚖️', title: 'BMI Monitor', desc: 'Track your ideal weight range' },
  ];

  return (
    <div style={styles.page}>
      <div style={{...styles.orb, ...styles.orb1}} />
      <div style={{...styles.orb, ...styles.orb2}} />
      <div style={{...styles.orb, ...styles.orb3}} />

      <div style={styles.container}>
        {/* LEFT — Feature Showcase */}
        <div style={styles.left}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>❤️</div>
            <span style={styles.brandName}>HealthTrack</span>
          </div>
          <h1 style={styles.heroTitle}>
            Track Everything,<br />
            <span style={styles.grad}>Achieve Anything</span>
          </h1>
          <p style={styles.heroSub}>Join thousands who transformed their health with data-driven insights.</p>

          <div style={styles.featureList}>
            {features.map((f, i) => (
              <div key={i} style={{...styles.featureItem, animationDelay: `${i * 0.12}s`}}>
                <div style={styles.featureIconWrap}>{f.icon}</div>
                <div>
                  <div style={styles.featureTitle}>{f.title}</div>
                  <div style={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.bottomBanner}>
            <span style={styles.bannerStar}>⭐⭐⭐⭐⭐</span>
            <span style={styles.bannerText}>&quot;Changed how I view my health!&quot; — Student User</span>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={styles.right}>
          <div style={styles.card}>
            {/* Step indicator */}
            <div style={styles.stepBar}>
              {steps.map((s, i) => (
                <div key={i} style={styles.stepItem} onClick={() => i < step && setStep(i)}>
                  <div style={{
                    ...styles.stepCircle,
                    background: i <= step ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : 'rgba(255,255,255,0.08)',
                    boxShadow: i <= step ? '0 0 12px rgba(168,85,247,0.5)' : 'none',
                    cursor: i < step ? 'pointer' : 'default',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      ...styles.stepLine,
                      background: i < step ? 'linear-gradient(90deg,#7c3aed,#06b6d4)' : 'rgba(255,255,255,0.08)',
                    }} />
                  )}
                </div>
              ))}
            </div>

            <div style={styles.stepLabel}>
              <h2 style={styles.stepTitle}>{steps[step].title}</h2>
              <p style={styles.stepSub}>{steps[step].sub}</p>
            </div>

            {step === 0 ? (
              <form onSubmit={nextStep}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>👤 Full Name</label>
                  <input id="name" name="name" type="text" style={styles.input}
                    placeholder="John Doe" value={form.name} onChange={handle}
                    required onFocus={e => e.target.style.borderColor='#a855f7'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📧 Email Address</label>
                  <input id="reg-email" name="email" type="email" style={styles.input}
                    placeholder="you@example.com" value={form.email} onChange={handle}
                    required onFocus={e => e.target.style.borderColor='#a855f7'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🔒 Password</label>
                  <div style={{ position: 'relative' }}>
                    <input id="reg-password" name="password" type={showPass ? 'text' : 'password'} style={{...styles.input, paddingRight:48}}
                      placeholder="Min 6 characters" value={form.password} onChange={handle}
                      required onFocus={e => e.target.style.borderColor='#a855f7'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>{showPass ? '🙈' : '👁️'}</button>
                  </div>
                  {/* Password strength */}
                  {form.password && (
                    <div style={styles.strengthBar}>
                      <div style={{
                        ...styles.strengthFill,
                        width: form.password.length >= 10 ? '100%' : form.password.length >= 6 ? '60%' : '30%',
                        background: form.password.length >= 10 ? '#10b981' : form.password.length >= 6 ? '#f59e0b' : '#ef4444',
                      }} />
                    </div>
                  )}
                </div>
                <button type="submit" style={styles.btn}>
                  <span>Continue →</span>
                  <div style={styles.btnShimmer} />
                </button>
              </form>
            ) : (
              <form onSubmit={submit}>
                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>🎂 Age</label>
                    <input id="age" name="age" type="number" style={styles.input} placeholder="22" value={form.age} onChange={handle} onFocus={e => e.target.style.borderColor='#a855f7'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>⚧ Gender</label>
                    <select id="gender" name="gender" style={styles.select} value={form.gender} onChange={handle} onFocus={e => e.target.style.borderColor='#a855f7'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>📏 Height (cm)</label>
                    <input id="height" name="height" type="number" style={styles.input} placeholder="175" value={form.height} onChange={handle} onFocus={e => e.target.style.borderColor='#a855f7'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>⚖️ Weight (kg)</label>
                    <input id="weight" name="weight" type="number" style={styles.input} placeholder="70" value={form.weight} onChange={handle} onFocus={e => e.target.style.borderColor='#a855f7'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  </div>
                </div>

                {/* BMI Preview */}
                {form.height && form.weight && (
                  <div style={styles.bmiPreview}>
                    <span>⚖️ Your BMI: </span>
                    <strong style={{ color: '#10b981' }}>
                      {(form.weight / Math.pow(form.height / 100, 2)).toFixed(1)}
                    </strong>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="button" onClick={() => setStep(0)} style={{...styles.btn, flex: 1, background: 'rgba(255,255,255,0.07)', boxShadow: 'none', width: 'auto'}}>
                    ← Back
                  </button>
                  <button id="register-btn" type="submit" style={{...styles.btn, flex: 2, width: 'auto'}} disabled={loading}>
                    <span style={{ position:'relative', zIndex:1 }}>{loading ? '⏳ Creating...' : '✨ Create Account'}</span>
                    <div style={styles.btnShimmer} />
                  </button>
                </div>
              </form>
            )}

            <div style={styles.switchText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.link}>Sign in →</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbPulse1{0%,100%{transform:scale(1) translate(0,0)}50%{transform:scale(1.2) translate(30px,-20px)}}
        @keyframes orbPulse2{0%,100%{transform:scale(1) translate(0,0)}50%{transform:scale(0.85) translate(-30px,25px)}}
        @keyframes orbPulse3{0%,100%{transform:scale(1.1)}50%{transform:scale(0.9) translate(20px,30px)}}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes featureIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shimmer{0%{left:-100%}100%{left:200%}}
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0118 0%, #0d0a2e 30%, #0a1628 60%, #020b18 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif",
  },
  orb: { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' },
  orb1: { width:500, height:500, background:'radial-gradient(circle,rgba(168,85,247,0.3) 0%,transparent 70%)', top:-150, right:-100, animation:'orbPulse1 9s ease-in-out infinite' },
  orb2: { width:400, height:400, background:'radial-gradient(circle,rgba(6,182,212,0.25) 0%,transparent 70%)', bottom:-100, left:-100, animation:'orbPulse2 11s ease-in-out infinite' },
  orb3: { width:300, height:300, background:'radial-gradient(circle,rgba(236,72,153,0.2) 0%,transparent 70%)', top:'40%', left:'35%', animation:'orbPulse3 8s ease-in-out infinite' },
  container: { display:'flex', alignItems:'center', gap:48, maxWidth:1100, width:'100%', padding:'40px 32px', position:'relative', zIndex:10 },
  left: { flex:1, animation:'slideInLeft 0.7s ease both' },
  brand: { display:'inline-flex', alignItems:'center', gap:10, background:'rgba(168,85,247,0.12)', border:'1px solid rgba(168,85,247,0.25)', borderRadius:999, padding:'6px 14px', marginBottom:24 },
  brandIcon: { fontSize:18 },
  brandName: { fontSize:'0.9rem', fontWeight:700, color:'#d8b4fe' },
  heroTitle: { fontSize:'2.6rem', fontWeight:900, color:'#f1f5f9', lineHeight:1.2, marginBottom:12 },
  grad: { background:'linear-gradient(135deg,#a855f7,#06b6d4,#10b981)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  heroSub: { fontSize:'0.95rem', color:'#64748b', lineHeight:1.7, marginBottom:28, maxWidth:380 },
  featureList: { display:'flex', flexDirection:'column', gap:14, marginBottom:28 },
  featureItem: { display:'flex', alignItems:'flex-start', gap:14, padding:'14px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, animation:'featureIn 0.5s ease both', backdropFilter:'blur(8px)' },
  featureIconWrap: { fontSize:22, width:40, height:40, background:'rgba(168,85,247,0.15)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  featureTitle: { fontSize:'0.88rem', fontWeight:700, color:'#e2e8f0', marginBottom:2 },
  featureDesc: { fontSize:'0.75rem', color:'#64748b' },
  bottomBanner: { background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.15)', borderRadius:12, padding:'12px 16px' },
  bannerStar: { display:'block', fontSize:'0.85rem', marginBottom:4 },
  bannerText: { fontSize:'0.8rem', color:'#94a3b8', fontStyle:'italic' },
  right: { width:440, flexShrink:0, animation:'slideInRight 0.7s ease both' },
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, padding:32, backdropFilter:'blur(24px)', boxShadow:'0 0 60px rgba(168,85,247,0.12), 0 20px 60px rgba(0,0,0,0.5)' },
  stepBar: { display:'flex', alignItems:'center', marginBottom:24 },
  stepItem: { display:'flex', alignItems:'center', flex:1 },
  stepCircle: { width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, color:'white', flexShrink:0 },
  stepLine: { flex:1, height:2, margin:'0 8px' },
  stepLabel: { marginBottom:24 },
  stepTitle: { fontSize:'1.4rem', fontWeight:800, color:'#f1f5f9', marginBottom:4 },
  stepSub: { fontSize:'0.83rem', color:'#64748b' },
  inputGroup: { marginBottom:16, flex:1 },
  label: { display:'block', fontSize:'0.8rem', fontWeight:600, color:'#94a3b8', marginBottom:6 },
  input: { width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#f1f5f9', fontSize:'0.88rem', fontFamily:'Inter,sans-serif', transition:'all 0.25s', outline:'none', boxSizing:'border-box' },
  select: { width:'100%', padding:'12px 16px', background:'rgba(15,22,40,0.9)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#f1f5f9', fontSize:'0.88rem', fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box' },
  eyeBtn: { position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:18, padding:4 },
  strengthBar: { height:3, background:'rgba(255,255,255,0.07)', borderRadius:2, marginTop:6, overflow:'hidden' },
  strengthFill: { height:'100%', borderRadius:2, transition:'all 0.4s ease' },
  row: { display:'flex', gap:12 },
  bmiPreview: { background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, padding:'10px 14px', fontSize:'0.85rem', color:'#94a3b8', marginBottom:16 },
  btn: { width:'100%', padding:'14px 20px', background:'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#06b6d4 100%)', border:'none', borderRadius:12, color:'white', fontSize:'0.95rem', fontWeight:700, fontFamily:'Inter,sans-serif', cursor:'pointer', position:'relative', overflow:'hidden', boxShadow:'0 4px 25px rgba(124,58,237,0.45)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 },
  btnShimmer: { position:'absolute', top:0, left:'-100%', width:'60%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', transform:'skewX(-20deg)', animation:'shimmer 2.5s ease-in-out infinite' },
  switchText: { textAlign:'center', fontSize:'0.83rem', color:'#64748b', marginTop:20 },
  link: { color:'#a855f7', textDecoration:'none', fontWeight:700 },
};

export default Register;
