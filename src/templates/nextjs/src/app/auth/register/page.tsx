"use client";

import { LoginWithGoogle } from "@/components/ui/googleLogin";
import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { register } from "@/services/auth";
import { AuthContext } from "@/components/context/authContext";

export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {setUser}: any = useContext(AuthContext);
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
      } catch (error) {
        toast.error((error as Error).message, {id: "auth"});
        console.log(error)
      } finally {
        setSubmitting(false);
      }
  };
  return (
    <div className="flex justify-center mx-auto my-auto items-center w-full max-w-[400px] h-full">
      <div className="text-left grid grid-cols-1 divide-y my-10 sm:w-[70%] min-w-full">
        <h1 className="font-bold text-2xl mt-4">Register</h1>
        <Formik
          initialValues={{email: "", firstName: "", lastName: "", password: "", confpassword: ""}}
          validate={
            values => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors: any = {};
            if (!values.email) errors.email = "Email is required";
            else if (
              !/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,},$/i.test(values.email) 
            ) 
              errors.email = "Invalid email address";
            else if (!values.firstName) errors.firstName = "First name is required";
            else if (!values.lastName) errors.lastName = "Last name is required";
            else if (!values.password) errors.password = "Password is required";
            else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}&/.test(values.password)) errors.password = `Password must contain at least 8 characters,
            including at least one capital letter,
            one small letter and
            one special character`
            else if (values.confpassword !== values.password) errors.confpassword = "Passwords do not match"
            return errors;
            }
          }
          onSubmit = {async (values, {setSubmitting}) => {
            setSubmitting(true);
            console.log(values);
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
                className="outline-none px-4 text-black py-2 w-full rounded-md"
                placeholder="@example.com"
              />
              <ErrorMessage name="email" component={"div"} className="text-pink-400 text-xs mt-2" />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="firstName">First Name</label>
              <Field
                type="text"
                name="firstName"
                id="firstName"
                className="outline-none px-4 text-black py-2 w-full rounded-md"
                placeholder="First Name"
              />
              <ErrorMessage name="firstName" component={"div"} className="text-pink-400 text-xs mt-2" />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="lastName">Last Name</label>
              <Field
                type="text"
                name="lastName"
                id="lastName"
                className="outline-none px-4 text-black py-2 w-full rounded-md"
                placeholder="Last Name"
              />
              <ErrorMessage name="lastName" component={"div"} className="text-pink-400 text-xs mt-2" />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                id="password"
                className="outline-none px-4 text-black py-2 w-full rounded-md"
                placeholder="Password"
              />
              <ErrorMessage name="password" component={"div"} className="text-pink-400 text-xs mt-2" />
            </div>
            <div className="mx-2 mb-2 mt-4 space-y-1 text-sm">
              <label htmlFor="password">Confirm Password</label>
              <Field
                type="password"
                name="confpassword"
                id="confpassword"
                className="outline-none px-4 text-black py-2 w-full rounded-md"
                placeholder="Confirm Password"
              />
              <ErrorMessage name="confpassword" component={"div"} className="text-pink-400 text-xs mt-2" />
            </div>
            <div className="m-2">
              <button
                type="submit"
                className="px-8 py-2 rounded-md bg-white text-black mb-2 hover:translate-x-1 hover:translate-y-[0.5]"
              >
                Submit
              </button>
            </div>
          </Form>
        </Formik>
        <div>
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
}
