import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const inventory = [
  { name: 'Espresso Beans', sku: 'BEAN-ESP-001', category: 'Coffee', location: 'Aisle A · Bin 04', quantity: 42, reorderLevel: 18, unitCost: 14.5 },
  { name: 'Oat Milk Cartons', sku: 'MLK-OAT-014', category: 'Dairy Alternatives', location: 'Cold Room · Shelf 2', quantity: 16, reorderLevel: 20, unitCost: 3.25 },
  { name: 'Compostable Cups 12oz', sku: 'CUP-COM-120', category: 'Packaging', location: 'Aisle C · Rack 1', quantity: 280, reorderLevel: 120, unitCost: 0.18 },
  { name: 'Vanilla Syrup Bottles', sku: 'SYR-VAN-009', category: 'Flavorings', location: 'Aisle B · Bin 11', quantity: 9, reorderLevel: 12, unitCost: 6.75 },
  { name: 'Frozen Croissants', sku: 'BAK-CRO-021', category: 'Bakery', location: 'Freezer · Drawer 3', quantity: 64, reorderLevel: 24, unitCost: 1.1 },
  { name: 'Matcha Powder Tins', sku: 'TEA-MAT-006', category: 'Tea', location: 'Aisle A · Bin 09', quantity: 11, reorderLevel: 10, unitCost: 18.9 },
  { name: 'Paper Napkin Packs', sku: 'NAP-PAP-033', category: 'Supplies', location: 'Aisle D · Rack 5', quantity: 95, reorderLevel: 40, unitCost: 1.95 },
  { name: 'Cold Brew Bottles', sku: 'BOT-CBR-018', category: 'Beverages', location: 'Cold Room · Shelf 5', quantity: 22, reorderLevel: 15, unitCost: 2.4 }
];

async function main() {
  await prisma.inventoryItem.deleteMany();
  await prisma.inventoryItem.createMany({ data: inventory });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
