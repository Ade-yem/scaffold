import React from "react";

export const validate = (
  values: {
    email: string; password: string;
  },
  setError: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
  }>>,
  setSuccess: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
  }>>) => {
  if (!values.email || values.email === "") setError((prev) => ({ ...prev, email: "Email is required" }));
  else if (
    !/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,}$/i.test(values.email) 
  )
  setError((prev) => ({ ...prev, email: "Invalid email address" }));
  else {
    setSuccess((prev) => ({ ...prev, email: "Nicely done!" }));
    setError((prev) => ({ ...prev, email: "" }));
  }
  if (!values.password || values.password === "") setError((prev) => ({ ...prev, password: "Password is required"}));
  else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(values.password)) setError((prev) => ({ ...prev, password: `Password must contain at least 8 characters,
  including at least one capital letter,
  one small letter and
  one special character`
  }));
  else {
    setSuccess((prev) => ({ ...prev, password: "Nice work!" }));
    setError((prev) => ({ ...prev, password: "" }));
  }
}


export const validatePassword = (
  password: string,
  setError: React.Dispatch<React.SetStateAction<{
    password: string;
  }>>
) => {
  if (!password || password === "") setError((prev) => ({ ...prev, password: "Password is required"}));
  else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) setError((prev) => ({ ...prev, password: `Password must contain at least 8 characters,
  including at least one capital letter,
  one small letter and
  one special character`
  }));
  else {
    setError((prev) => ({ ...prev, password: "" }));
  }
}