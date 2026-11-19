import { Button, Input, ListBox, Select, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { registerSchema, type RegisterFormSchema } from "../../../schema/register";
import type { RegisterForm } from "../../../interface/regsiter";
import axios, { isAxiosError } from "axios";
import AppLoader from "../../../components/ui/AppLoader";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "https://route-posts.routemisr.com";
import PasswordInput from "../../../components/ui/PasswordInput";
import AuthFormField from "../../../components/auth/AuthFormField";

const genderItems = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
] as const;

export default function Register() {
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    defaultValues: {
      name: "Nourhan",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  async function submitForm(formData: RegisterForm) {
    if (loading) return;
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${API_BASE}/users/signup`, formData);
      console.log(data);
      toast.success(data.message);
      setTimeout(() => navigate("/auth/login"), 1000);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response, "error");
        toast.danger(error.response?.data?.message ?? "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = "auth-input";

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Join the conversation.
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Review the highlighted fields to get started.
      </p>

      <form onSubmit={handleSubmit(submitForm)} className="mt-8 space-y-5" noValidate>
        <AuthFormField label="Full Name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            {...register("name")}
            fullWidth
            type="text"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
          />
        </AuthFormField>

        <AuthFormField label="Username" htmlFor="username" error={errors.username?.message}>
          <Input
            id="username"
            {...register("username")}
            fullWidth
            type="text"
            className={inputClass}
            aria-invalid={Boolean(errors.username)}
          />
        </AuthFormField>

        <AuthFormField label="Email Address" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            {...register("email")}
            fullWidth
            type="email"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
          />
        </AuthFormField>

        <AuthFormField label="Date of Birth" htmlFor="dateOfBirth" error={errors.dateOfBirth?.message}>
          <div className="relative">
            <Input
              id="dateOfBirth"
              {...register("dateOfBirth")}
              fullWidth
              type="date"
              className={`${inputClass} pr-10`}
              aria-invalid={Boolean(errors.dateOfBirth)}
            />
            <CalendarIcon />
          </div>
        </AuthFormField>

        <AuthFormField label="Gender" error={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                className="w-full"
                selectedKey={field.value}
                onSelectionChange={(key) => field.onChange(String(key))}
                fullWidth
              >
                <Select.Trigger className={`${inputClass} w-full`}>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox items={genderItems}>
                    {(item) => <ListBox.Item id={item.id}>{item.label}</ListBox.Item>}
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
        </AuthFormField>

        <AuthFormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            {...register("password")}
            fullWidth
            aria-invalid={Boolean(errors.password)}
          />
        </AuthFormField>

        <AuthFormField label="Confirm Password" htmlFor="rePassword" error={errors.rePassword?.message}>
          <PasswordInput
            id="rePassword"
            {...register("rePassword")}
            fullWidth
            aria-invalid={Boolean(errors.rePassword)}
          />
        </AuthFormField>

        <p className="text-xs leading-relaxed text-slate-500">
          By joining, you agree to our{" "}
          <a href="#" className="font-semibold text-brand-600 hover:underline">
            Terms
          </a>{" "}
          &amp;{" "}
          <a href="#" className="font-semibold text-brand-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <Button
          type="submit"
          fullWidth
          className="h-12 rounded-xl bg-brand-gradient text-base font-bold text-white shadow-md"
          isDisabled={loading}
        >
          Create account
        </Button>

        {loading && <RegisterLoadingBar />}

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-bold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

function RegisterLoadingBar() {
  return (
    <div className="auth-loading-bar" role="status" aria-live="polite">
      <AppLoader size={22} />
      <span>Creating your account...</span>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}