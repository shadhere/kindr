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
import sgMail from "@sendgrid/mail"; // Import SendGrid
sgMail.setApiKey(
  "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"
);

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
            isVerified: true,
          });
          await user.save();
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateTokens(user);

        // Set tokens as cookies or send them in the response
        if (req.res) {
          req.res.cookie("accessToken", accessToken, { httpOnly: true });
          req.res.cookie("refreshToken", refreshToken, { httpOnly: true });
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
    const savedUser = new Users({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await savedUser.save();

    const verificationToken = jwt.sign({ email }, "64sanf329lc436gs", {
      expiresIn: "1d",
    });

    // Construct the verification link
    const verificationLink = `http://localhost:5000/auth/verify-email/${verificationToken}`;

    // Construct the email message
    const msg = {
      to: email, // Receiver address
      from: "arshadbhai42012@gmail.com", // Sender address (this should be a verified sender in your SendGrid account)
      subject: "Verify your email", // Subject line
      text: `Please click on the following link to verify your email: ${verificationLink}`, // Plain text body
      html: `<p>Please click on the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`, // HTML body
    };

    // Send the email
    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    // const { accessToken, refreshToken } = await generateTokens(savedUser);

    // // Set tokens as cookies
    // res.cookie("accessToken", accessToken, { httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(201).json({
      message: "user created successfully!",
      // accessToken,
      // refreshToken,
      user: { name, email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "an error occurred in creating user", error: err });
  }
};

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, "64sanf329lc436gs") as { email: string };
    const userEmail = decoded.email;

    console.log("token", token, "email", userEmail);

    // Find user by email
    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mark email as verified
    user.isVerified = true;
    await user.save();

    res.redirect(`http://localhost:3000/auth/login`);
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(400).json({ message: "Invalid or expired token" });
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

  if (!userExist.isVerified) {
    return res
      .status(401)
      .send("Email not verified. Please verify your email address.");
  }

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

    const link = `http://localhost:3000/auth/forgot-password/reset/${token}`;

    const msg = {
      to: email,
      from: "arshadbhai42012@Gmail.com", // Change this to your verified sender
      subject: "Reset Your Password",
      html: `<p>You are receiving this email because you requested to reset your password. Please click the following link to reset your password:</p><p><a href="${link}">${link}</a></p>`,
    };

    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(201).json({
      resetPasswordLink: link,
      msg: "reset password link is sent successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: "err in forgot password", error: err });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { pass, confirmPass, token } = req.body;

  // verify token and check it
  let verifiedToken: JwtPayload;
  try {
    verifiedToken = jwt.verify(token, "64sanf329lc436gs") as JwtPayload;
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

    console.log("user", user);
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
  successRedirect: "http://localhost:3000/onboarding",
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
