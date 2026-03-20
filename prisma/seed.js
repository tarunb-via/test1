import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  await prisma.weightEntry.deleteMany();
  await prisma.goal.deleteMany();

  const base = 186.4;
  const entries = [
    { days: 28, weight: base, note: 'Starting point after a weekend reset.' },
    { days: 24, weight: 185.6, note: 'Good hydration and consistent sleep.' },
    { days: 21, weight: 184.9, note: 'Morning weigh-in before breakfast.' },
    { days: 18, weight: 184.4, note: 'Felt strong after three workouts this week.' },
    { days: 14, weight: 183.8, note: 'A little sore, but trend is steady.' },
    { days: 10, weight: 183.1, note: 'Busy week, still stayed on plan.' },
    { days: 7, weight: 182.7, note: 'Lower sodium day.' },
    { days: 4, weight: 182.2, note: 'Walked 10k steps.' },
    { days: 2, weight: 181.9, note: 'Solid sleep and recovery.' },
    { days: 0, weight: 181.6, note: 'Feeling lighter and more consistent.' },
  ];

  await prisma.weightEntry.createMany({
    data: entries.map((entry) => ({ weight: entry.weight, recordedAt: subDays(new Date(), entry.days), note: entry.note })),
  });

  await prisma.goal.create({
    data: { startingWeight: 186.4, targetWeight: 175, targetDate: subDays(new Date(), -60) },
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
