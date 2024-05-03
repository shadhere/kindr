import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { Session } from "next-auth";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Button } from "@/app/ui/Button";
import { Input } from "@/app/ui/Input";

type UserInterestProps = {
  setFormbricksResponseId: (id: string) => void;
  session: Session;
  setCurrentStep: (currentStep: number) => void;
  setUserInterest: (userInterest: any) => void;
  userInterest: any;
};

const UserInterest: React.FC<UserInterestProps> = ({
  setFormbricksResponseId,
  session,
  setCurrentStep,
  setUserInterest,
  userInterest,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  const next = () => {
    setCurrentStep(3);
    localStorage.setItem("onboardingCurrentStep", "3");
  };

  const handleNextClick = async () => {
    try {
      setIsUpdating(true);
      // Perform update logic here
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
      next();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNextClick();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setUserInterest({
      ...userInterest,
      [name]: newValue,
    });
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <OnboardingTitle
        title="Explore Your Interests"
        subtitle="Let's tailor your experience to match your preferences."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="localGlobalInterest"
            className="text-slate-700 block mb-2"
          >
            Are you more interested in exploring local initiatives or global
            causes?
          </label>
          <Input
            type="text"
            id="localGlobalInterest"
            name="localGlobalInterest"
            className="bg-white"
            value={userInterest.localGlobalInterest}
            onChange={handleChange}
            placeholder="Enter your interest"
          />
        </div>
        <div className="relative">
          <label htmlFor="contentTypes" className="text-slate-700 block mb-2">
            What types of content do you enjoy engaging with the most? (Videos,
            Articles, Infographics, etc.)
          </label>
          <Input
            type="text"
            id="contentTypes"
            name="contentTypes"
            className="bg-white"
            value={userInterest.contentTypes}
            onChange={handleChange}
            placeholder="Enter your preferences"
          />
        </div>
        <div className="relative">
          <label
            htmlFor="supportedCauses"
            className="text-slate-700 block mb-2"
          >
            Have you supported any specific causes or organizations in the past?
            If yes, which ones and why?
          </label>
          <Input
            type="text"
            id="supportedCauses"
            name="supportedCauses"
            className="bg-white"
            value={userInterest.supportedCauses}
            onChange={handleChange}
            placeholder="Enter your supported causes"
          />
        </div>
        <div className="relative">
          <label htmlFor="pillarIssues" className="text-slate-700 block mb-2">
            Are there any specific issues or challenges within your chosen
            pillar(s) that resonate with you the most?
          </label>
          <Input
            type="text"
            id="pillarIssues"
            name="pillarIssues"
            className="bg-white"
            value={userInterest.pillarIssues}
            onChange={handleChange}
            placeholder="Enter your resonating issues"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="subscribeNewsletter"
            name="subscribeNewsletter"
            checked={userInterest.subscribeNewsletter}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label
            htmlFor="subscribeNewsletter"
            className="text-sm text-slate-700"
          >
            Would you like to receive updates and notifications about new
            initiatives, success stories, and impact reports related to your
            interests? (if yes then subscribe to newsletter)
          </label>
        </div>
        <div className="flex justify-between">
          <Button
            className="text-slate-500"
            variant="minimal"
            onClick={next}
            id="skipUserInterest"
          >
            Skip
          </Button>
          <Button
            variant="darkCTA"
            loading={isUpdating}
            disabled={
              !userInterest.localGlobalInterest ||
              !userInterest.contentTypes ||
              !userInterest.supportedCauses ||
              !userInterest.pillarIssues
            }
            type="submit"
            id="userInterestNext"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserInterest;
