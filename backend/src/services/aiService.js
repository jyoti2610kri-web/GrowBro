
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Check backend .env');
  }

  if (!prompt || !prompt.trim()) {
    throw new Error('Please enter a question.');
  }

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
    systemInstruction: `
      You are GrowBro AI, a friendly learning and career assistant
      for students.

      Help students with:
      - Programming and technical concepts
      - DSA and coding practice
      - Study plans and learning strategies
      - Communication skills
      - Resume and interview preparation
      - Career guidance

      Give accurate, practical answers in simple English.
      Explain concepts step by step when needed.
      Never invent user progress or community activity.
      Be encouraging but honest.
    `
  });

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  if (!response) {
    throw new Error('Gemini returned an empty response.');
  }

  return response;
};

export const generateInterviewResponse = async (interviewType, conversation) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing.');
  }

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
    systemInstruction: `
      You are GrowBro's professional mock interviewer.

      Interview type: ${interviewType}

      Rules:
      - If this is the beginning, welcome the student and ask one question.
      - Ask only ONE question at a time.
      - Wait for the student's answer before asking the next question.
      - Evaluate each answer honestly.
      - Give a short explanation of what was good and what needs improvement.
      - Give a suggested better answer when useful.
      - Ask the next relevant question.
      - Keep the language simple and encouraging.
      - For Technical interviews, ask programming and computer science questions.
      - For HR interviews, ask communication, teamwork and behavioural questions.
    `
  });

  const conversationText = conversation.length
    ? conversation.map(
      msg => `${msg.role}: ${msg.content}`
    ).join('\n')
    : 'Start the mock interview by introducing yourself and asking the first question.';

  const result = await model.generateContent(conversationText);
  const response = result.response.text();

  if (!response) {
    throw new Error('Gemini returned an empty interview response.');
  }

  return response;
};

