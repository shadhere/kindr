"use client";

import { XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Changed from 'next/navigation'
import { useState } from "react";
import { Input } from "@/app/ui/Input";
import { Button } from "@/app/ui/Button";
import axios from "axios"; // Import Axios

export const PasswordResetForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(""); // Add state for email input

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        {
          email,
        }
      );
      if (response.status === 201) {
        // Password reset link sent successfully
        router.push("/auth/forgot-password/email-sent");
      } else {
        throw new Error("Failed to send reset password link");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      {error && (
        <div className="absolute top-10 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                An error occurred when resetting your password
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="space-y-1 whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-800"
          >
            Email address
          </label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant="darkCTA"
            className="w-full justify-center"
            loading={loading}
          >
            Reset password
          </Button>
          <div className="mt-3 text-center">
            <Button
              variant="minimal"
              href="/auth/login"
              className="w-full justify-center"
            >
              Back to login
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
