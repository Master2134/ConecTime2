import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import {ReactNode} from "react";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "ConnecTime",
  description: "Sua agenda de contatos inteligente",
};

export default function RootLayout({ children }: {children: ReactNode}) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main style={{ paddingTop: "64px" }}>{children}</main>
      </body>
    </html>
  );
}

