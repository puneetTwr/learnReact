import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const getUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    console.warn({ decoded });
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
