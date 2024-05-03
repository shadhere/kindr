import { useState } from "react";
import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { OptionCard } from "@/app/ui/OptionCard";
import { Button } from "@/app/ui/Button";
import { cn } from "@/app/lib/cn";

interface PathwaySelectProps {
  setSelectedPathway: (
    pathway: "impact_organisation" | "investor" | "individual" | null
  ) => void;
  setCurrentStep: (currentStep: number) => void;
  isFormbricksCloud: boolean;
  selectedChoice: string;
  setSelectedChoice: (choice: string) => void;
}

type RoleChoice = {
  label: string;
  id: "NPO" | "NGO" | "For-profit" | "impact_investor" | "corporation";
  pathway: PathwayOptionType;
};

type PathwayOptionType = "impact_organisation" | "investor" | "individual";

export default function PathwaySelect({
  setSelectedPathway,
  setCurrentStep,
  selectedChoice,
  setSelectedChoice,
  isFormbricksCloud,
}: PathwaySelectProps) {
  const [selectedPathway, setSelectedPathwayLocal] =
    useState<PathwayOptionType | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  // const [selectedChoice, setSelectedChoice] = useState<string>("");

  const handleSelect = (pathway: PathwayOptionType) => {
    setSelectedPathwayLocal(pathway);
    setSelectedPathway(pathway);

    if (pathway === "impact_organisation" || pathway === "investor") {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const nextClickHandler = () => {
    if (selectedPathway === "impact_organisation") {
      setCurrentStep(2);
    } else if (selectedPathway === "individual") {
      setCurrentStep(2);
    } else if (selectedPathway === "investor") {
      setCurrentStep(7);
    }
  };

  const roles: Array<RoleChoice> = [
    { label: "NPO", id: "NPO", pathway: "impact_organisation" },
    { label: "NGO", id: "NGO", pathway: "impact_organisation" },
    {
      label: "For-profit impact entity",
      id: "For-profit",
      pathway: "impact_organisation",
    },
    { label: "Impact investor", id: "impact_investor", pathway: "investor" },
    { label: "Corporation", id: "corporation", pathway: "investor" },
  ];

  return (
    <div className="space-y-16 p-6 text-center">
      <OnboardingTitle
        title="How would you like to start?"
        subtitle="You can always use all types of surveys later on."
      />
      <div className="flex space-x-8">
        <OptionCard
          cssId="onboarding-impact-survey-card"
          size="lg"
          title="Impact Organisation"
          description="Start as an Impact Organisation."
          onSelect={() => {
            handleSelect("impact_organisation");
          }}
        >
          {/* <Image src={ImpactMockup} alt="" height={350} /> */}
        </OptionCard>
        <OptionCard
          cssId="onboarding-individual-survey-card"
          size="lg"
          title="Individual"
          description="Start as an Individual."
          onSelect={() => {
            handleSelect("individual");
          }}
        >
          {/* <Image src={IndividualMockup} alt="" height={350} /> */}
        </OptionCard>
        <OptionCard
          cssId="onboarding-investor-survey-card"
          size="lg"
          title="Investor"
          description="Start as an Investor."
          onSelect={() => {
            handleSelect("investor");
          }}
        >
          {/* <Image src={InvestorMockup} alt="" height={350} /> */}
        </OptionCard>
      </div>
      {showOptions && (
        <div className="relative rounded-md flex flex-row gap-4 justify-center">
          {roles
            .filter((choice) => choice.pathway === selectedPathway) // Filter roles based on selected pathway
            .map((choice) => (
              <label
                key={choice.id}
                htmlFor={choice.id}
                className={cn(
                  selectedChoice === choice.label
                    ? "z-10 border-slate-400 bg-slate-100"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                  "relative flex cursor-pointer flex-col rounded-md border p-4 focus:outline-none"
                )}
              >
                <span className="flex items-center">
                  <input
                    type="radio"
                    id={choice.id}
                    value={choice.label}
                    name="role"
                    checked={choice.label === selectedChoice}
                    className="checked:text-brand-dark focus:text-brand-dark h-4 w-4 border border-slate-300 focus:ring-0 focus:ring-offset-0"
                    aria-labelledby={`${choice.id}-label`}
                    onChange={(e) => {
                      setSelectedChoice(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // handleNextClick();
                      }
                    }}
                  />
                  <span
                    id={`${choice.id}-label`}
                    className="ml-3 text-sm text-slate-700"
                  >
                    {choice.label}
                  </span>
                </span>
              </label>
            ))}
        </div>
      )}
      <div className="flex justify-between">
        <Button className="text-slate-500">Skip</Button>
        <Button
          id="onboarding-inapp-role-next"
          variant="darkCTA"
          onClick={nextClickHandler}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
