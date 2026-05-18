const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const hashFlag = (flag) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
};

async function main() {
  console.log('Start seeding...');

  // 1. Create Sample Challenges
  const challenges = [
    {
      title: 'Warmup: Welcome',
      description: 'Welcome to the CTF! The flag is: CTF{welcome_to_monolith}',
      points: 50,
      category: 'Misc',
      flag: 'CTF{welcome_to_monolith}'
    },
    {
      title: 'Web: Robots',
      description: 'Where do robots hide their secrets?',
      points: 100,
      category: 'Web',
      flag: 'CTF{robots_are_watching_you}'
    },
    {
      title: 'Crypto: Easy Caesar',
      description: 'Enot kh n qpko rkqf (Shift 13). Flag format: CTF{...}',
      points: 150,
      category: 'Cryptography',
      flag: 'CTF{rot13_is_not_encryption}'
    },
    {
      title: 'DevOps: Docker Layers',
      description: 'Find the secret hidden in the docker layers.',
      points: 200,
      category: 'DevOps',
      flag: 'CTF{layered_security_is_best}'
    }
  ];

  for (const c of challenges) {
    const challenge = await prisma.challenge.upsert({
      where: { id: crypto.randomUUID() }, // This is not ideal for upsert but for seeding it's okay if we clear first or use a fixed ID
      update: {},
      create: {
        title: c.title,
        description: c.description,
        points: c.points,
        category: c.category,
        flagHash: hashFlag(c.flag),
      },
    });
    console.log(`Created challenge: ${challenge.title}`);
  }

  // 2. Create a Test Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ctf.local' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ctf.local',
      passwordHash: crypto.createHash('sha256').update('admin123').digest('hex'),
      totalScore: 0,
    },
  });
  console.log(`Created admin user: ${admin.username}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
