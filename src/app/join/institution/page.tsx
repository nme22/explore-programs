import { InstitutionJoinForm } from "@/components/forms/institution-join-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join as Institution",
};

export default async function Page() {
  return <InstitutionJoinForm />;
}
