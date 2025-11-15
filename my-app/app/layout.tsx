import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import {ReactNode} from "react";

export const metadata = {
  title: "ConnecTime",
  description: "Sua agenda de contatos inteligente",
};

export default function RootLayout({ children }: {children: ReactNode}) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="navbar">
          <div className="container navbar-inner">
            <div className="logo">
              <Image 
                src="/logo-connec-time.png"
                alt="Logo ConnecTime"
                width={150}
                height={50}
                className="logo-img"
                />
              
            </div>

            <nav className="nav-links">
              <Link href="/" className="nav-link">
                Início
              </Link>
              <Link href="/recursos" className="nav-link">
                Recursos
              </Link>
              <Link href="/objetivos" className="nav-link">
                Objetivos
              </Link>
              <Link href="/login" className="nav-link nav-link-outline">
                Login
              </Link>
              
            </nav>
          </div>
        </header>

        {/* Conteúdo da página atual */}
        <main>{children}</main>
      </body>
    </html>
  );
}

