import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.contact.deleteMany();

  await prisma.contact.createMany({
    data: [
      { name: 'Avery Johnson', phone: '(415) 555-0182' },
      { name: 'Maya Patel', phone: '(212) 555-0147' },
      { name: 'Carlos Ramirez', phone: '(310) 555-0199' },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
