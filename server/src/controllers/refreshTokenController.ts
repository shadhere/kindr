import jwt from "jsonwebtoken";
import UserRefreshTokens from "../models/refreshToken";
import { Request, Response } from "express";

export const refreshTokenController = async (req: Request, res: Response) => {
  const receivedRefreshToken = req.body.refreshToken;
  if (!receivedRefreshToken) {
    return res.status(401).json({ error: "Authorization failed" });
  }

  // 1 - find refresh-token in refreshToken model
  const foundedRefreshToken = await UserRefreshTokens.findOne({
    token: receivedRefreshToken,
  }).exec();
  if (!foundedRefreshToken) {
    return res
      .status(404)
      .json({ error: "refreshToken not found in tokenDB!" });
  }

  // 2 - verify token
  const verifiedRefreshToken = jwt.verify(
    receivedRefreshToken,
    process.env.SECRET_KEY || ""
  ) as { id: string };

  try {
    // 3 - create new access token
    const newAccessToken = jwt.sign(
      { id: verifiedRefreshToken.id },
      process.env.SECRET_KEY || "",
      { expiresIn: "10m" }
    );

    res.status(201).json({
      message: "created new access token",
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(403).json({ message: "Refresh token expired", error: err });
  }
};
