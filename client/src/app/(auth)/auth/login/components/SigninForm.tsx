"use client";

import { GithubButton } from "@/app/(auth)/auth/components/GithubButton";
import { GoogleButton } from "@/app/(auth)/auth/components/GoogleButton";
import { XCircleIcon } from "lucide-react";
import axios from "axios";
import Link from "next/dist/client/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { cn } from "@/app/lib/cn";
import { Button } from "@/app/ui/Button";
import { PasswordInput } from "@/app/ui/PasswordInput";
import { Input } from "@/app/ui/Input";

type TSigninFormState = {
  email: string;
  password: string;
  totpCode: string;
  backupCode: string;
};

export const SigninForm = ({
  emailAuthEnabled,
  publicSignUpEnabled,
  passwordResetEnabled,
  googleOAuthEnabled,
  githubOAuthEnabled,
}: {
  emailAuthEnabled: boolean;
  publicSignUpEnabled: boolean;
  passwordResetEnabled: boolean;
  googleOAuthEnabled: boolean;
  githubOAuthEnabled: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm<TSigninFormState>();

  const onSubmit: SubmitHandler<TSigninFormState> = async (data) => {
    try {
      setLoggingIn(true);
      const response = await axios.post("http://localhost:5000/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        // Set authentication cookies if login is successful
        const { accessToken, refreshToken } = response.data;
        document.cookie = `accessToken=${accessToken}; path=/;`;
        document.cookie = `refreshToken=${refreshToken}; path=/;`;

        // Redirect to dashboard or any other route after successful login
        console.log("Login successful:", response.data);
        router.push("/onboarding");
      } else {
        setSignInError(
          response.data.message || "Login failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setSignInError(
        error?.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setLoggingIn(false);
    }
  };
  const [loggingIn, setLoggingIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [signInError, setSignInError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const error = searchParams?.get("error");

  useEffect(() => {
    if (error) {
      setSignInError(error);
    }
  }, [error]);

  return (
    <FormProvider {...formMethods}>
      <div className="text-center">
        <h1 className="mb-4 text-slate-700">Login to your account</h1>
        <div className="space-y-2">
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            {showLogin && (
              <div>
                <div className="mb-2 transition-all duration-500 ease-in-out">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="work@email.com"
                    defaultValue={searchParams?.get("email") || ""}
                    className="focus:border-brand focus-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                    {...formMethods.register("email", {
                      required: true,
                      pattern: /\S+@\S+\.\S+/,
                    })}
                  />
                </div>
                <div className="transition-all duration-500 ease-in-out">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Controller
                    name="password"
                    control={formMethods.control}
                    render={({ field }) => (
                      <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        placeholder="*******"
                        aria-placeholder="password"
                        onFocus={() => setIsPasswordFocused(true)}
                        required
                        className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                        {...field}
                      />
                    )}
                    rules={{
                      required: true,
                    }}
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
              </div>
            )}
            {emailAuthEnabled && (
              <Button
                onClick={() => {
                  if (!showLogin) {
                    setShowLogin(true);
                    // Add a slight delay before focusing the input field to ensure it's visible
                    setTimeout(() => emailRef.current?.focus(), 100);
                  } else if (formRef.current) {
                    formRef.current.requestSubmit();
                  }
                }}
                variant="darkCTA"
                className="w-full justify-center"
                loading={loggingIn}
              >
                {"Login with Email"}
              </Button>
            )}
          </form>

          <GoogleButton />
        </div>

        {publicSignUpEnabled && (
          <div className="mt-9 text-center text-xs ">
            <span className="leading-5 text-slate-500">New to Kindr?</span>
            <br />
            <Link
              href={"/auth/signup"}
              className="font-semibold text-slate-600 underline hover:text-slate-700"
            >
              Create an account
            </Link>
          </div>
        )}
      </div>

      {signInError && (
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
                An error occurred when logging you in
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="space-y-1 whitespace-pre-wrap">{signInError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
};
