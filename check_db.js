
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log("Checking database connection...");
  try {
    const count = await prisma.user.count();
    console.log(`Connection successful. Total users: ${count}`);
    
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, email: true, role: true, createdAt: true }
    });
    
    console.log("Latest users:");
    users.forEach(u => console.log(` - ${u.email} (${u.role}) created at ${u.createdAt}`));
    
  } catch (e) {
    console.error("Database connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
