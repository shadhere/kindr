import jwt from "jsonwebtoken";
import UserRefreshTokens from "../models/refreshToken";

interface IUser {
  _id: string;
}

interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

const generateTokens = async (user: IUser): Promise<ITokenPair> => {
  try {
    // create access token and refresh token
    const accessToken = jwt.sign(
      { id: user?._id },
      process.env.SECRET_KEY || "",
      {
        expiresIn: "10m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user?._id },
      process.env.SECRET_KEY || "",
      {
        expiresIn: "30d",
      }
    );

    // check if refresh token exists in UserRefreshTokens, if exists, remove it
    // check if refresh token exists in UserRefreshTokens, if exists, remove it
    const userToken = await UserRefreshTokens.findOne({ userID: user?._id });
    await UserRefreshTokens.deleteOne({ userID: user?._id });

    // create new refreshToken and save it
    const newRefreshToken = new UserRefreshTokens({
      userID: user?._id,
      token: refreshToken,
    });
    await newRefreshToken.save();

    // resolve both tokens
    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(`err in generate tokens : ${err}`);
  }
};

export default generateTokens;
