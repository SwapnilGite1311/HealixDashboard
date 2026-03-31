const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const JWT_SECRET = 'healix_secret_2026';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// DB helpers
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// JWT middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// AUTH ROUTES
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  user.last_active = new Date().toISOString();
  writeDB(db);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/signup', (req, res) => {
  const { email, password, name } = req.body;
  const db = readDB();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' });

  const newUser = { id: uuidv4(), email, password, name: name || email.split('@')[0], role: 'Doctor', last_active: new Date().toISOString() };
  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
});

// DASHBOARD ROUTES (protected)
app.get('/api/dashboard', auth, (req, res) => {
  const db = readDB();
  const today = new Date().toISOString().slice(0, 10);

  const todayAppts = db.appointments.filter(a => a.date.startsWith(today));
  const totalAppointments = db.appointments.length;
  const uniquePatients = new Set(db.appointments.map(a => a.patient_id)).size;

  // Visits over last 7 days
  const visits = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    visits.push({ date: ds, label, count: db.appointments.filter(a => a.date.startsWith(ds)).length });
  }

  // Appointments by doctor
  const byDoctor = {};
  db.appointments.forEach(a => {
    byDoctor[a.doctor] = (byDoctor[a.doctor] || 0) + 1;
  });

  // Status breakdown
  const statusCount = { Scheduled: 0, Completed: 0, Cancelled: 0 };
  db.appointments.forEach(a => { statusCount[a.status] = (statusCount[a.status] || 0) + 1; });

  res.json({
    kpi: {
      patientsToday: todayAppts.length,
      totalAppointments,
      uniquePatients,
      activeUsers: db.users.length
    },
    visitsChart: visits,
    doctorChart: Object.entries(byDoctor).map(([doctor, count]) => ({ doctor: doctor.replace('Dr. ', ''), count })),
    statusChart: Object.entries(statusCount).map(([status, value]) => ({ status, value })),
    activityLog: db.activity_log.slice(-10).reverse()
  });
});

// APPOINTMENTS CRUD
app.get('/api/appointments', auth, (req, res) => {
  const db = readDB();
  res.json(db.appointments.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

app.post('/api/appointments', auth, (req, res) => {
  const db = readDB();
  const { patient_name, doctor, date, status, notes } = req.body;

  let patient = db.patients.find(p => p.name.toLowerCase() === patient_name.toLowerCase());
  if (!patient) {
    patient = { id: uuidv4(), name: patient_name };
    db.patients.push(patient);
  }

  const newAppt = { id: uuidv4(), patient_id: patient.id, patient_name: patient.name, doctor, date, status: status || 'Scheduled', notes: notes || '' };
  db.appointments.push(newAppt);

  db.activity_log.push({ id: uuidv4(), message: `Appointment added for ${patient_name}`, timestamp: new Date().toISOString(), type: 'create' });
  writeDB(db);
  res.json(newAppt);
});

app.put('/api/appointments/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.appointments.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  db.appointments[idx] = { ...db.appointments[idx], ...req.body };
  db.activity_log.push({ id: uuidv4(), message: `Appointment updated for ${db.appointments[idx].patient_name}`, timestamp: new Date().toISOString(), type: 'update' });
  writeDB(db);
  res.json(db.appointments[idx]);
});

app.delete('/api/appointments/:id', auth, (req, res) => {
  const db = readDB();
  const appt = db.appointments.find(a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: 'Not found' });

  db.appointments = db.appointments.filter(a => a.id !== req.params.id);
  db.activity_log.push({ id: uuidv4(), message: `Appointment deleted for ${appt.patient_name}`, timestamp: new Date().toISOString(), type: 'delete' });
  writeDB(db);
  res.json({ success: true });
});

app.get('/api/patients', auth, (req, res) => {
  const db = readDB();
  res.json(db.patients);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Healix backend running on port ${PORT}`));
