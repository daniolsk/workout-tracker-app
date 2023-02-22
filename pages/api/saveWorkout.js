import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const { newExercises, newLogs, modifiedExercises, modifiedLogs } =
        req.body;

      for (const exercise of newExercises) {
        const newExercise = await prisma.exercise.create({
          data: {
            name: exercise.name,
            exerciseNumber: exercise.exerciseNumber,
            workoutId: exercise.workoutId,
          },
        });

        newLogs.forEach((log) => {
          if (log.exerciseId == exercise.id) {
            log.exerciseId = newExercise.id;
          }
        });
      }

      for (const log of newLogs) {
        const newLog = await prisma.log.create({
          data: {
            weight: log.weight,
            reps: log.reps,
            setNumber: log.setNumber,
            workoutId: log.workoutId,
            exerciseId: log.exerciseId,
          },
        });
      }

      for (const exercise of modifiedExercises) {
        const updatedExercise = await prisma.exercise.update({
          where: {
            id: exercise.id,
          },
          data: {
            name: exercise.name,
            exerciseNumber: exercise.number,
            workoutId: exercise.workoutId,
          },
        });
      }

      for (const log of modifiedLogs) {
        const updatedLog = await prisma.log.update({
          where: {
            id: log.id,
          },
          data: {
            weight: log.weight,
            reps: log.reps,
            setNumber: log.setNumber,
            workoutId: log.workoutId,
            exerciseId: log.exerciseId,
          },
        });
      }

      return res.status(200).json({ msg: "Workout saved" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}
