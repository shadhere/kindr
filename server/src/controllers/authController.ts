import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Users from "../models/users";
import UserRefreshTokens from "../models/refreshToken";
import { validateRegister, validateLogin } from "../helpers/validation";

import generateTokens from "../helpers/generateTokens";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Google OAuth 2.0 configuration
// import bcrypt, jwt, etc...

// Google OAuth 2.0 configuration
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "919120283722-5md8n2ggmalil2oc0t8hem1eendog8i1.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
      passReqToCallback: true, // Allow passing request object to the callback
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      try {
        console.log("Request query parameters:", req.query);
        if (!profile.emails || profile.emails.length === 0) {
          return cb(new Error("Email not provided by Google."));
        }
        // Retrieve group information from the request query
        const group = req.query.group;
        // Check if user already exists in your database
        let user = await Users.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If user doesn't exist, create a new user with group information
          user = new Users({
            name: profile.displayName,
            email: profile.emails[0].value,
            group: group, // Include the group information
          });
          await user.save();
        }
        return cb(null, user);
      } catch (err: any) {
        return cb(err);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user for session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // check validator
  const { error } = validateRegister({ name, email, password });
  if (error) {
    return res.status(400).json({ message: "validation error!", error: error });
  }

  // check user exist
  const userExist = await Users.findOne({ email }).exec();
  if (userExist) return res.status(409).send("user already exists!");

  try {
    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = new Users({ name, email, password: hashedPassword });
    await savedUser.save();

    const { accessToken, refreshToken } = await generateTokens(savedUser);

    // Set tokens as cookies
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(201).json({
      message: "user created successfully!",
      accessToken,
      refreshToken,
      user: { name, email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "an error occurred in creating user", error: err });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("Received login request:", { email, password });
  // check validator
  const { error } = validateLogin({ email, password });
  if (error) {
    console.log("Validation error:", error);
    return res.status(400).send("validation error!");
  }
  // check user exist
  const userExist = await Users.findOne({ email }).exec();
  if (!userExist) return res.status(404).send("user not found!");

  // check password
  const validPassword = await bcrypt.compare(password, userExist.password);
  if (!validPassword)
    return res.status(400).send("username or password is not valid!");

  try {
    // create tokens
    const { accessToken, refreshToken } = await generateTokens(userExist);

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    const sendUser = { name: userExist.name, email: userExist.email };

    res.status(200).json({
      message: "login successfully!",
      user: sendUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(401).json({ message: "error login unauthorized!", error: err });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    const refreshToken = req.body.token;
    // check refresh token in db and delete the token
    const refreshTokenDoc = await UserRefreshTokens.findOne({
      token: refreshToken,
    });
    if (!refreshTokenDoc)
      return res.status(200).send("token not found - logged out successfully!");

    // remove the token
    await refreshTokenDoc.deleteOne(); // Use deleteOne to remove the document
    res.status(200).send("token found and deleted - logged out successfully!");
  } catch (err) {
    res.status(500).json({ message: "logged out failed!", error: err });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  // check exist user
  const user = await Users.findOne({ email });
  if (!user) return res.status(404).send("user not found!");

  try {
    // create token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY || "", {
      expiresIn: "10m",
    });

    const link = `http://localhost:${process.env.PROJECT_PORT}/users/forgot-password/${token}`;

    res.status(201).json({
      resetPasswordLink: link,
      msg: "reset password link is sent successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: "err in forgot password", error: err });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { pass, confirmPass } = req.body;

  const token = req.params.token;
  if (!token) return res.status(401).send("no token found!");

  // verify token and check it
  let verifiedToken: JwtPayload;
  try {
    verifiedToken = jwt.verify(
      token,
      process.env.SECRET_KEY || ""
    ) as JwtPayload;
  } catch (err) {
    return res.status(403).send("forbidden, doesn't have permission");
  }

  // Now TypeScript knows that verifiedToken is of type JwtPayload and 'id' property exists
  if (!verifiedToken || !verifiedToken.id) {
    return res.status(403).send("forbidden, doesn't have permission");
  }

  // check password with confirmPass
  if (pass !== confirmPass) {
    return res.status(422).send("two passwords are not the same!");
  }

  try {
    const user = await Users.findById(verifiedToken.id); // Accessing _id directly from the decoded token payload
    if (!user) return res.status(404).send("the user not found!");

    // hashed password
    const hashedPassword = await bcrypt.hash(pass, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).send("password has been changed");
  } catch (err) {
    res.status(400).json({ msg: "reset password failed", error: err });
  }
};

export const googleAuthController = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google Authentication Callback Controller
export const googleAuthCallbackController = passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/",
});

export default {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  googleAuthController,
  googleAuthCallbackController,
};
