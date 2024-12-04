"use client";

import { resetPassword, sendForgotPasswordCode } from "@/services/auth";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Timer from "@/components/ui/Timer"; // Adjust the import path as necessary

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [shouldSendCode, setShouldSendCode] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const sendCode = async () => {
    try {
      setShouldSendCode(false);
      console.log("code sent");
      setShowCode(true);
      const res = await sendForgotPasswordCode(email);
      toast.success(res, { id: "auth" });
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message, { id: "auth" });
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      toast.loading("Verifying code...", { id: "auth" });
      await resetPassword(email, code);
      toast.success("Password reset successful", { id: "auth" });
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message, { id: "auth" });
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
              className="outline-none px-4 text-black py-4 w-full rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span
              className={`absolute text-orange-500 top-4 right-2 ${!shouldSendCode ? "cursor-not-allowed" : "cursor-pointer"}`}
              role="button"
              onClick={shouldSendCode ? sendCode : undefined}
            >
              Send code
            </span>{" "}
          </div>
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
        <button type="submit" hidden>
          Submit
        </button>
      </form>
    </div>
  );
}
