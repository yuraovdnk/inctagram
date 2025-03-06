import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const data = await prisma.accountPlan.createMany({
    data: [
      {
        name: 'Business plan',
        description: 'Access to basic features',
        price: 9.99,
        type: 'Business',
        duration: 1,
        durationUnit: 'MONTH',
      },
      {
        name: 'Business Month',
        description: 'Access to all features with priority support',
        price: 19.99,
        type: 'Business',
        duration: 1,
        durationUnit: 'YEAR',
      },
    ],
  });

  console.log(data);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
