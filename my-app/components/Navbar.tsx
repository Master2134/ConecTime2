"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email) {
      setUserEmail(email);
    } else {
      setUserEmail("");
    }
  }, [isAuthenticated, isLoading]);

  const handleLogout = () => {
    logout();
    setUserEmail("");
    router.push("/");
  };

  return (
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

          {isAuthenticated && (
            <Link href="/contatos" className="nav-link">
              Contatos
            </Link>
          )}

          <Link href="/recursos" className="nav-link">
            Recursos
          </Link>

          <Link href="/objetivos" className="nav-link">
            Objetivos
          </Link>

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <span className="nav-link" style={{ cursor: "default", color: "#d1d5db", fontSize: "0.85rem" }}>
                    {userEmail}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="nav-link nav-link-outline"
                    style={{
                      background: "none",
                      border: "1px solid rgb(191 219 254 / 0.9)",
                      cursor: "pointer",
                      padding: "0.35rem 0.75rem",
                    }}
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link href="/login" className="nav-link nav-link-outline">
                  Login
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
