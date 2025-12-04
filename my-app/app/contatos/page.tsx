"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Contato {
  id?: number;
  nome: string;
  telefone: string;
  email: string;
  grupo: "Família" | "Trabalho" | "Amigos" | "Outros";
  is_favorito: boolean;
  notas: string;
  historico_chamadas: string;
}

export default function ContatosPage() {
  const router = useRouter();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingContato, setEditingContato] = useState<Contato | null>(null);
  const [search, setSearch] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("Todos");

  const [formData, setFormData] = useState<Contato>({
    nome: "",
    telefone: "",
    email: "",
    grupo: "Outros",
    is_favorito: false,
    notas: "",
    historico_chamadas: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    carregarContatos();
  }, []);

  const carregarContatos = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const data = await api.listarContatos(token, search, undefined, undefined, grupoFiltro);
      setContatos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarTelefone = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, "");

    // Limita a 11 dígitos (2 de DDD + 9 dígitos do número)
    if (apenasNumeros.length > 11) {
      return apenasNumeros.slice(0, 11);
    }

    // Formata: (XX) 9XXXX-XXXX
    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    } else if (apenasNumeros.length <= 7) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    } else {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const telefoneFormatado = formatarTelefone(e.target.value);
    setFormData({ ...formData, telefone: telefoneFormatado });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validação: telefone deve conter 11 dígitos (DDD + número móvel com 9 inicial)
    const apenasNumeros = formData.telefone.replace(/\D/g, "");
    if (apenasNumeros.length !== 11) {
      setError("Telefone deve conter 11 dígitos (DDD + número). Ex: (38) 999753779");
      return;
    }

    // Verifica padrão DDI: DDD (2 dígitos) + número que normalmente começa com 9
    if (!/^\d{2}9\d{8}$/.test(apenasNumeros)) {
      setError("Número inválido. Use DDD + número móvel (ex.: 38 9XXXXXXXX)");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      if (editingContato?.id) {
        await api.atualizarContato(token, editingContato.id, formData);
      } else {
        await api.criarContato(token, formData);
      }

      setShowModal(false);
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        grupo: "Outros",
        is_favorito: false,
        notas: "",
        historico_chamadas: "",
      });
      setEditingContato(null);
      carregarContatos();
    } catch (err: any) {
      // Se o backend retornar erro de duplicidade, exibe a mensagem
      setError(err.message || "Erro ao salvar contato");
    }
  };

  const handleEdit = (contato: Contato) => {
    setEditingContato(contato);
    setFormData(contato);
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este contato?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      await api.deletarContato(token, id);
      carregarContatos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleExportar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const blob = await api.exportarContatos(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contatos.csv";
      a.click();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Meus Contatos</h1>
        </div>

        {/* Ações */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ flex: 1, minWidth: "250px" }}
          />
          <select
            className="input"
            value={grupoFiltro}
            onChange={(e) => setGrupoFiltro(e.target.value)}
            style={{ width: 160 }}
          >
            <option value="Todos">Todos</option>
            <option value="Família">Família</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Amigos">Amigos</option>
            <option value="Outros">Outros</option>
          </select>
          <button
            onClick={carregarContatos}
            className="secondary-btn"
            style={{ whiteSpace: "nowrap" }}
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setEditingContato(null);
              setFormData({
                nome: "",
                telefone: "",
                email: "",
                grupo: "Outros",
                is_favorito: false,
                notas: "",
                historico_chamadas: "",
              });
              setError("");
              setShowModal(true);
            }}
            className="primary-btn"
            style={{ whiteSpace: "nowrap" }}
          >
            + Novo Contato
          </button>
          <button
            onClick={handleExportar}
            className="secondary-btn"
            style={{ whiteSpace: "nowrap" }}
          >
            Exportar CSV
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fee",
              color: "red",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Lista de Contatos */}
        {isLoading ? (
          <p>Carregando...</p>
        ) : contatos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "1.2rem", color: "#666" }}>
              Nenhum contato encontrado. Adicione seu primeiro contato!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {contatos.map((contato) => (
              <div
                key={contato.id}
                style={{
                  backgroundColor: "white",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      {contato.nome}
                    </h3>
                    {contato.is_favorito && <span>⭐</span>}
                  </div>
                  <p style={{ color: "#666", marginTop: "0.25rem" }}>
                    📞 {contato.telefone}
                  </p>
                  {contato.email && (
                    <p style={{ color: "#666", marginTop: "0.25rem" }}>
                      ✉️ {contato.email}
                    </p>
                  )}
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "0.5rem",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#e0e7ff",
                      color: "#4338ca",
                      borderRadius: "999px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {contato.grupo}
                  </span>
                  {contato.notas && (
                    <p style={{ marginTop: "0.5rem", color: "#888", fontSize: "0.9rem" }}>
                      📝 {contato.notas}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(contato)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contato.id!)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              {editingContato ? "Editar Contato" : "Novo Contato"}
            </h2>

            {error && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#fee",
                color: "#b91c1c",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: "1px solid #fca5a5"
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                className="input"
                placeholder="Nome *"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="Telefone * (XX) 9XXXX-XXXX"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
                required
                title="Telefone deve ter 11 dígitos (DDD + número com 9 inicial)"
              />
              {formData.telefone && formData.telefone.replace(/\D/g, "").length < 11 && (
                <div style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "-0.5rem", marginBottom: "0.5rem" }}>
                  ⚠️ Digite 11 dígitos (DDD + número)
                </div>
              )}

              <input
                className="input"
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <select
                className="input"
                value={formData.grupo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    grupo: e.target.value as any,
                  })
                }
              >
                <option value="Família">Família</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Amigos">Amigos</option>
                <option value="Outros">Outros</option>
              </select>

              <div style={{ marginBottom: "0.6rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "0.3rem", color: "#666" }}>
                  Notas
                </label>
                <textarea
                  className="input"
                  placeholder="Adicione notas sobre este contato"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={3}
                  style={{
                    marginBottom: 0,
                    borderRadius: "8px",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ marginBottom: "0.6rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "0.3rem", color: "#666" }}>
                  Histórico de Chamadas
                </label>
                <textarea
                  className="input"
                  placeholder="Registre o histórico de chamadas com este contato"
                  value={formData.historico_chamadas}
                  onChange={(e) =>
                    setFormData({ ...formData, historico_chamadas: e.target.value })
                  }
                  rows={3}
                  style={{
                    marginBottom: 0,
                    borderRadius: "8px",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.is_favorito}
                  onChange={(e) =>
                    setFormData({ ...formData, is_favorito: e.target.checked })
                  }
                />
                Marcar como favorito
              </label>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="primary-btn" style={{ flex: 1 }}>
                  {editingContato ? "Atualizar" : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingContato(null);
                  }}
                  className="secondary-btn"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
