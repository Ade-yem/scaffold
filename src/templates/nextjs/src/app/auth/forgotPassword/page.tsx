"use client";

import { resetPassword, sendForgotPasswordCode } from "@/services/auth";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Timer from "@/components/ui/Timer";
import { AxiosError } from "axios";
import { PasswordInput } from "@/components/ui/passwordInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [correct, setCorrect] = useState({
    correct: false,
    message: "",
  });
  const [correctP, setCorrectP] = useState({
    correct: false,
    message: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState<string>("");
  const [shouldSendCode, setShouldSendCode] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const validatePassword = (password: string) => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password))
      setCorrectP({
        correct: false,
        message: `Password must contain at least 8 characters,
  including at least one capital letter,
  one small letter and
  one special character`,
      });
    else setCorrectP({ correct: true, message: "" });
    setNewPassword(password);
  };
  const validateEmail = (email: string) => {
    if (!/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,}$/i.test(email)) {
      setCorrect({ correct: false, message: "Email is not correct" });
    } else {
      setCorrect({ correct: true, message: "" });
    }
    setEmail(email);
  };
  const sendCode = async () => {
    try {
      if (!correct.correct) return;
      setShouldSendCode(false);
      console.log("code sent");
      setShowCode(true);
      const res = await sendForgotPasswordCode(email);
      toast.success(res, { id: "auth" });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message, { id: "auth" });
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      toast.loading("Verifying code...", { id: "auth" });
      const message = await resetPassword(email, newPassword, code);
      toast.success(message, { id: "auth" });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message, { id: "auth" });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mx-auto my-auto">
      <h1 className="font-bold text-xl mt-4">Forgot your password?</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col justify-start">
          <label htmlFor="email" className="mt-4">
            Email
          </label>
          <div className="relative min-w-[400px]">
            <input
              type="email"
              name="email"
              id="email"
              className="outline-none border border-slate-500 dark:border-white px-4 py-4 w-full rounded-md"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
            />
            <span
              className={`absolute text-orange-500 top-4 right-2 ${!shouldSendCode ? "cursor-not-allowed" : "cursor-pointer"}`}
              role="button"
              onClick={shouldSendCode ? sendCode : undefined}
            >
              Send code
            </span>{" "}
          </div>
          {!correct.correct && (
            <span className="text-pink-500 text-sm">{correct.message}</span>
          )}
          {!shouldSendCode && (
            <div className="mt-4">
              <Timer onComplete={() => setShouldSendCode(true)} />
            </div>
          )}
        </div>
        <div hidden={!showCode}>
          <div className="flex justify-center mt-4 min-w-[400px]"></div>
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center text-black border border-gray-300 rounded-md mx-1"
              value={code[index] || ""}
              onChange={(e) => {
                const newCode = code.split("");
                newCode[index] = e.target.value;
                setCode(newCode.join(""));
              }}
            />
          ))}
        </div>
        <div className="flex flex-col justify-start space-y-1">
          <label htmlFor="newPassword">New Password</label>
          <PasswordInput
            name="newPassword"
            onChange={(e) => {
              validatePassword(e.target.value);
            }}
            value={newPassword}
          />
          <span className="dm-mono-light-italic text-sm text-slate-500">
            Required
          </span>
          {!correctP.correct && (
            <span className="text-pink-500 text-sm">{correctP.message}</span>
          )}
        </div>
        <button type="submit" hidden>
          Submit
        </button>
      </form>
    </div>
  );
}
