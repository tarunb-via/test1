import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await prisma.weightEntry.findMany({ orderBy: { recordedAt: 'desc' } });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/entries', async (req, res) => {
  try {
    const { weight, recordedAt, note } = req.body;
    const entry = await prisma.weightEntry.create({ data: { weight, recordedAt: new Date(recordedAt), note: note?.trim() || null } });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/goal', async (req, res) => {
  try {
    const goal = await prisma.goal.findFirst({ orderBy: { updatedAt: 'desc' } });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goal', async (req, res) => {
  try {
    const { targetWeight, startingWeight, targetDate } = req.body;
    const existing = await prisma.goal.findFirst();
    const data = { targetWeight, startingWeight, targetDate: targetDate ? new Date(targetDate) : null };
    const goal = existing ? await prisma.goal.update({ where: { id: existing.id }, data }) : await prisma.goal.create({ data });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001);
