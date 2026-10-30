import pkg from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkg;

const adapter = new PrismaBetterSqlite3({ url: 'dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@growbro.com' },
    update: {},
    create: {
      email: 'demo@growbro.com',
      name: 'Alex Johnson',
      password: hashedPassword,
      bio: 'Fullstack Developer & Lifelong Learner on GrowBro 🚀',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    },
  });

  console.log(`Created/found demo user: ${user.email}`);

  // Create Missions
  const missionsData = [
    {
      title: "Daily Coding Streak",
      description: "Solve at least 1 coding challenge or work on a side project today.",
      points: 25
    },
    {
      title: "Community Mentor",
      description: "Reply to an open question in the GrowBro discussion forum.",
      points: 20
    },
    {
      title: "AI Pair Programming",
      description: "Use the GrowBro AI Assistant to debug or refactor a block of code.",
      points: 15
    },
    {
      title: "Portfolio Progress Update",
      description: "Log your progress update on a major milestone today.",
      points: 30
    }
  ];

  for (const m of missionsData) {
    const existing = await prisma.mission.findFirst({ where: { title: m.title } });
    if (!existing) {
      await prisma.mission.create({ data: m });
    }
  }

  // Create Discussions
  const discussionsData = [
    {
      title: "Best practices for React 19 and modern UI components",
      content: "React 19 brings new hooks and server component features. How are you leveraging compiler features and state management in modern frontend architecture?",
      category: "Tech",
      authorId: user.id,
      likes: 12
    },
    {
      title: "How to stay consistent with daily developer goals?",
      content: "Building momentum is key to career growth. Let's share tips on time blocking, goal tracking, and avoiding burnout while learning new tech stacks.",
      category: "Career",
      authorId: user.id,
      likes: 8
    },
    {
      title: "Welcome to GrowBro - Your Growth Hub!",
      content: "Feel free to introduce yourself, post questions, track your daily missions, and chat with AI assistant or peers in real-time!",
      category: "General",
      authorId: user.id,
      likes: 25
    }
  ];

  for (const d of discussionsData) {
    const existing = await prisma.discussion.findFirst({ where: { title: d.title } });
    if (!existing) {
      await prisma.discussion.create({ data: d });
    }
  }

  console.log('Database seeding complete! 🌱');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
