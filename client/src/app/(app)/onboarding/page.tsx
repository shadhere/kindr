import { Onboarding } from "@/app/(app)/onboarding/components/onboarding";
import { redirect } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default async function OnboardingPage() {
  // Redirect to login if not authenticated

  // Redirect to home if onboarding is completed

  return (
    <ProtectedRoute>
      <Onboarding
      // isFormbricksCloud={IS_FORMBRICKS_CLOUD}
      // session={session}
      // environment={environment}
      // user={user}
      // team={team}
      />
    </ProtectedRoute>
  );
}
