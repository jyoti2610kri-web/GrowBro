import prisma from '../config/prisma.js';

export const createDiscussion = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const authorId = req.userId;

    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        category,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Error creating discussion", error: error.message });
  }
};

export const getDiscussions = async (req, res) => {
  try {
    const discussions = await prisma.discussion.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching discussions", error: error.message });
  }
};

export const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Error fetching discussion", error: error.message });
  }
};

export const likeDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const discussion = await prisma.discussion.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: "Error liking discussion", error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content, discussionId } = req.body;
    const authorId = req.userId;

    const comment = await prisma.comment.create({
      data: {
        content,
        discussionId,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};
