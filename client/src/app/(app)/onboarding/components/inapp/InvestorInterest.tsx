import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { Session } from "next-auth";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Button } from "@/app/ui/Button";
import { Input } from "@/app/ui/Input";
import { send } from "process";

type InvestorInterestProps = {
  setFormbricksResponseId: (id: string) => void;
  session: Session;
  setCurrentStep: (currentStep: number) => void;
  setInvestorInterest: (investorInterest: any) => void;
  investorInterest: any;
  sendDataToBackend: any;
};

const InvestorInterest: React.FC<InvestorInterestProps> = ({
  setFormbricksResponseId,
  session,
  setCurrentStep,
  setInvestorInterest,
  investorInterest,
  sendDataToBackend,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setInvestorInterest({
      ...investorInterest,
      [name]: newValue,
    });
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <OnboardingTitle
        title="Explore Your Interests"
        subtitle="Let's tailor your experience to match your preferences."
      />
      <form onSubmit={sendDataToBackend} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="investmentHorizon"
            className="text-slate-700 block mb-2"
          >
            Investment Horizon (Short-term, Long-term)
          </label>
          <Input
            type="text"
            id="investmentHorizon"
            name="investmentHorizon"
            className="bg-white"
            value={investorInterest.investmentHorizon}
            onChange={handleChange}
            placeholder="Enter your investment horizon"
          />
        </div>
        <div className="relative">
          <label htmlFor="riskTolerance" className="text-slate-700 block mb-2">
            Risk Tolerance (Low, Medium, High)
          </label>
          <Input
            type="text"
            id="riskTolerance"
            name="riskTolerance"
            className="bg-white"
            value={investorInterest.riskTolerance}
            onChange={handleChange}
            placeholder="Enter your risk tolerance"
          />
        </div>
        <div className="relative">
          <label
            htmlFor="preferredSectors"
            className="text-slate-700 block mb-2"
          >
            Preferred Sectors or Industries for Impact Investing
          </label>
          <Input
            type="text"
            id="preferredSectors"
            name="preferredSectors"
            className="bg-white"
            value={investorInterest.preferredSectors}
            onChange={handleChange}
            placeholder="Enter your preferred sectors"
          />
        </div>
        <div className="relative">
          <label htmlFor="desiredReturns" className="text-slate-700 block mb-2">
            Desired Financial Returns or Impact Outcomes
          </label>
          <Input
            type="text"
            id="desiredReturns"
            name="desiredReturns"
            className="bg-white"
            value={investorInterest.desiredReturns}
            onChange={handleChange}
            placeholder="Enter your desired returns"
          />
        </div>
        <div className="relative">
          <label
            htmlFor="investmentExperience"
            className="text-slate-700 block mb-2"
          >
            Previous Investment Experience and Success Metrics
          </label>
          <Input
            type="text"
            id="investmentExperience"
            name="investmentExperience"
            className="bg-white"
            value={investorInterest.investmentExperience}
            onChange={handleChange}
            placeholder="Enter your investment experience"
          />
        </div>
        <div className="relative">
          <label htmlFor="impactMetrics" className="text-slate-700 block mb-2">
            Specific Impact Metrics or Sustainable Development Goals (SDGs)
            Prioritized
          </label>
          <Input
            type="text"
            id="impactMetrics"
            name="impactMetrics"
            className="bg-white"
            value={investorInterest.impactMetrics}
            onChange={handleChange}
            placeholder="Enter your impact metrics"
          />
        </div>

        <div className="flex justify-between">
          <Button
            className="text-slate-500"
            variant="minimal"
            href={"/settings"}
            id="skipInvestorInterest"
          >
            Skip
          </Button>
          <Button
            variant="darkCTA"
            loading={isUpdating}
            type="submit"
            id="InvestorInterestNext"
          >
            Complete
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvestorInterest;
