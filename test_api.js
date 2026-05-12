const http = require('http');

const body = JSON.stringify({
  name: 'Test User',
  email: 'test@health.com',
  password: 'password123',
  age: 22,
  height: 175,
  weight: 70,
  gender: 'male'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Raw response:', data);
    try {
      const parsed = JSON.parse(data);
      if (parsed.success) {
        console.log('\n✅ REGISTER SUCCESS');
        console.log('User:', parsed.user?.name, '| BMI:', parsed.user?.bmi);
        console.log('Token received:', !!parsed.token);
      } else {
        console.log('\n❌ REGISTER FAILED:', parsed.message);
        if (parsed.stack) console.log('Stack:', parsed.stack.split('\n')[0]);
      }
    } catch(e) {
      console.log('Parse error:', e.message);
    }
  });
});

req.on('error', (e) => console.error('❌ CONNECTION ERROR:', e.message));
req.write(body);
req.end();
