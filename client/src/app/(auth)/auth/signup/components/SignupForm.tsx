"use client";

import { GithubButton } from "@/app/(auth)/auth/components/GithubButton";
import { GoogleButton } from "@/app/(auth)/auth/components/GoogleButton";
import IsPasswordValid from "../../components/isPasswordValid";
import { XCircleIcon } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/app/ui/Button";
import { PasswordInput } from "@/app/ui/PasswordInput";
import { Input } from "@/app/ui/Input";

interface SignupFormProps {
  webAppUrl: string;
  privacyUrl: string | undefined;
  termsUrl: string | undefined;
  passwordResetEnabled: boolean;
  emailVerificationDisabled: boolean;
  emailAuthEnabled: boolean;
  googleOAuthEnabled: boolean;
  githubOAuthEnabled: boolean;
}

export const SignupForm = ({
  webAppUrl,
  privacyUrl,
  termsUrl,
  passwordResetEnabled,
  emailVerificationDisabled,
  emailAuthEnabled,
  googleOAuthEnabled,
  githubOAuthEnabled,
}: SignupFormProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [signingUp, setSigningUp] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [isButtonEnabled, setButtonEnabled] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (!isValid) {
        return;
      }
      setSigningUp(true);
      console.log("Signup form submitted:", { name, email, password });
      const response = await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
      });

      console.log("Signup successful:", response.data);

      // Set authentication cookies if registration is successful

      // Redirect to dashboard or any other route after successful registration
      router.push("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setSigningUp(false);
    }
  };

  const checkFormValidity = () => {
    // If all fields are filled, enable the button
    if (formRef.current) {
      setButtonEnabled(formRef.current.checkValidity());
    }
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
                An error occurred when signing you up
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="space-y-1 whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="text-center">
        <h1 className="mb-4 text-slate-700">Create your Kindr account</h1>
        <div className="space-y-2">
          {emailAuthEnabled && (
            <form
              onSubmit={handleSubmit}
              ref={formRef}
              className="space-y-2"
              onChange={checkFormValidity}
            >
              {showLogin && (
                <div>
                  <div className="mb-2 transition-all duration-500 ease-in-out">
                    <label htmlFor="name" className="sr-only">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <Input
                        ref={nameRef}
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Full Name"
                        aria-placeholder="Full Name"
                        required
                        className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mb-2 transition-all duration-500 ease-in-out">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="work@email.com"
                      defaultValue={searchParams?.get("email") || ""}
                      className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                    />
                  </div>
                  <div className="transition-all duration-500 ease-in-out">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <PasswordInput
                      id="password"
                      name="password"
                      value={password ? password : ""}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="*******"
                      aria-placeholder="password"
                      onFocus={() => setIsPasswordFocused(true)}
                      required
                      className="focus:border-brand focus:ring-brand block w-full rounded-md shadow-sm sm:text-sm"
                    />
                  </div>
                  {passwordResetEnabled && isPasswordFocused && (
                    <div className="ml-1 text-right transition-all duration-500 ease-in-out">
                      <Link
                        href="/auth/forgot-password"
                        className="hover:text-brand-dark text-xs text-slate-500"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  )}
                  <IsPasswordValid
                    password={password}
                    setIsValid={setIsValid}
                  />
                </div>
              )}
              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                  if (!showLogin) {
                    setShowLogin(true);
                    setButtonEnabled(false);
                    // Add a slight delay before focusing the input field to ensure it's visible
                    setTimeout(() => nameRef.current?.focus(), 100);
                  } else if (formRef.current) {
                    formRef.current.requestSubmit();
                  }
                }}
                variant="darkCTA"
                className="w-full justify-center"
                loading={signingUp}
              >
                Continue with Email
              </Button>
            </form>
          )}

          <GoogleButton />
        </div>

        {(termsUrl || privacyUrl) && (
          <div className="mt-3 text-center text-xs text-slate-500">
            By signing up, you agree to our
            <br />
            {termsUrl && (
              <Link
                className="font-semibold"
                href={termsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Terms of Service
              </Link>
            )}
            {termsUrl && privacyUrl && <span> and </span>}
            {privacyUrl && (
              <Link
                className="font-semibold"
                href={privacyUrl}
                rel="noreferrer"
                target="_blank"
              >
                Privacy Policy.
              </Link>
            )}
            {/*           <br />
          We&apos;ll occasionally send you account related emails. */}
            <hr className="mx-6 mt-3"></hr>
          </div>
        )}

        <div className="mt-9 text-center text-xs ">
          <span className="leading-5 text-slate-500">Have an account?</span>
          <br />
          <Link
            href={"/auth/login"}
            className="font-semibold text-slate-600 underline hover:text-slate-700"
          >
            Log in.
          </Link>
        </div>
      </div>
    </>
  );
};
