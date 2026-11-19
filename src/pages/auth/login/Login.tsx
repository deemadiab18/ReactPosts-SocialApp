import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormSchema } from "../../../schema/login";
import axios, { isAxiosError } from "axios";
import { Button, Input, toast } from "@heroui/react";
import AppLoader from "../../../components/ui/AppLoader";
import type { LoginForm } from "../../../interface/login";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthCountext";
import { normalizeApiUser } from "../../../api/normalizeUser";
import PasswordInput from "../../../components/ui/PasswordInput";
import AuthFormField from "../../../components/auth/AuthFormField";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "https://route-posts.routemisr.com";

const defaultServerError =
  "That email and password don't match. Please check your details and try again.";

export default function Login() {
  const [loading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const updateToken = auth?.updateToken;

  const showFieldError = Boolean(serverError);
  const inputClass = showFieldError ? "auth-input auth-input-error" : "auth-input";

  async function submitForm(formData: LoginForm) {
    if (loading) return;
    setServerError("");
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${API_BASE}/users/signin`, formData);
      console.log(data);
      const payload = data.data as { token?: string; user?: unknown };
      const sessionUser = normalizeApiUser(payload?.user);
      if (sessionUser) {
        localStorage.setItem("user", JSON.stringify(sessionUser));
      }
      updateToken?.(payload.token ?? null);
      toast.success(data.message);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response, "error");
        const message = error.response?.data?.message as string | undefined;
        toast.danger(message ?? defaultServerError);
        setServerError(message ?? defaultServerError);
      } else {
        setServerError(defaultServerError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Welcome back.
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Your people. Your ship logs. Right where you left off.
      </p>

      <form onSubmit={handleSubmit(submitForm)} className="mt-8 space-y-5" noValidate>
        <AuthFormField label="Email or username" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            {...register("email")}
            fullWidth
            type="text"
            autoComplete="username"
            className={errors.email ? `${inputClass} auth-input-error` : inputClass}
            aria-invalid={Boolean(errors.email) || showFieldError}
          />
        </AuthFormField>

        <AuthFormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            {...register("password")}
            fullWidth
            autoComplete="current-password"
            className={errors.password ? `${inputClass} auth-input-error` : inputClass}
            aria-invalid={Boolean(errors.password) || showFieldError}
          />
        </AuthFormField>

        {serverError && (
          <div className="auth-alert-error" role="alert">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          className="h-12 rounded-xl bg-brand-gradient text-base font-bold text-white shadow-md"
          isDisabled={loading}
        >
          {loading ? (
            <AppLoader size={22} colors={["#ffffff", "#cdebf4"]} color="#ffffff" />
          ) : null}
          Login
        </Button>

        {loading && (
          <div className="auth-loading-bar" role="status" aria-live="polite">
            <AppLoader size={22} />
            <span>Signing you in...</span>
          </div>
        )}

        <p className="text-center text-sm text-slate-600">
          New around here?{" "}
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-1 font-bold text-brand-600 hover:underline"
          >
            Create account
            <span aria-hidden>→</span>
          </Link>
        </p>
      </form>

      <p className="mt-10 text-xs text-slate-400 lg:mt-auto lg:pt-10">
        A quieter corner for developers. Share patterns openly. Connect thoughtfully.
      </p>
    </div>
  );
}