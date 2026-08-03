import { prisma } from "../db/db.js";
import argon2 from "argon2";
import { generateToken } from "../services/jwt.js";

const register = async (c: any) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    const encryptedPassword = await argon2.hash(password);

    const newUser = await prisma.users.create({
      data: { username, password: encryptedPassword },
    });

    const resUser = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    const token = await generateToken({ userId: newUser.id });
    return c.json(
      { message: "User created successfully", user: resUser, token },
      201,
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

const login = async (c: any) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }
  
  try {
	const user = await prisma.users.findUnique({
		where: { username: username },
	})

	if (!user) {
		return c.json({ error: "Invalid username or password" }, 401);
	}

	const isPasswordValid = await argon2.verify(user.password, password);
	if (!isPasswordValid) {
		return c.json({ error: "Invalid username or password" }, 401);
	}

	const resUser = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

	const token = await generateToken({ userId: user.id });
	return c.json({ message: "Login successful", user: resUser, token });

  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export default {
  register,
  login,
};