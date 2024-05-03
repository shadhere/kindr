"use client";

import { InviteTeamMate } from "@/app/(app)/onboarding/components/inapp/InviteTeamMate";
import { Objective } from "@/app/(app)/onboarding/components/inapp/SurveyObjective";
import { Role } from "@/app/(app)/onboarding/components/inapp/SurveyRole";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

import PathwaySelect from "./PathwaySelect";
import PillarSelect from "./PillarSelect";
import { OnboardingHeader } from "./ProgressBar";
import { ImpactMeasure } from "./inapp/ImpactMeasure";
import { SustainableGoal } from "./inapp/SustainableGoal";
import UserInterest from "./inapp/UserIntererst";
import InvestorInterest from "./inapp/InvestorInterest";

interface InterestFormData {
  investmentHorizon: string;
  riskTolerance: string;
  preferredSectors: string;
  desiredReturns: string;
  investmentExperience: string;
  impactMetrics: string;
  localGlobalInterest: string;
  contentTypes: string;
  supportedCauses: string;
  pillarIssues: string;
  subscribeNewsletter: boolean;
}

interface OnboardingProps {
  isFormbricksCloud: boolean;
  session: Session;
  webAppUrl: string;
}

export function Onboarding({ isFormbricksCloud, session }: OnboardingProps) {
  const router = useRouter();
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  const [userInterest, setUserInterest] = useState<string | null>(null);
  const [sustainableGoal, setSustainableGoal] = useState<string | null>(null);
  const [interestFormData, setInterestFormData] = useState<InterestFormData>({
    investmentHorizon: "",
    riskTolerance: "",
    preferredSectors: "",
    desiredReturns: "",
    investmentExperience: "",
    impactMetrics: "",
    localGlobalInterest: "",
    contentTypes: "",
    supportedCauses: "",
    pillarIssues: "",
    subscribeNewsletter: false,
  });

  const [progress, setProgress] = useState<number>(16);
  const [formbricksResponseId, setFormbricksResponseId] = useState<
    string | undefined
  >();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const [fade, setFade] = useState(false);

  const handleSurveyCompletion = () => {
    setFade(false);

    setTimeout(() => {
      setIframeVisible(false); // Hide the iframe after fade-out effect is complete
      setCurrentStep(5); // Assuming you want to move to the next step after survey completion
    }, 1000); // Adjust timeout duration based on your fade-out CSS transition
  };

  const handleMessageEvent = (event: MessageEvent) => {
    if (event.data === "formbricksSurveyCompleted") {
      handleSurveyCompletion();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Access localStorage only when window is available
      const pathwayValueFromLocalStorage =
        localStorage.getItem("onboardingPathway");
      const currentStepValueFromLocalStorage = parseInt(
        localStorage.getItem("onboardingCurrentStep") ?? "1"
      );

      setSelectedPathway(pathwayValueFromLocalStorage);
      setCurrentStep(currentStepValueFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (currentStep) {
      const stepProgressMap = {
        1: 16,
        2: 40,
        3: 65,
        4: 75,
        5: 85,
        6: 93,
        7: 82,
      };
      const newProgress =
        stepProgressMap[currentStep as keyof typeof stepProgressMap] || 16;
      setProgress(newProgress);
      localStorage.setItem("onboardingCurrentStep", currentStep.toString());
    }
  }, [currentStep]);

  const sendDataToBackend = async (): Promise<void> => {
    try {
      const formDataToSend = {
        investmentHorizon: interestFormData.investmentHorizon,
        riskTolerance: interestFormData.riskTolerance,
        preferredSectors: interestFormData.preferredSectors,
        desiredReturns: interestFormData.desiredReturns,
        investmentExperience: interestFormData.investmentExperience,
        impactMetrics: interestFormData.impactMetrics,
        localGlobalInterest: interestFormData.localGlobalInterest,
        contentTypes: interestFormData.contentTypes,
        supportedCauses: interestFormData.supportedCauses,
        pillarIssues: interestFormData.pillarIssues,
        subscribeNewsletter: interestFormData.subscribeNewsletter,
        selectedPathway,
        selectedPillar,
        selectedChoice,
        selectedArea,
        selectedImpact,
        userInterest,
        sustainableGoal,
      };

      const response = await axios.post(
        "http://localhost:5000/api/onboarding",
        formDataToSend,
        {
          withCredentials: true, // Include cookies with the request
        }
      );
      console.log("Form data sent successfully:", response.data);
      // Handle success response (e.g., show success message to the user)
    } catch (error) {
      console.error("Error sending form data:", error);
      // Handle errors (e.g., show error message to the user)
    }
  };

  // Function to render current onboarding step
  const renderOnboardingStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PathwaySelect
            setSelectedPathway={setSelectedPathway}
            setCurrentStep={setCurrentStep}
            isFormbricksCloud={isFormbricksCloud}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
          />
        );
      case 3:
        return (
          selectedPathway !== "link" && (
            <Role
              setFormbricksResponseId={setFormbricksResponseId}
              session={session}
              setCurrentStep={setCurrentStep}
              selectedPillars={selectedPillar}
              setSelectedArea={setSelectedArea}
              selectedArea={selectedArea}
              selectedPathway={selectedPathway}
            />
          )
        );

      case 2:
        return (
          <PillarSelect
            setSelectedPillar={setSelectedPillar}
            setCurrentStep={setCurrentStep}
            isFormbricksCloud={isFormbricksCloud}
          />
        );
      case 5:
        return (
          <ImpactMeasure
            setFormbricksResponseId={setFormbricksResponseId}
            session={session}
            setCurrentStep={setCurrentStep}
            selectedImpact={selectedImpact}
            setSelectedImpact={setSelectedImpact}
          />
        );
      case 6:
        return (
          <SustainableGoal
            setFormbricksResponseId={setFormbricksResponseId}
            session={session}
            setCurrentStep={setCurrentStep}
            sustainableGoal={sustainableGoal}
            setSustainableGoal={setSustainableGoal}
            sendDataToBackend={sendDataToBackend}
          />
        );
      case 4:
        return (
          <UserInterest
            setFormbricksResponseId={setFormbricksResponseId}
            session={session}
            setCurrentStep={setCurrentStep}
            userInterest={interestFormData}
            setUserInterest={setInterestFormData}
            sendDataToBackend={sendDataToBackend}
          />
        );
      case 7:
        return (
          <InvestorInterest
            setFormbricksResponseId={setFormbricksResponseId}
            session={session}
            setCurrentStep={setCurrentStep}
            investorInterest={interestFormData}
            setInvestorInterest={setInterestFormData}
            sendDataToBackend={sendDataToBackend}
          />
        );
      case 9:
        return selectedPathway === "link" ? <p></p> : <p></p>;
      default:
        return null;
    }
  };

  return (
    <div className="group flex h-full w-full flex-col items-center bg-slate-50">
      <div className="hidden">
        <button
          id="FB__INTERNAL__SKIP_ONBOARDING"
          onClick={async () => {
            if (typeof localStorage !== undefined) {
              localStorage.removeItem("onboardingPathway");
              localStorage.removeItem("onboardingCurrentStep");
            }
          }}
        >
          Skip onboarding
        </button>
      </div>

      <OnboardingHeader progress={progress} />
      <div className="mt-20 flex w-full justify-center bg-slate-50">
        {renderOnboardingStep()}
        {iframeVisible && isFormbricksCloud && (
          <iframe
            onLoad={() => setIframeLoaded(true)}
            style={{
              inset: "0",
              position: "absolute",
              width: "100%",
              height: "100%",
              border: "0",
              zIndex: "40",
              transition: "opacity 1s ease",
              opacity: fade ? "1" : "0", // 1 for fade in, 0 for fade out
            }}
          ></iframe>
        )}
      </div>
    </div>
  );
}
