import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <div>Home Page - Domain</div>
      <UserButton />
    </div>
  );
}
