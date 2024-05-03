import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define a custom interface that extends the Request interface
interface AuthenticatedRequest extends Request {
  user?: { isAdmin: boolean }; // Define the user property
}

export const authenticate = async (
  req: AuthenticatedRequest, // Use the custom interface here
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Token not found in header. Unauthorized!");
  }
  const token = authHeader.split(" ")[1];

  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY || "") as {
      isAdmin: boolean;
    };
    if (!verifiedToken) {
      return res.status(403).send("Invalid token inside try");
    }
    req.user = verifiedToken; // Assign the verifiedToken to the user property
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token!", error: err });
  }
};

export const authAdmin = async (
  req: AuthenticatedRequest, // Use the custom interface here
  res: Response,
  next: NextFunction
) => {
  // Access the user property from the request object
  const user = req.user;
  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).send("Not admin");
  }
};
