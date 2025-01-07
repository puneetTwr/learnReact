import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log({ token });
  if (!token) {
    res.status(401).json({ message: "Access token is missing or invalid" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      console.error("Error verifying token:", err);
      console.warn({ jwt: JWT_SECRET });
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
    (req as any).user = user; // Attach the user info to the request object
    next();
  });
};
