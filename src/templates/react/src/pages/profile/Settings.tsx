import { useState } from "react";
import { changeName, changePassword } from "../../services/user";
import toast from "react-hot-toast";
import { validatePassword } from "../../services/validator";
import { PasswordInput } from "../../components/ui/passwordInput";

export default function ProfileSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorM, setErrorM] = useState<{
    password: string;
  }>({ password: "" });
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    setIsSubmitting(true);
    try {
      toast.loading("Updating...", { id: "auth" });
      const result = await changeName(firstName, lastName);
      toast.success(result.message, { id: "auth" });
    } catch (error) {
      const err = (error as Error).message;
      toast.error(err, { id: "auth" });
      console.error(error);
    }
  };
  const submitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    validatePassword(password, setErrorM);
    if (errorM.password.length > 1) {
      return;
    }
    try {
      toast.loading("Updating...", { id: "auth" });
      const result = await changePassword(password, newPassword);
      toast.success(result.message, { id: "auth" });
    } catch (error) {
      const err = (error as Error).message;
      toast.error(err, { id: "auth" });
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:divide-x-2 gap-4 sm:grid-cols-2 p-4 w-full">
      <div className="block space-y-3 p-5">
        <h2 className="font-dm-mono-medium text-xl">Account</h2>
        <form className="space-y-2 dm-mono-regular" onSubmit={submit}>
          <div className="flex flex-col justify-start space-y-1">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="border border-slate-500 outline-none rounded-md p-4 w-full"
              name="firstName"
              required
            />
            <span className="dm-mono-light-italic text-sm text-slate-500">
              Required
            </span>
          </div>
          <div className="flex flex-col justify-start space-y-1">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="border border-slate-500 outline-none rounded-md p-4 w-full"
              name="lastName"
              required
            />
            <span className="dm-mono-light-italic text-sm text-slate-500">
              Required
            </span>
          </div>
          <div className="">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 rounded-md bg-white text-black mb-2 hover:translate-x-1 hover:opacity-10 border border-slate-700"
            >
              {!isSubmitting ? "Submit" : "Submitting..."}
            </button>
          </div>
        </form>
      </div>
      <div className="block space-y-3 p-5">
        <h2 className="font-dm-mono-medium text-xl">Password Settings</h2>
        <form className="space-y-2 dm-mono-regular" onSubmit={submitPassword}>
          <div className="flex flex-col justify-start space-y-1">
            <label htmlFor="password">Old Password</label>
            <PasswordInput
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span className="dm-mono-light-italic text-sm text-slate-500">
              Required
            </span>
          </div>
          <div className="flex flex-col justify-start space-y-1">
            <label htmlFor="newPassword">New Password</label>
            <PasswordInput
              name="newPassword"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              value={newPassword}
            />
            <span className="dm-mono-light-italic text-sm text-slate-500">
              Required
            </span>
            <span className="dm-mono-light-italic text-sm text-pink-500">
              {errorM.password}
            </span>
          </div>
          <div className="">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 rounded-md bg-white text-black mb-2 hover:translate-x-1 hover:opacity-10 border border-slate-700"
            >
              {!isSubmitting ? "Submit" : "Submitting..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
