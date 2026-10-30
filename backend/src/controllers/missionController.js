import prisma from '../config/prisma.js';

export const getMissions = async (req, res) => {
  try {
    const missions = await prisma.mission.findMany({
      include: {
        completions: {
          where: {
            userId: req.userId,
          },
        },
      },
    });

    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching missions", error: error.message });
  }
};

export const completeMission = async (req, res) => {
  try {
    const { missionId, update } = req.body;
    const userId = req.userId;

    const existingCompletion = await prisma.missionCompletion.findFirst({
      where: {
        missionId,
        userId,
      },
    });

    if (existingCompletion) {
      return res.status(400).json({ message: "Mission already completed" });
    }

    const completion = await prisma.missionCompletion.create({
      data: {
        missionId,
        userId,
        update,
      },
    });

    res.status(201).json(completion);
  } catch (error) {
    res.status(500).json({ message: "Error completing mission", error: error.message });
  }
};

export const createMission = async (req, res) => {
  try {
    const { title, description, points } = req.body;
    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        points: parseInt(points),
      },
    });

    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ message: "Error creating mission", error: error.message });
  }
};
export const undoMission = async (req, res) => {
  try {
    const { missionId } = req.params;
    const userId = req.userId;

    const result = await prisma.missionCompletion.deleteMany({
      where: {
        missionId,
        userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "Mission completion not found",
      });
    }

    res.status(200).json({
      message: "Mission marked as incomplete",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error undoing mission completion",
      error: error.message,
    });
  }
};