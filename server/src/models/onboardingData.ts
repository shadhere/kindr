import mongoose, { Document, Schema, Types } from "mongoose";
import User, { IUser } from "./users"; // Assuming the user model is named User and the interface is IUser

export interface IOnboardingData extends Document {
  investmentHorizon: string | null;
  riskTolerance: string | null;
  preferredSectors: string | null;
  desiredReturns: string | null;
  investmentExperience: string;
  impactMetrics: string | null;
  localGlobalInterest: string | null;
  contentTypes: string | null;
  supportedCauses: string | null;
  pillarIssues: string | null;
  subscribeNewsletter: boolean | null;
  selectedPathway: string | null;
  selectedPillar: string | null;
  selectedChoice: string;
  selectedArea: string | null;
  selectedImpact: string | null;
  userInterest: string | null;
  sustainableGoal: string | null;
  user: Types.ObjectId | IUser; // Reference to the user model
}

const onboardingDataSchema: Schema = new Schema({
  investmentHorizon: { type: String },
  riskTolerance: { type: String },
  preferredSectors: { type: String },
  desiredReturns: { type: String },
  investmentExperience: { type: String },
  impactMetrics: { type: String },
  localGlobalInterest: { type: String },
  contentTypes: { type: String },
  supportedCauses: { type: String },
  pillarIssues: { type: String },
  subscribeNewsletter: { type: Boolean },
  selectedPathway: { type: String },
  selectedPillar: { type: String },
  selectedChoice: { type: String },
  selectedArea: { type: String },
  selectedImpact: { type: String },
  userInterest: { type: String },
  sustainableGoal: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the user model
});

const OnboardingData = mongoose.model<IOnboardingData>(
  "OnboardingData",
  onboardingDataSchema
);

export default OnboardingData;
