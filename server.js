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

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(contacts);
  } catch (error) {
    console.error('Contacts fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const phone = req.body.phone?.trim();

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
      },
    });

    return res.status(201).json(contact);
  } catch (error) {
    console.error('Contact save error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001);
