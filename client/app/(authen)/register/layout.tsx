import React from "react";
import "./register.css";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
