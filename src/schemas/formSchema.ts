import { object, string, ref } from "yup";

export const schemaUser  = object({
  name: string()
  .required('Name is required')
  .min(3, 'The name must be at least 3 characters long.'),
  email: string()
  .required('Email is required')
  .email('Invalid format'),
  password: string()
  .required('Password is required')
  .min(6, 'The password must be at least 6 characters long.'),
  confirmPassword: string()
  .required('Confirm password is required')
  .oneOf([ref('password')], "Passwords do not match"),
});