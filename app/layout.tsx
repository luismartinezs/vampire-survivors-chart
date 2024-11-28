import "@/styles/globals.css";
import type { Metadata } from "next";
import { SansFont } from "@/fonts";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Vampire Survivors Weapon Evolutions",
  description: "A guide to weapon evolutions in Vampire Survivors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          SansFont.className,
          "bg-primary-800 text-white antialiased"
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
