import express, { Application, Request, Response } from "express";
import { Course, HoleInformation, PrismaClient, UserHoleScore } from "@prisma/client";

import cors from "cors";

const app: Application = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

app.post(
  "/new_course",
  async (req: Request, res: Response): Promise<Response> => {

    try {
      const course = await prisma.course.create({
        data: {
          name: req.body.name,
        },
      });

      for (const hole of req.body.holes) {
        await prisma.holeInformation.create({
          data: {
            ...hole,
            courseId: course.id,
          },
        });
      }

      return res.status(200).send({ id: course.id });
    } catch (e) {
      return res.status(500).send();
    }
  }
);

app.post(
  "/new_round",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const round = await prisma.round.create({
        data: {
          name: req.body.name,
          date: req.body.date,
        },
      });

      for (const hole of req.body.holes) {
        await prisma.userHoleScore.create({
          data: {
            holeNumber: hole.holeNumber,
            par: hole.par,
            yardage: hole.yardage,
            handicap: hole.handicap,
            roundId: round.id,
          },
        });
      }
      return res.status(200).send({ id: round.id });
    } catch (e) {
      return res.status(500).send();
    }
  }
);

app.get(
  "/get_courses",
  async (req: Request, res: Response): Promise<Response> => {
    const courses = await prisma.course.findMany({})

    const coursesWithHoles: Course[] = await Promise.all(courses.map(async (course) => {
      const info = await prisma.holeInformation.findMany({
        where: {
          courseId: course.id,
          }
        })
        return {
          ...course,
          holes: info
        }
      })
    )

    return res.status(200).send(coursesWithHoles);
  }
);

app.get(
  "/get_round/:id",
  async (req: Request, res: Response): Promise<Response> => {
    
    try {
      const round = await prisma.round.findFirst({
        where: {
          id: Number(req.params.id),
        }
      })

      if (round) {
        const holes = await prisma.userHoleScore.findMany({
          where: {
            roundId: round.id
          }
        })
        return res.status(200).send({
          ...round,
          holes: holes
        });
      }

      return res.status(200).send();
    } catch {
      return res.status(500).send();
    }

    
  }
);

app.get('/get_rounds', async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const rounds = await prisma.round.findMany()

    const roundsWithScores = await Promise.all(rounds.map(async (round) => {
      const info = await prisma.userHoleScore.findMany({
        where: {
          roundId: round.id,
          }
        })
        return {
          ...round,
          holes: info
        }
      })
    )
    return res.status(200).send(roundsWithScores);
  } catch {
    return res.status(500).send();
  }
})

app.post(
  "/update_round_scores",
  async (req: Request, res: Response): Promise<Response> => {

    const holes = await prisma.userHoleScore.findMany({
      where: {
        roundId: Number(req.body.id),
      }
    })

    await Promise.all(holes.map(async (hole) => {
      const { strokes, notes } = req.body.holes.find((i: UserHoleScore) => i.holeNumber === hole.holeNumber)
      await prisma.userHoleScore.update({
        where: {
          id: hole.id,
        },
        data: {
          strokes,
          notes
        }
        })
      })
    )

    return res.status(200).send();
  }
);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
