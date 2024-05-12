import SettingsCard from "./components/SettingsCard";
import SettingsTitle from "./components/SettingsTitle";
import { DeleteAccount } from "./components/DeleteAccount";
import { EditName } from "./components/EditName";
import ProtectedRoute from "../components/ProtectedRoute";

export default async function ProfileSettingsPage({}) {
  return (
    <>
      <ProtectedRoute>
        <div>
          {/* <SettingsTitle title="Profile" /> */}
          <SettingsCard
            title="Personal Information"
            description="Update your personal information."
          >
            <EditName />
          </SettingsCard>

          <SettingsCard
            title="Delete account"
            description="Delete your account with all of your personal information and data."
          >
            <DeleteAccount />
          </SettingsCard>
        </div>
      </ProtectedRoute>
    </>
  );
}
