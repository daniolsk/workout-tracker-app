const { PrismaClient } = require("@prisma/client");
const { exercise, log, user, workout } = require("./data.js");
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.exercise.deleteMany();
    await prisma.log.deleteMany();
    await prisma.user.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.tag.deleteMany();

    await prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE Workout AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE Exercise AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE Log AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE Tag AUTO_INCREMENT = 1`;

    await prisma.$queryRaw`DELETE FROM _TagToWorkout`;

    // await prisma.exercise.createMany({
    //   data: exercise,
    // });
    for (const w of workout) {
      await prisma.workout.create({
        data: {
          name: w.name,
          userId: w.userId,
          isActive: w.isActive,
          tags: {
            create: w.tags,
          },
        },
      });
    }
    await prisma.log.createMany({
      data: log,
    });
    await prisma.user.createMany({
      data: user,
    });
    await prisma.exercise.createMany({
      data: exercise,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    prisma.$disconnect();
  }
};

load();

// let data = await prisma.workout.findMany({
//   where: {
//     userId: dataFromToken.id,
//   },
//   orderBy: {
//     date: "asc",
//   },
//   include: {
//     exercises: {
//       orderBy: {
//         exerciseNumber: "asc",
//       },
//       include: {
//         logs: {
//           orderBy: {
//             setNumber: "asc",
//           },
//         },
//       },
//     },
//   },
// });
