"use client";

import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/app/lib/cn";
import { env } from "@/app/lib/env";
import { Button } from "@/app/ui/Button";
import { Input } from "@/app/ui/Input";

type SustainableGoalProps = {
  setFormbricksResponseId: (id: string) => void;
  session: Session;
  setCurrentStep: (currentStep: number) => void;
  setSustainableGoal: (sustainableGoal: string) => void;
  sustainableGoal: string | null;
  sendDataToBackend: any;
};

type SustainableGoalChoice = {
  label: string;
  id: string;
};

export const SustainableGoal: React.FC<SustainableGoalProps> = ({
  setCurrentStep,
  setSustainableGoal,
  sustainableGoal,
  sendDataToBackend,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const [otherValue, setOtherValue] = useState("");

  const SustainableGoals: Array<SustainableGoalChoice> = [
    { label: "No poverty (SDG 1)", id: "no_poverty_sdg1" },
    { label: "Zero hunger (SDG 2)", id: "zero_hunger_sdg2" },
    { label: "Good health and well-being (SDG 3)", id: "good_health_sdg3" },
    { label: "Quality education (SDG 4)", id: "quality_education_sdg4" },
    { label: "Gender equality (SDG 5)", id: "gender_equality_sdg5" },
    { label: "Clean water and sanitation (SDG 6)", id: "clean_water_sdg6" },
    { label: "Affordable and clean energy (SDG 7)", id: "clean_energy_sdg7" },
    {
      label: "Decent work and economic growth (SDG 8)",
      id: "decent_work_sdg8",
    },
    {
      label: "Industry, innovation, and infrastructure (SDG 9)",
      id: "innovation_sdg9",
    },
    {
      label: "Reduced inequalities (SDG 10)",
      id: "reduced_inequalities_sdg10",
    },
    {
      label: "Sustainable cities and communities (SDG 11)",
      id: "sustainable_cities_sdg11",
    },
    {
      label: "Responsible consumption and production (SDG 12)",
      id: "responsible_consumption_sdg12",
    },
    { label: "Climate action (SDG 13)", id: "climate_action_sdg13" },
    { label: "Life below water (SDG 14)", id: "life_below_water_sdg14" },
    { label: "Life on land (SDG 15)", id: "life_on_land_sdg15" },
    {
      label: "Peace, justice, and strong institutions (SDG 16)",
      id: "peace_justice_sdg16",
    },
    { label: "Partnerships for the goals (SDG 17)", id: "partnerships_sdg17" },
    { label: "Other (please specify)", id: "other" },
  ];

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <OnboardingTitle
        title="What is your SustainableGoal?"
        subtitle="Make your Formbricks experience more personalized."
      />
      <fieldset
        id="choices"
        aria-label="What is your SustainableGoal?"
        ref={fieldsetRef}
      >
        <legend className="sr-only">Choices</legend>
        <div className="relative space-y-2 rounded-md">
          {SustainableGoals.map((choice) => (
            <label
              key={choice.id}
              htmlFor={choice.id}
              className={cn(
                sustainableGoal === choice.label
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
                  name="SustainableGoal"
                  checked={choice.label === sustainableGoal}
                  className="checked:text-brand-dark focus:text-brand-dark h-4 w-4 border border-slate-300 focus:ring-0 focus:ring-offset-0"
                  aria-labelledby={`${choice.id}-label`}
                  onChange={(e) => {
                    setSustainableGoal(e.currentTarget.value);
                  }}
                />
                <span
                  id={`${choice.id}-label`}
                  className="ml-3 text-sm text-slate-700"
                >
                  {choice.label}
                </span>
              </span>
              {choice.id === "other" && sustainableGoal === "Other" && (
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
        <Button className="text-slate-500" variant="minimal" href={"/settings"}>
          Skip
        </Button>
        <Button
          variant="darkCTA"
          loading={isUpdating}
          disabled={!sustainableGoal}
          onClick={sendDataToBackend}
          id="onboarding-inapp-SustainableGoal-next"
        >
          Complete
        </Button>
      </div>
    </div>
  );
};
