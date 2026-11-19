export type RegisterForm = {
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  password: string;
  rePassword: string;
  gender: "male" | "female";
};