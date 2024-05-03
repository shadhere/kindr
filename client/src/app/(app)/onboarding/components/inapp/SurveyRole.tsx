"use client";

import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/app/lib/cn";
import { env } from "@/app/lib/env";
import { Button } from "@/app/ui/Button";
import { Input } from "@/app/ui/Input";

type RoleProps = {
  setFormbricksResponseId: (id: string) => void;
  session: Session;
  setCurrentStep: (currentStep: number) => void;
  selectedPillars: string | null;
  setSelectedArea: (selectedArea: string) => void;
  selectedArea: string | null;
  selectedPathway: string | null;
};

type RoleChoice = {
  label: string;
  id:
    | "wildlife_conservation"
    | "animal_welfare"
    | "pet_adoption"
    | "habitat_preservation"
    | "veterinary_care"
    | "education"
    | "healthcare"
    | "poverty_alleviation"
    | "gender_equality"
    | "community_development"
    | "climate_change_mitigation"
    | "renewable_energy"
    | "waste_management"
    | "biodiversity_conservation"
    | "sustainable_agriculture"
    | "other";
  selectedPillar?: string;
};

export const Role: React.FC<RoleProps> = ({
  setFormbricksResponseId,
  session,
  setCurrentStep,
  selectedPillars,
  setSelectedArea,
  selectedArea,
  selectedPathway,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const [otherValue, setOtherValue] = useState("");

  console.log("SelectedPillars", selectedPillars);

  const roles: Array<RoleChoice> = [
    {
      label: "Wildlife Conservation",
      id: "wildlife_conservation",
      selectedPillar: "Animals",
    },
    {
      label: "Animal Welfare / Rights",
      id: "animal_welfare",
      selectedPillar: "Animals",
    },
    { label: "Pet Adoption", id: "pet_adoption", selectedPillar: "Animals" },
    {
      label: "Habitat Preservation",
      id: "habitat_preservation",
      selectedPillar: "Animals",
    },
    {
      label: "Veterinary Care",
      id: "veterinary_care",
      selectedPillar: "Animals",
    },
    { label: "Education", id: "education", selectedPillar: "People" },
    { label: "Healthcare", id: "healthcare", selectedPillar: "People" },
    {
      label: "Poverty Alleviation",
      id: "poverty_alleviation",
      selectedPillar: "People",
    },
    {
      label: "Gender Equality",
      id: "gender_equality",
      selectedPillar: "People",
    },
    {
      label: "Community Development",
      id: "community_development",
      selectedPillar: "People",
    },
    {
      label: "Climate Change Mitigation",
      id: "climate_change_mitigation",
      selectedPillar: "Environment",
    },
    {
      label: "Renewable Energy",
      id: "renewable_energy",
      selectedPillar: "Environment",
    },
    {
      label: "Waste Management",
      id: "waste_management",
      selectedPillar: "Environment",
    },
    {
      label: "Biodiversity Conservation",
      id: "biodiversity_conservation",
      selectedPillar: "Environment",
    },
    {
      label: "Sustainable Agriculture",
      id: "sustainable_agriculture",
      selectedPillar: "Environment",
    },
    { label: "Other", id: "other" },
  ];

  const next = () => {
    setCurrentStep(5);
    localStorage.setItem("onboardingCurrentStep", "5");
  };

  const handleNextClick = async () => {
    console.log("selectedArea", selectedArea);
    if (selectedPathway === "individual") {
      setCurrentStep(4);
    } else if (selectedPathway === "impact_organisation") {
      setCurrentStep(5);
    }

    // if (selectedArea === "Other" && otherValue.trim() === "") {
    //   return;
    // }
    // if (selectedArea) {
    //   const selectedRole = roles.find((role) => role.label === selectedArea);
    //   if (selectedRole) {
    //     try {
    //       setIsUpdating(true);

    //       setIsUpdating(false);
    //     } catch (e) {
    //       setIsUpdating(false);
    //       console.error(e);
    //     }
    //     if (env.NEXT_PUBLIC_FORMBRICKS_ONBOARDING_SURVEY_ID) next();
    //   }
    // }
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <OnboardingTitle
        title="What is your role?"
        subtitle="Make your Formbricks experience more personalised."
      />
      <fieldset id="choices" aria-label="What is your role?" ref={fieldsetRef}>
        <legend className="sr-only">Choices</legend>
        <div className="relative space-y-2 rounded-md">
          {roles
            .filter((choice) => choice.selectedPillar === selectedPillars)
            .map((choice) => (
              <label
                key={choice.id}
                htmlFor={choice.id}
                className={cn(
                  selectedArea === choice.label
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
                    name="role"
                    checked={choice.label === selectedArea}
                    className="checked:text-brand-dark focus:text-brand-dark h-4 w-4 border border-slate-300 focus:ring-0 focus:ring-offset-0"
                    aria-labelledby={`${choice.id}-label`}
                    onChange={(e) => {
                      setSelectedArea(e.currentTarget.value);
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
                {choice.id === "other" && selectedArea === "Other" && (
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
          id="role-skip"
        >
          Skip
        </Button>
        <Button
          variant="darkCTA"
          loading={isUpdating}
          disabled={!selectedArea}
          onClick={handleNextClick}
          id="onboarding-inapp-role-next"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
