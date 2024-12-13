"use client";

import { LoginWithGoogle } from "@/components/ui/googleLogin";
import { login } from "@/services/auth";
import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { AuthContext } from "@/components/context/authContext";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { PasswordInputFormik } from "@/components/ui/passwordInput";


export default function Login() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {setUser}: any = useContext(AuthContext);
  const handleSubmit = async (
    values: {
      email: string;
      password: string;
    },
    setSubmitting: (isSubmitting: boolean) => void) => {
  try {
    toast.loading("Logging in...", {id: "auth"});
    const resUser = await login(values);
      setUser(resUser);
      toast.success(`Welcome back ${resUser.firstName}`, {id: "auth"});
      setTimeout(() => {
        router.push("/profile");
      }, 1000);

    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message, { id: "auth" });
    } finally {
      setSubmitting(false);
    } 
  };
  return (
    <div className="flex justify-center mx-auto my-auto items-center w-full max-w-[400px] h-full">
      <div className="text-left grid grid-cols-1 divide-y my-10 sm:w-[70%] min-w-full">
        <h1 className="font-bold text-2xl p-4">Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors: any = {};
            if (!values.email) errors.email = "Email is required";
            else if (
              !/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
                values.email,
              )
            )
              errors.email = "Invalid email address";
            else if (!values.password) errors.password = "Password is required";
            else if (
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(values.password)
            )
              errors.password = `Password must contain at least 8 characters,\n
            including at least one capital letter,\n
            one small letter and\n
            one special character`;
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await handleSubmit(values, setSubmitting);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 text-black dark:text-white">
              <div className="mx-2 mb-2 mt-4 space-y-1">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="outline-none border border-slate-500 dark:border-white p-4  w-full rounded-md"
                  placeholder="example@example.com"
                />
                <ErrorMessage
                  name="email"
                  component={"div"}
                  className="text-pink-400 text-sm mt-2 dm-mono-light-italic"
                />
              </div>
              <div className="m-2 space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="password">Password</label>
                  <Link href={"/auth/forgotPassword"} className="dm-mono-light-italic text-sm underline underline-offset-1">Forgot password?</Link>
                </div>
                <PasswordInputFormik
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component={"div"}
                  className="text-pink-400 text-sm mt-2"
                />
              </div>
              <div className="m-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-md bg-white text-black mb-2 hover:translate-x-1 hover:opacity-10 border border-slate-700"
                >
                  {!isSubmitting ? "Submit" : "Submitting..."}
                </button>
              </div>
              <Link href={"/auth/register"} className="m-2 dm-mono-light-italic text-sm underline-offset-1 underline">Create a new account</Link>
            </Form>
          )}
        </Formik>

        <div>
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
}
