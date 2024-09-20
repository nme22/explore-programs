import { UserButton } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  return (
    <div>
      <div>
        <div>Dashboard Page - Subdomain</div>
        <UserButton />
      </div>
    </div>
  );
}
