"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const signUp = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8, "Password is required"),
  confirmPassword: z.string().min(8, "Password is required"),
});

type SignUpData = z.infer<typeof signUp>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: {},
  } = useForm<SignUpData>({
    resolver: zodResolver(signUp),
  });

  const onSubmit = async (data: z.infer<typeof signUp>) => {
    setIsSubmitting(true);
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      if (data.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        setIsSubmitting(false);
        return;
      }

      const { confirmPassword, ...userData } = data;
      const response = await axios.post("/api/signup", userData);

      if (response.status === 200 || response.status === 201) {
        router.push("/login");
        toast.success(response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error in signup of user", err);
      toast.error("Something went wrong. Please try again later");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="string"
                  placeholder="Name"
                  {...register("name")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      {...register("password")}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="********"
                      {...register("confirmPassword")}
                      required
                    />
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                  {isSubmitting && (
                    <span className="mr-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" /></span>
                  )}
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
