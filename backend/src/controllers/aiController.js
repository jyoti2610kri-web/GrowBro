import prisma from '../config/prisma.js';
import {
  generateResponse,
  generateInterviewResponse
} from '../services/aiService.js';

export const askAi = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId;

    const response = await generateResponse(prompt);

    const aiChat = await prisma.aiChat.create({
      data: {
        prompt,
        response,
        userId,
      },
    });

    res.status(200).json(aiChat);

  } catch (error) {
    console.error('Gemini AI Error:', error);

    res.status(500).json({
      message: 'Unable to generate AI response. Please try again.',
      error: error.message
    });
  }
};

export const getAiHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const history = await prisma.aiChat.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI history", error: error.message });
  }
};


export const startMockInterview = async (req, res) => {
  try {
    const { interviewType, conversation = [] } = req.body;
    const userId = req.userId;

    if (!['Technical', 'HR'].includes(interviewType)) {
      return res.status(400).json({
        message: 'Interview type must be Technical or HR.'
      });
    }

    if (!Array.isArray(conversation)) {
      return res.status(400).json({
        message: 'Invalid conversation format.'
      });
    }

    const isValidConversation = conversation.every(
      msg =>
        msg &&
        ['user', 'assistant'].includes(msg.role) &&
        typeof msg.content === 'string'
    );

    if (!isValidConversation) {
      return res.status(400).json({
        message: 'Invalid interview messages.'
      });
    }

    const response = await generateInterviewResponse(
      interviewType,
      conversation
    );

    const lastUserMessage = [...conversation]
      .reverse()
      .find(msg => msg.role === 'user');

    const aiChat = await prisma.aiChat.create({
      data: {
        prompt: lastUserMessage?.content ||
          `Start ${interviewType} interview`,
        response,
        userId
      }
    });

    res.status(200).json(aiChat);

  } catch (error) {
    console.error('Mock Interview Error:', error);

    res.status(500).json({
      message: 'Unable to continue the mock interview.',
      error: error.message
    });
  }
};
