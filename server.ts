
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'mits-institutional-secret-2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- HEALTH CHECK ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- AUTH MIDDLEWARE ---
  interface AuthRequest extends Request {
    user?: any;
  }

  const authenticate = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Identity token required' });
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ error: 'Invalid or expired session' });
    }
  };

  // --- ROUTES ---

  // 1. Authentication & Security
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { clubMemberships: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.globalRole }, JWT_SECRET);
    res.json({ token, user });
  });

  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, globalRole, enrollmentNumber } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        globalRole: globalRole || 'STUDENT',
        enrollmentNumber
      }
    });

    const token = jwt.sign({ id: user.id, role: user.globalRole }, JWT_SECRET);
    res.json({ token, user });
  });

  // 2. Identity Ledger (Users)
  app.get('/api/users', authenticate, async (req, res) => {
    const users = await prisma.user.findMany({
      include: { clubMemberships: true }
    });
    res.json(users);
  });

  app.get('/api/users/:id', authenticate, async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { clubMemberships: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });

  app.put('/api/users/:id', authenticate, async (req: any, res) => {
    const { name, email, globalRole, enrollmentNumber, branch, phoneNumber, linkedin, github, skills, profileLocked } = req.body;
    
    const user = await prisma.user.upsert({
      where: { id: req.params.id },
      update: { name, email, globalRole, enrollmentNumber, branch, phoneNumber, linkedin, github, skills, profileLocked },
      create: { 
        id: req.params.id, 
        name, 
        email, 
        globalRole, 
        enrollmentNumber, 
        branch, 
        phoneNumber, 
        linkedin, 
        github, 
        skills, 
        profileLocked,
        password: await bcrypt.hash('MITS2026', 10) // Default pwd for new imports
      }
    });
    res.json(user);
  });

  app.delete('/api/users/:id', authenticate, async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // 3. Institutional Clubs
  app.get('/api/clubs', async (req, res) => {
    const clubs = await prisma.club.findMany({
      include: { achievements: true, events: true }
    });
    res.json(clubs);
  });

  app.post('/api/clubs', authenticate, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Admin only' });
    const { name, category, themeColor, subdomain, tagline } = req.body;
    const club = await prisma.club.create({
      data: { name, category, themeColor, subdomain, tagline, facultyCoordinatorId: 'faculty-jadon' }
    });
    res.status(201).json(club);
  });

  app.patch('/api/clubs/:id', authenticate, async (req: any, res) => {
    const club = await prisma.club.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(club);
  });

  // 4. Governance Hub (Events)
  app.get('/api/events', async (req, res) => {
    const events = await prisma.event.findMany({
      include: { club: true }
    });
    res.json(events);
  });

  app.post('/api/events', authenticate, async (req: any, res) => {
    const { title, description, type, fee, date, clubId } = req.body;
    const event = await prisma.event.create({
      data: { title, description, type, fee, date: new Date(date), clubId, status: 'Pending' }
    });
    res.status(201).json(event);
  });

  app.patch('/api/events/:id', authenticate, async (req: any, res) => {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(event);
  });

  app.delete('/api/events/:id', authenticate, async (req, res) => {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // 5. Registration & Gate Control
  app.get('/api/registrations', authenticate, async (req, res) => {
    const regs = await prisma.registration.findMany({
      include: { user: true, event: true }
    });
    res.json(regs);
  });

  app.post('/api/registrations', authenticate, async (req: any, res) => {
    const { userId, eventId, status, paymentType, paymentProofUrl, transactionId } = req.body;
    const reg = await prisma.registration.create({
      data: { userId, eventId, status: status || 'Pending' }
    });
    res.status(201).json(reg);
  });

  app.patch('/api/registrations/:id', authenticate, async (req: any, res) => {
    const reg = await prisma.registration.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(reg);
  });

  // 6. Recruitment Pipeline
  app.get('/api/applicants', authenticate, async (req, res) => {
    const applicants = await prisma.applicant.findMany({
      include: { club: true }
    });
    res.json(applicants);
  });

  // 7. Audit Logging
  app.get('/api/logs', authenticate, async (req, res) => {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
  });

  app.post('/api/logs', authenticate, async (req: any, res) => {
    const { action, details, userId } = req.body;
    const log = await prisma.auditLog.create({
      data: { action, details, userId }
    });
    res.status(201).json(log);
  });

  // 12. Messages
  app.get('/api/messages', authenticate, async (req, res) => {
    const messages = await prisma.message.findMany({
      orderBy: { timestamp: 'asc' }
    });
    res.json(messages);
  });

  app.post('/api/messages', authenticate, async (req: any, res) => {
    const msg = await prisma.message.create({ data: req.body });
    res.status(201).json(msg);
  });

  // 13. Saved Events
  app.get('/api/saved-events', authenticate, async (req: any, res) => {
    const saved = await prisma.savedEvent.findMany({
      where: { userId: req.user.id }
    });
    res.json(saved);
  });

  app.post('/api/saved-events', authenticate, async (req: any, res) => {
    const { eventId } = req.body;
    const userId = req.user.id;
    
    const existing = await prisma.savedEvent.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });

    if (existing) {
      await prisma.savedEvent.delete({
        where: { userId_eventId: { userId, eventId } }
      });
      res.json({ saved: false });
    } else {
      await prisma.savedEvent.create({
        data: { userId, eventId }
      });
      res.json({ saved: true });
    }
  });

  // 8. Venues
  app.get('/api/venues', async (req, res) => {
    const venues = await prisma.venue.findMany();
    res.json(venues);
  });

  app.post('/api/venues', authenticate, async (req, res) => {
    const venue = await prisma.venue.create({ data: req.body });
    res.json(venue);
  });

  app.delete('/api/venues/:id', authenticate, async (req, res) => {
    await prisma.venue.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // 9. Developers & Mentors
  app.get('/api/developers', async (req, res) => {
    const devs = await prisma.developer.findMany();
    res.json(devs);
  });

  app.post('/api/developers', authenticate, async (req, res) => {
    const dev = await prisma.developer.upsert({
      where: { id: req.body.id || 'new' },
      update: req.body,
      create: req.body
    });
    res.json(dev);
  });

  app.delete('/api/developers/:id', authenticate, async (req, res) => {
    await prisma.developer.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  app.get('/api/mentors', async (req, res) => {
    const mentors = await prisma.mentor.findMany();
    res.json(mentors);
  });

  app.post('/api/mentors', authenticate, async (req, res) => {
    const mentor = await prisma.mentor.upsert({
      where: { id: req.body.id || 'new' },
      update: req.body,
      create: req.body
    });
    res.json(mentor);
  });

  app.delete('/api/mentors/:id', authenticate, async (req, res) => {
    await prisma.mentor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // 10. Config
  app.get('/api/config', async (req, res) => {
    const config = await prisma.devConfig.findUnique({ where: { id: 'config' } });
    res.json(config || {});
  });

  app.post('/api/config', authenticate, async (req, res) => {
    const config = await prisma.devConfig.upsert({
      where: { id: 'config' },
      update: req.body,
      create: { ...req.body, id: 'config' }
    });
    res.json(config);
  });

  // 11. Notifications
  app.get('/api/notifications', authenticate, async (req, res) => {
    const notifs = await prisma.notification.findMany({ orderBy: { timestamp: 'desc' } });
    res.json(notifs);
  });

  app.post('/api/notifications', authenticate, async (req, res) => {
    const notif = await prisma.notification.create({ data: req.body });
    res.json(notif);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MITS Institutional API Core live on port ${PORT}`);
  });
}

startServer();
