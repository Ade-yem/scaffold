import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React, { useContext } from "react";
import { AuthContext, User } from "../context/authContext";

export const LoginWithGoogle: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {setUser}: any = useContext(AuthContext);
  return (
    <div role="button" className="w-full py-4">
      <GoogleLogin
        onSuccess={(credentialRes) => {
          const details = jwtDecode(credentialRes.credential as string);
          const user: User = {
            // @ts-expect-error jwtDecode is not adding other details to its response
            firstName: details.given_name, lastName: details.family_name, email: details.email, image: details.picture
          }
          setUser(user);

        }}
        onError={() => {
          console.log("Login failed");
        }}
        type="standard"
        text="continue_with"
        theme="outline"
        width={"400px"}
        // size="large"
        logo_alignment="center"
        useOneTap
      />
    </div>
  );
};
