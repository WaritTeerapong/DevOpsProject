import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const teams = [
    { name: 'Arsenal' },
    { name: 'Manchester City' },
    { name: 'Liverpool' },
    { name: 'Aston Villa' },
    { name: 'Tottenham Hotspur' },
  ]

  for (const team of teams) {
    await prisma.team.upsert({
      where: { name: team.name },
      update: {},
      create: { name: team.name },
    })
  }
  console.log('Seed teams created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
