import { prisma } from "../db/db.js";
import {
  sendToS3Client,
  getFromS3Client,
  deleteFromS3Client,
  getURL
} from "../services/s3bucket.js";

const createPost = async (c: any) => {
  const body = await c.req.parseBody();
  const { title, type, description, location, eventDate, file } = body;

  const { userId } = c.get("jwtPayload");

  try {
    if (!file) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileKey = `uploads/${Date.now()}-${file.name}`;

    await sendToS3Client({ file, fileKey, buffer });
    const image = fileKey;

    const newPost = await prisma.postItems.create({
      data: {
        type,
        title,
        description,
        location,
        eventDate: new Date(eventDate),
        owner: userId,
        image,
      },
    });

    return c.json({ message: "Post created successfully", post: newPost }, 201);
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

const getPosts = async (c: any) => {
  const typeQuery = c.req.query("type") || "";
  const titleQuery = c.req.query("title") || "";
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;

  try {
    const posts = await prisma.postItems.findMany({
      where: {
        ...(typeQuery && {
          type: { equals: typeQuery },
        }),
        ...(titleQuery && {
          title: { contains: titleQuery, mode: "insensitive" },
        }),
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return c.json({ posts }, 200);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

const getPostById = async (c: any) => {
  const id = c.req.param("id");

  try {
    const post = await prisma.postItems.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    const owner = await prisma.users.findUnique({
      where: {
        id: post.owner,
      },
    });

    const imageURL = getURL(post.image);

    const response = {
      post,
      owner: {
        username: owner?.username,
        createdAt: owner?.createdAt,
        updatedAt: owner?.updatedAt,
      },
      imageURL: imageURL
    };

    return c.json({ ...response }, 200);
  } catch (error) {
    console.error("Error fetching post:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

const editPosts = async (c: any) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();

  try {
    const post = await prisma.postItems.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (post.owner !== c.get("jwtPayload").userId) {
      return c.json({ error: "Your are not the owner of this post" }, 403);
    }

    const updatedPost = await prisma.postItems.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...body,
        updatedAt: new Date()
      },
    });

    return c.json({ message: "Post updated successfully", post: updatedPost }, 200);
  } catch (error) {
    console.error("Error updating post:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

const deletePost = async (c: any) => {
  const id = c.req.param("id");

  try {
    const post = await prisma.postItems.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (post.owner !== c.get("jwtPayload").userId) {
      return c.json({ error: "Your are not the owner of this post" }, 403);
    }

    await prisma.postItems.delete({
      where: {
        id: parseInt(id),
      },
    });

    await deleteFromS3Client(post.image);

    return c.json({ message: "Post deleted successfully" }, 200);
  } catch (error) {
    console.error("Error deleting post:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

const getPostImage = async (c: any) => {
  const id = c.req.param("id");
  try {
    const post = await prisma.postItems.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    const response = await getFromS3Client(post.image);
    if (!response.Body) {
      return c.json({ error: "Image not found" }, 404);
    }

    return c.body(response.Body as ReadableStream, 200, {
      "Content-Type": response.ContentType || "image/jpeg",
    });
  } catch (error) {
    console.error("Error fetching post image:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export default {
  createPost,
  getPosts,
  getPostById,
  editPosts,
  deletePost,
  getPostImage,
};
