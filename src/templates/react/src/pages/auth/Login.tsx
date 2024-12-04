"use client";

import { LoginWithGoogle } from "@/components/ui/googleLogin";
import { login } from "@/services/auth";
import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { AuthContext } from "@/components/context/authContext";


export default function Login() {
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
        <h1 className="font-bold text-2xl mt-4">Login</h1>
        <Formik
          initialValues={{email: "", password: ""}}
          validate={values => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors: any = {};
            if (!values.email) errors.email = "Email is required";
            else if (
              !/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,}$/i.test(values.email) 
            ) 
              errors.email = "Invalid email address"
            else if (!values.password) errors.password = "Password is required";
            else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(values.password)) errors.password = `Password must contain at least 8 characters,\n
            including at least one capital letter,\n
            one small letter and\n
            one special character`
            return errors;
          }}
          onSubmit = {async (values, {setSubmitting}) => {
            setSubmitting(true);
            console.log(values);
            await handleSubmit(values, setSubmitting);
          }}
        >
          {({isSubmitting}) => (
            <Form className="space-y-4">
              <div className="mx-2 mb-2 mt-4 space-y-1">
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" className="outline-none px-4 text-black py-4 w-full rounded-md" placeholder="example@example.com"
              />
                <ErrorMessage name="email" component={"div"} className="text-pink-400 text-sm mt-2" />
              </div>
              <div className="m-2 space-y-1">
                <label htmlFor="password">Password</label>
                <Field type="password" name="password" className="outline-none px-4 text-black py-4 w-full rounded-md"
              placeholder="Password" />
                <ErrorMessage name="password" component={"div"} className="text-pink-400 text-sm mt-2" />
              </div>
              <div className="m-2">
                <button
                  type="submit" disabled={isSubmitting}
                  className="px-8 py-4 rounded-md bg-white text-black mb-2 hover:translate-x-1 hover:opacity-10"
                >
                  {!isSubmitting ? "Submit" : "Submitting..."}
                </button>
              </div>
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
