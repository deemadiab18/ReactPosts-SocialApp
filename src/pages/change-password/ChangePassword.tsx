import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import AppLoader from "../../components/ui/AppLoader";
import { useState } from "react";
import { changePassword } from "../../api/auth";
import {
  changePasswordSchema,
  type ChangePasswordFormSchema,
} from "../../schema/changePassword";
import { useAuth } from "../../hooks/useAuth";
import PasswordInput from "../../components/ui/PasswordInput";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const { updateSession } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", newPassword: "", confirmPassword: "" },
  });

  async function submitForm(values: ChangePasswordFormSchema) {
    if (loading) return;
    try {
      setLoading(true);
      const data = await changePassword({
        password: values.password,
        newPassword: values.newPassword,
      });
      updateSession(data.data.token, data.data.user);
      toast.success(data.message);
      reset();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.danger(error.response?.data?.message ?? "Could not update password");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-brand-100 bg-white p-6 dark:border-brand-700 dark:bg-brand-800/40">
      <h1 className="text-2xl font-extrabold text-brand-700">Change password</h1>
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <PasswordInput {...register("password")} fullWidth placeholder="Current password" />
        {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
        <PasswordInput {...register("newPassword")} fullWidth placeholder="New password" />
        {errors.newPassword && <p className="text-sm text-red-400">{errors.newPassword.message}</p>}
        <PasswordInput {...register("confirmPassword")} fullWidth placeholder="Confirm new password" />
        {errors.confirmPassword && (
          <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
        )}
        <Button type="submit" fullWidth className="bg-brand-gradient text-white">
          {loading && (
            <AppLoader size={28} colors={["#ffffff", "#cdebf4"]} color="#ffffff" />
          )}
          Update password
        </Button>
      </form>
    </div>
  );
}