"use client";

import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/app/lib/cn";
import { env } from "@/app/lib/env";
import { Button } from "@/app/ui/Button";
import { Input } from "@/app/ui/Input";

type ImpactMeasureProps = {
  setFormbricksResponseId: (id: string) => void;
  session: Session;
  setCurrentStep: (currentStep: number) => void;
  setSelectedImpact: (selectedImpact: string) => void;
  selectedImpact: string | null;
};

type ImpactMeasureChoice = {
  label: string;
  id: string;
};

export const ImpactMeasure: React.FC<ImpactMeasureProps> = ({
  setFormbricksResponseId,
  session,
  setCurrentStep,
  setSelectedImpact,
  selectedImpact,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const [otherValue, setOtherValue] = useState("");

  const ImpactMeasures: Array<ImpactMeasureChoice> = [
    { label: "Number of beneficiaries served", id: "beneficiaries_served" },
    {
      label: "Reduction in carbon emissions",
      id: "carbon_emissions_reduction",
    },
    { label: "Increase in biodiversity", id: "biodiversity_increase" },
    {
      label: "Improvement in health outcomes",
      id: "health_outcomes_improvement",
    },
    {
      label: "Economic empowerment indicators",
      id: "economic_empowerment_indicators",
    },
    { label: "Other (please specify)", id: "other" },
  ];

  const next = () => {
    setCurrentStep(6);
    localStorage.setItem("onboardingCurrentStep", "3");
  };

  const handleNextClick = async () => {
    setCurrentStep(6);

    if (selectedImpact === "Other" && otherValue.trim() === "") {
      return;
    }
    if (selectedImpact) {
      try {
        setIsUpdating(true);
        setIsUpdating(false);
      } catch (e) {
        setIsUpdating(false);
        console.error(e);
      }
      if (env.NEXT_PUBLIC_FORMBRICKS_ONBOARDING_SURVEY_ID) next();
    }
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <OnboardingTitle
        title="What is your ImpactMeasure?"
        subtitle="Make your Formbricks experience more personalized."
      />
      <fieldset
        id="choices"
        aria-label="What is your ImpactMeasure?"
        ref={fieldsetRef}
      >
        <legend className="sr-only">Choices</legend>
        <div className="relative space-y-2 rounded-md">
          {ImpactMeasures.map((choice) => (
            <label
              key={choice.id}
              htmlFor={choice.id}
              className={cn(
                selectedImpact === choice.label
                  ? "z-10 border-slate-400 bg-slate-100"
                  : "border-slate-200  bg-white hover:bg-slate-50",
                "relative flex cursor-pointer flex-col rounded-md border  p-4 focus:outline-none"
              )}
            >
              <span className="flex items-center">
                <input
                  type="radio"
                  id={choice.id}
                  value={choice.label}
                  name="ImpactMeasure"
                  checked={choice.label === selectedImpact}
                  className="checked:text-brand-dark focus:text-brand-dark h-4 w-4 border border-slate-300 focus:ring-0 focus:ring-offset-0"
                  aria-labelledby={`${choice.id}-label`}
                  onChange={(e) => {
                    setSelectedImpact(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNextClick();
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
              {choice.id === "other" && selectedImpact === "Other" && (
                <div className="mt-4 w-full">
                  <Input
                    className="bg-white"
                    autoFocus
                    placeholder="Please specify"
                    value={otherValue}
                    onChange={(e) => setOtherValue(e.target.value)}
                  />
                </div>
              )}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex justify-between">
        <Button
          className="text-slate-500"
          variant="minimal"
          onClick={next}
          id="ImpactMeasure-skip"
        >
          Skip
        </Button>
        <Button
          variant="darkCTA"
          loading={isUpdating}
          disabled={!selectedImpact}
          onClick={handleNextClick}
          id="onboarding-inapp-ImpactMeasure-next"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
