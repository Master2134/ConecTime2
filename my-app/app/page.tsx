/* Pagina Inicial */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return null; // ou um loading spinner
  }

  return (
    <section className="hero">
      <div className="container hero-inner">
        
          <div className="hero-brand">
            <Image 
              src="/logo-connec-time.png"
              alt="Logo ConnecTime"
              width={530}
              height={200}
              className="logo-img"
            />
          </div>

          <h1 className="hero-title">
            Sua agenda de contatos <span>inteligente.</span>
          </h1>

          <p className="hero-subtitle">
            A ConnecTime organiza seus contatos e otimiza sua comunicação, 
            para que você nunca perca o timing de uma conexão importante.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/recursos" className="primary-btn">
              Ver Recursos
            </Link>

            {isAuthenticated ? (
              <Link href="/contatos" className="primary-btn-outline">
                Meus Contatos
              </Link>
            ) : (
              <Link href="/login" className="primary-btn-outline">
                Acessar / Criar Conta
              </Link>
            )}
          </div>
        </div>
      
    </section>
  );
}
