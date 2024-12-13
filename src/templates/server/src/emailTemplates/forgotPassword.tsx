import * as React from "react";
import { Html, Section, Text, Tailwind } from "@react-email/components";

export const ForgotPasswordEmail = ({ code }: { code: string }) => {
  return (
    <Html>
      <Tailwind>
        <Section className="space-y-3 h-full w-full text-leading flex justify-center items-center">
          <Text>
            Here is the code to reset your password like you requested
          </Text>
          <Text className="px-3">{code}</Text>
          <Text>PS: Your reset code will expire in 5 minutes.</Text>
        </Section>
      </Tailwind>
    </Html>
  );
};
