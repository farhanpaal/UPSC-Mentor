import { SignInClient } from "./sign-in-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | UPSCMENTOR",
  description: "Sign in to UPSCMENTOR with email or Google.",
};

export default function SignInPage() {
  return <SignInClient />;
}
