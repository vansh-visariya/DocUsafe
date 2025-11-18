"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signup } from "@/lib/auth";
import { useAuthContext } from "@/contexts/auth-provider";
import { handleApiError } from "@/lib/api";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  enrollmentNumber: z.string().optional(),
  course: z.string().optional(),
  year: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const signupData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "student" as const,
        enrollmentNumber: data.enrollmentNumber,
        course: data.course,
        year: data.year ? parseInt(data.year) : undefined,
      };

      const response = await signup(signupData);
      
      if (response.success && response.token && response.user) {
        login(response.token, response.user);
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">Sign up for your DocuSafe account</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {error && (
              <Alert variant="error" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                error={errors.name?.message}
                disabled={isLoading}
                {...register("name")}
              />

              <Input
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                error={errors.email?.message}
                disabled={isLoading}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                error={errors.password?.message}
                disabled={isLoading}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                error={errors.confirmPassword?.message}
                disabled={isLoading}
                {...register("confirmPassword")}
              />

              <div className="border-t pt-5 mt-6">
                <p className="mb-4 text-sm font-semibold text-muted-foreground">Optional Student Information</p>
                
                <div className="space-y-5">
                  <Input
                    label="Enrollment Number"
                    type="text"
                    placeholder="e.g., 2024001"
                    error={errors.enrollmentNumber?.message}
                    disabled={isLoading}
                    {...register("enrollmentNumber")}
                  />

                  <Input
                    label="Course"
                    type="text"
                    placeholder="e.g., Computer Science"
                    error={errors.course?.message}
                    disabled={isLoading}
                    {...register("course")}
                  />

                  <Input
                    label="Year"
                    type="number"
                    placeholder="e.g., 1, 2, 3, or 4"
                    error={errors.year?.message}
                    disabled={isLoading}
                    {...register("year")}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
