"use client";

import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/app/lib/cn";
import { env } from "@/app/lib/env";
import { Button } from "@/app/ui/Button";
import { Input } from "@/app/ui/Input";

type ObjectiveProps = {
  formbricksResponseId?: string;
  setCurrentStep: (currentStep: number) => void;
};

type ObjectiveChoice = {
  label: string;
  id: string;
};

export const Objective: React.FC<ObjectiveProps> = ({
  formbricksResponseId,
  setCurrentStep,
}) => {
  const objectives: Array<ObjectiveChoice> = [
    { label: "Increase conversion", id: "increase_conversion" },
    { label: "Improve user retention", id: "improve_user_retention" },
    { label: "Increase user adoption", id: "increase_user_adoption" },
    { label: "Sharpen marketing messaging", id: "sharpen_marketing_messaging" },
    { label: "Support sales", id: "support_sales" },
    { label: "Other", id: "other" },
  ];

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  const next = () => {
    setCurrentStep(4);
    localStorage.setItem("onboardingCurrentStep", "4");
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <OnboardingTitle
        title="What do you want to achieve?"
        subtitle="We suggest templates based on your selection."
      />
      <fieldset
        id="choices"
        aria-label="What do you want to achieve?"
        ref={fieldsetRef}
      >
        <legend className="sr-only">Choices</legend>
      </fieldset>

      <div className="flex justify-between">
        <Button
          className="text-slate-500"
          variant="minimal"
          onClick={next}
          id="objective-skip"
        >
          Skip
        </Button>
      </div>
    </div>
  );
};
