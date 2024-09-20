import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="h-dvh grid place-items-center">
      <main>{children}</main>
    </div>
  );
}
