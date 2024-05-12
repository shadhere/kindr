// GoogleButtonWithGroup.js
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/app/ui/Button";
import Link from "next/link";
import { useState } from "react";

export const GoogleButton = ({
  text = "Continue with Google",
}: {
  text?: string;
  inviteUrl?: string | null;
}) => {
  return (
    <div>
      <Link href={`http://localhost:5000/auth/google`}>
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
