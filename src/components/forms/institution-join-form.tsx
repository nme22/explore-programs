"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Departments, DepartmentTitles } from "@/types/department.type";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

type Step =
  | "createInstitution"
  | "createInstitutionAdmin"
  | "verifyInstitutionAdminEmail";

const createInstitutionFormSchema = z.object({
  name: z.string().min(1),
  websiteUrl: z.string().url(),
  domainName: z.string().min(1),
});

const createInstitutionAdminFormSchema = z.object({
  emailAddress: z.string().email(),
  department: z.enum([...Departments, ""]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string(),
});

const verifyInstitutionAdminEmailFormSchema = z.object({
  code: z.string().length(6),
});

export const InstitutionJoinForm = () => {
  const createInstitutionForm = useForm<
    z.infer<typeof createInstitutionFormSchema>
  >({
    resolver: zodResolver(createInstitutionFormSchema),
    defaultValues: {
      name: "",
      websiteUrl: "",
      domainName: "",
    },
  });

  const createInstitutionAdminForm = useForm<
    z.infer<typeof createInstitutionAdminFormSchema>
  >({
    resolver: zodResolver(createInstitutionAdminFormSchema),
    defaultValues: {
      emailAddress: "",
      department: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const verifyInstitutionAdminEmailForm = useForm<
    z.infer<typeof verifyInstitutionAdminEmailFormSchema>
  >({
    resolver: zodResolver(verifyInstitutionAdminEmailFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const { isLoaded, setActive, signUp } = useSignUp();
  const { replace } = useRouter();

  const [step, setStep] = useState<Step>("createInstitution");

  const submitCreateInstitutionForm = async () => {
    setStep("createInstitutionAdmin");
  };

  const submitCreateInstitutionAdminForm = async (
    data: z.infer<typeof createInstitutionAdminFormSchema>,
  ) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: data.emailAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setStep("verifyInstitutionAdminEmail");
    } catch (err) {
      console.error("Error", JSON.stringify(err, null, 2));
    }
  };

  const submitVerifyInstitutionAdminEmailForm = async (
    data: z.infer<typeof verifyInstitutionAdminEmailFormSchema>,
  ) => {
    if (!isLoaded) return;

    try {
      const { status, createdUserId, createdSessionId } =
        await signUp.attemptEmailAddressVerification({
          code: data.code,
        });

      if (status === "complete") {
        const institution = createInstitutionForm.getValues();

        await setActive({ session: createdSessionId });

        if (createdUserId) {
          await api.post("institutions", {
            json: {
              ...institution,
              createdBy: createdUserId,
            },
          });

          await api.put(`institution-admins/${createdUserId}`, {
            json: {
              privateMetadata: {
                role: "institution_admin",
                department: createInstitutionAdminForm.getValues("department"),
              },
            },
          });

          replace(`http://${institution.domainName}.localhost:3000/dashboard`);
        }
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      {step === "createInstitution" && (
        <Card className="max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>{"Create your institution account"}</CardTitle>
            <CardDescription>
              Welcome! Please fill in the details to get started.
            </CardDescription>
          </CardHeader>
          <Form {...createInstitutionForm}>
            <form
              onSubmit={createInstitutionForm.handleSubmit(
                submitCreateInstitutionForm,
              )}
            >
              <CardContent className="space-y-4">
                <FormField
                  control={createInstitutionForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution name</FormLabel>
                      <FormControl>
                        <Input placeholder="Georgian College" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createInstitutionForm.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution website url</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://georgiancollege.ca"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createInstitutionForm.control}
                  name="domainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution domain name</FormLabel>
                      <FormControl>
                        <Input placeholder="georgiancollege" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex-col gap-6">
                <Button className="w-full gap-2">
                  Continue
                  <ArrowRightIcon size={16} />
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold hover:underline text-foreground"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
      {step === "createInstitutionAdmin" && (
        <Card className="max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>{"Create your institution's admin account"}</CardTitle>
            <CardDescription>
              Welcome! Please fill in the details to get started.
            </CardDescription>
          </CardHeader>
          <Form {...createInstitutionAdminForm}>
            <form
              autoComplete="off"
              onSubmit={createInstitutionAdminForm.handleSubmit(
                submitCreateInstitutionAdminForm,
              )}
            >
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={createInstitutionAdminForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createInstitutionAdminForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={createInstitutionAdminForm.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="kyle.oliva@georgiancollege.ca"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {"Use your institution's email domain."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createInstitutionAdminForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Departments.map((department, i) => (
                            <SelectItem key={department} value={department}>
                              {DepartmentTitles[i]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createInstitutionAdminForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2">
                  Continue
                  <ArrowRightIcon size={16} />
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
      {step === "verifyInstitutionAdminEmail" && (
        <Card className="max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              Enter the verification code sent to your email{" "}
              {createInstitutionAdminForm.getValues("emailAddress")}
            </CardDescription>
          </CardHeader>
          <Form {...verifyInstitutionAdminEmailForm}>
            <form
              autoComplete="off"
              onSubmit={verifyInstitutionAdminEmailForm.handleSubmit(
                submitVerifyInstitutionAdminEmailForm,
              )}
            >
              <CardFooter>
                <FormField
                  control={verifyInstitutionAdminEmailForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="mx-auto">
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          onComplete={verifyInstitutionAdminEmailForm.handleSubmit(
                            submitVerifyInstitutionAdminEmailForm,
                          )}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </>
  );
};
