"use client";

import Image from "next/image";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  // Registro
  const [registerData, setRegisterData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  // Login
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.registro(registerData.nome, registerData.email, registerData.senha);
      alert("Conta criada com sucesso! Faça login agora.");
      setActiveTab("login");
      setRegisterData({ nome: "", email: "", senha: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.login(loginData.email, loginData.senha);
      // Atualiza estado global via hook e salva email
      login(response.access_token);
      localStorage.setItem("user_email", loginData.email);

      // Redirecionar para a página de contatos com reload forçado
      window.location.href = "/contatos";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-login">
      <div className="container hero-forms" style={{ marginTop: "5rem" }}>
        {activeTab === "register" && (
          <div className="form-card">
            <h3>Crie sua conta</h3>

            <form onSubmit={handleRegister}>
              {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
              
              <input
                className="input"
                placeholder="Nome completo"
                value={registerData.nome}
                onChange={(e) =>
                  setRegisterData({ ...registerData, nome: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="E-mail"
                type="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Senha"
                type="password"
                value={registerData.senha}
                onChange={(e) =>
                  setRegisterData({ ...registerData, senha: e.target.value })
                }
                required
              />

              <button
                className="secondary-btn"
                style={{ width: "100%" }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar-se"}
              </button>
            </form>

            <p style={{ marginTop: "1rem", textAlign: "center" }}>
              Já tem uma conta?{" "}
              <button
                onClick={() => setActiveTab("login")}
                style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
              >
                Faça login
              </button>
            </p>
          </div>
        )}

        {activeTab === "login" && (
          <div className="form-card">
            <h3>Já tem uma conta?</h3>

            <form onSubmit={handleLogin}>
              {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
              
              <p className="form-subtitle">Entre com seu e-mail e senha.</p>

              <input
                className="input"
                placeholder="E-mail"
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Senha"
                type="password"
                value={loginData.senha}
                onChange={(e) =>
                  setLoginData({ ...loginData, senha: e.target.value })
                }
                required
              />

              <button
                className="primary-btn"
                style={{ width: "100%" }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p style={{ marginTop: "1rem", textAlign: "center" }}>
              Não tem uma conta?{" "}
              <button
                onClick={() => setActiveTab("register")}
                style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
