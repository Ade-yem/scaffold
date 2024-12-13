"use client";

import { LoginWithGoogle } from "@/components/ui/googleLogin";
import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { register } from "@/services/auth";
import { AuthContext } from "@/components/context/authContext";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { PasswordInputFormik } from "@/components/ui/passwordInput";

export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {setUser}: any = useContext(AuthContext);
  const router = useRouter();
  const handleSubmit = async (
    values: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      confpassword: string;
    },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const {email, firstName, lastName, password} = values;

    try {
      toast.loading("Registration in progress...", {id: "auth"});
      const resUser = await register({email, firstName, lastName, password});
        setUser(resUser);
        toast.success(`Welcome ${resUser.firstName}`, {id: "auth"});
        router.push("/profile");
      } catch (error) {
        if (error instanceof AxiosError)
          toast.error(error.response?.data.message, { id: "auth" });
        console.log(error)
      } finally {
        setSubmitting(false);
      }
  };
  return (
    <div className="flex justify-center mx-auto my-auto items-center w-full max-w-[400px] h-full">
      <div className="text-left grid grid-cols-1 divide-y my-10 sm:w-[70%] min-w-full">
        <h1 className="font-bold text-2xl p-4">Register</h1>
        <Formik
          initialValues={{
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confpassword: "",
          }}
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
            if (!values.firstName) errors.firstName = "First name is required";
            else if (!values.lastName)
              errors.lastName = "Last name is required";
            if (!values.password) errors.password = "Password is required";
            else if (
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(values.password)
            )
              errors.password = `Password must contain at least 8 characters,
            including at least one capital letter,
            one small letter and
            one special character`;
            if (values.confpassword !== values.password)
              errors.confpassword = "Passwords do not match";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await handleSubmit(values, setSubmitting);
          }}
        >
          <Form className="space-y-4">
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                id="email"
                className="outline-none border border-slate-500 dark:border-white px-4 py-4 w-full rounded-md"
                placeholder="@example.com"
              />
              <ErrorMessage
                name="email"
                component={"div"}
                className="text-pink-400 text-xs mt-2"
              />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="firstName">First Name</label>
              <Field
                type="text"
                name="firstName"
                id="firstName"
                className="outline-none border border-slate-500 dark:border-white px-4 py-4 w-full rounded-md"
                placeholder="First Name"
              />
              <ErrorMessage
                name="firstName"
                component={"div"}
                className="text-pink-400 text-xs mt-2"
              />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="lastName">Last Name</label>
              <Field
                type="text"
                name="lastName"
                id="lastName"
                className="outline-none border border-slate-500 dark:border-white px-4 py-4 w-full rounded-md"
                placeholder="Last Name"
              />
              <ErrorMessage
                name="lastName"
                component={"div"}
                className="text-pink-400 text-xs mt-2"
              />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="password">Password</label>
              <PasswordInputFormik
                name="password"
                id="password"
                placeholder="Password"
              />
              <ErrorMessage
                name="password"
                component={"div"}
                className="text-pink-400 text-xs mt-2"
              />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="confpassword">Confirm Password</label>
              <PasswordInputFormik
                name="confpassword"
                id="confpassword"
                placeholder="Confirm Password"
              />
              <ErrorMessage
                name="confpassword"
                component={"div"}
                className="text-pink-400 text-xs mt-2"
              />
            </div>
            <div className="m-2">
              <button
                type="submit"
                className="px-8 py-4 rounded-md bg-white text-black mb-2 hover:translate-x-1 hover:opacity-10 border border-slate-700"
              >
                Submit
              </button>
            </div>
            <Link
              href={"/auth/register"}
              className="m-2 dm-mono-light-italic text-sm underline-offset-1 underline"
            >
              Login here if you already have an account!
            </Link>
          </Form>
        </Formik>
        <div>
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
}
