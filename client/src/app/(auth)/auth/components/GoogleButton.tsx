// GoogleButtonWithGroup.js
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/app/ui/Button";
import Link from "next/link";
import { useState } from "react";

export const GoogleButton = ({
  text = "Continue with Google",
  inviteUrl,
}: {
  text?: string;
  inviteUrl?: string | null;
}) => {
  const [group, setGroup] = useState("");

  const handleInputChange = (e: any) => {
    setGroup(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your group"
        value={group}
        onChange={handleInputChange}
      />
      <Link href={`http://localhost:5000/auth/google?group=${group}`}>
        {" "}
        {/* Include the group information as a query parameter */}
        <Button
          type="button"
          EndIcon={FaGoogle}
          startIconClassName="ml-3"
          variant="secondary"
          className="w-full justify-center"
        >
          {text}
        </Button>
      </Link>
    </div>
  );
};
