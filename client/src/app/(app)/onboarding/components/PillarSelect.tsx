import { useState } from "react";
import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { OptionCard } from "@/app/ui/OptionCard";
import { Button } from "@/app/ui/Button";

interface PillarSelectProps {
  setSelectedPillar: (Pillar: "Animals" | "People" | "Environment") => void;
  setCurrentStep: (currentStep: number) => void;
  isFormbricksCloud: boolean;
}

type PillarOptionType = "Animals" | "People" | "Environment";

export default function PillarSelect({
  setSelectedPillar,
  setCurrentStep,
  isFormbricksCloud,
}: PillarSelectProps) {
  const [selectedPillar, setSelectedPillarLocal] =
    useState<PillarOptionType | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleSelect = (Pillar: PillarOptionType) => {
    setSelectedPillarLocal(Pillar);
    setSelectedPillar(Pillar);
  };

  const nextClickHandler = () => {
    if (selectedPillar) {
      setCurrentStep(3);
    }
  };

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
          title="Animal"
          description="Help animals in need."
          onSelect={() => {
            handleSelect("Animals");
          }}
        >
          {/* <Image src={ImpactMockup} alt="" height={350} /> */}
        </OptionCard>

        <OptionCard
          cssId="onboarding-investor-survey-card"
          size="lg"
          title="People"
          description="Help people in need."
          onSelect={() => {
            handleSelect("People");
          }}
        >
          {/* <Image src={InvestorMockup} alt="" height={350} /> */}
        </OptionCard>
        <OptionCard
          cssId="onboarding-individual-survey-card"
          size="lg"
          title="Environment"
          description="Help Environment in need."
          onSelect={() => {
            handleSelect("Environment");
          }}
        >
          {/* <Image src={IndividualMockup} alt="" height={350} /> */}
        </OptionCard>
      </div>

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
