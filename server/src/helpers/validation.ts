import Joi, { ValidationError } from "joi";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

const registerSchema = Joi.object<RegisterData>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  isAdmin: Joi.boolean(),
});

const loginSchema = Joi.object<LoginData>({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

interface ValidationResult<T> {
  error?: ValidationError;
  value: T;
}

export const validateRegister = (
  data: RegisterData
): ValidationResult<RegisterData> => {
  const result = registerSchema.validate(data);
  if (result.error) {
    return { error: result.error, value: data };
  }
  return { value: result.value };
};

export const validateLogin = (data: LoginData): ValidationResult<LoginData> => {
  const result = loginSchema.validate(data);
  if (result.error) {
    console.log("Validation error during login:", result.error);
    return { error: result.error, value: data }; // Set value to undefined in case of an error
  }
  return { value: result.value };
};
