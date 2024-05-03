import { hashPassword } from "@/app/lib/auth/util";
import axios from "axios";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  inviteToken?: string | null
): Promise<any> => {
  const hashedPassword = await hashPassword(password);
  try {
    const res = await axios.post(`/api/register`, {
      name,
      email,
      password: hashedPassword,
      inviteToken,
      onboardingCompleted: false,
    });
    if (res.status !== 200) {
      throw Error(res.data.error);
    }
    return res.data;
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const resendVerificationEmail = async (email: string): Promise<any> => {
  try {
    const res = await axios.post(`/api/v1/users/verification-email`, {
      email,
    });
    if (res.status !== 200) {
      throw Error(res.data.error);
    }
    return res.data;
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await axios.post(`/api/v1/users/forgot-password`, {
      email,
    });
    if (res.status !== 200) {
      throw Error(res.data.error);
    }
    return res.data;
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<any> => {
  const hashedPassword = await hashPassword(password);
  try {
    const res = await axios.post(`/api/v1/users/reset-password`, {
      token,
      hashedPassword,
    });
    if (res.status !== 200) {
      throw Error(res.data.error);
    }
    return res.data;
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};

export const deleteUser = async (): Promise<any> => {
  try {
    const res = await axios.delete("/api/v1/users/me/");
    if (res.status !== 200) {
      throw Error(res.data.error);
    }
    return res.data;
  } catch (error: any) {
    throw Error(`${error.message}`);
  }
};
