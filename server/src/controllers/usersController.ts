import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Users, { IUser } from "../models/users"; // Assuming Users model is defined with appropriate typings

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    console.log("req.query :", req.query);

    const users = await Users.find(
      { ...req.query },
      { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    )
      .limit(Number(limit) || 0) // Ensure limit is a number or default to 0
      .skip(((Number(page) || 1) - 1) * (Number(limit) || 0)) // Ensure page and limit are numbers or default to 1 and 0 respectively
      .sort({ createdAt: -1 })
      .exec();

    const usersCount = await Users.countDocuments();

    if (!users) {
      return res.status(404).send("no users found!");
    }

    res.status(200).json({
      msg: "all users",
      count: usersCount,
      totalPages: Math.ceil(usersCount / Number(limit) || 1),
      users: users,
    });
  } catch (err) {
    res.status(500).json({ msg: "error in get users", error: err });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    // Extract token from cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    console.log("accessToken", accessToken);

    if (!accessToken || !refreshToken) {
      // Handle case where tokens are not present in cookies (user not authenticated)
      return res.status(401).json({ error: "Unauthorizsed" });
    }

    // Verify and decode access token
    const decodedAccessToken = jwt.verify(accessToken, "64sanf329lc436gs") as {
      id: string;
    };

    console.log("decodedAccessToken", decodedAccessToken);

    // Extract user ID from decoded access token
    const userId = decodedAccessToken.id;

    // Retrieve user information from the database
    const user: IUser | null = await Users.findById(userId, {
      _id: 0,
      name: 1,
      email: 1,
    }).exec();

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Send user information in the response
    res.status(200).json({ msg: "get user successfully!", user: user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).send("Failed to get user information");
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    // Extract access token from cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token not found" });
    }

    // Verify and decode access token
    const decodedAccessToken = jwt.verify(accessToken, "64sanf329lc436gs") as {
      id: string;
    };

    // Extract user ID from decoded access token
    const userId = decodedAccessToken.id;
    console.log("userId", userId);

    // Check if the user is trying to delete their own account

    // Delete user from the database
    const deletedUser = await Users.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    // Send success response
    res.status(200).json({ msg: "User has been deleted!", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Failed to delete user");
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    // Extract access token from cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token not found" });
    }

    // Verify and decode access token
    const decodedAccessToken = jwt.verify(accessToken, "64sanf329lc436gs") as {
      id: string;
    };

    // Extract user ID from decoded access token
    const userId = decodedAccessToken.id;

    // Update user information in the database
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      req.body, // Update user data with request body
      { new: true } // Return the updated user document
    ).exec();

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Send updated user information in the response
    res.status(200).json({
      msg: "User information updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).send("Failed to update user information");
  }
};
