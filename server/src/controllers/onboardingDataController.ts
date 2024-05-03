import { Request, Response } from "express";
import OnboardingData, { IOnboardingData } from "../models/onboardingData";
import jwt from "jsonwebtoken";

export const createOnboardingData = async (req: Request, res: Response) => {
  try {
    const {
      investmentHorizon,
      riskTolerance,
      preferredSectors,
      desiredReturns,
      investmentExperience,
      impactMetrics,
      localGlobalInterest,
      contentTypes,
      supportedCauses,
      pillarIssues,
      subscribeNewsletter,
      selectedPathway,
      selectedPillar,
      selectedChoice,
      selectedArea,
      selectedImpact,
      userInterest,
      sustainableGoal,
    } = req.body;
    // Extract access token from the request cookies
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

    console.log("userId", userId);
    // Create a new OnboardingData document
    const onboardingData: IOnboardingData = new OnboardingData({
      investmentHorizon,
      riskTolerance,
      preferredSectors,
      desiredReturns,
      investmentExperience,
      impactMetrics,
      localGlobalInterest,
      contentTypes,
      supportedCauses,
      pillarIssues,
      subscribeNewsletter,
      selectedPathway,
      selectedPillar,
      selectedChoice,
      selectedArea,
      selectedImpact,
      userInterest,
      sustainableGoal,
      user: userId, // Assign the user's ID to the user field
    });

    // Save the form data to the database
    await onboardingData.save();

    res.status(201).json({ message: "Onboarding data saved successfully" });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
