// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log("API URL:", API_BASE_URL);

export const api = {
  // Autenticação
  registro: async (nome: string, email: string, senha: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Erro ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      console.error("Erro no registro:", error);
      throw error;
    }
  },

  login: async (email: string, senha: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Erro ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  // Contatos
  listarContatos: async (token: string, search?: string, skip?: number, limit?: number, grupo?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (skip) params.append("skip", skip.toString());
    if (limit) params.append("limit", limit.toString());
    if (grupo && grupo !== "Todos") params.append("grupo", grupo);

    try {
      const url = `${API_BASE_URL}/contatos/?${params.toString()}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      console.error("Erro ao listar contatos:", error);
      throw error;
    }
  },

  criarContato: async (token: string, contato: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contato),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao criar contato");
      }

      return data;
    } catch (error: any) {
      console.error("Erro ao criar contato:", error);
      throw error;
    }
  },

  atualizarContato: async (token: string, contatoId: number, contato: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos/${contatoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contato),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao atualizar contato");
      }

      return data;
    } catch (error: any) {
      console.error("Erro ao atualizar contato:", error);
      throw error;
    }
  },

  deletarContato: async (token: string, contatoId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos/${contatoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar contato");
      }
    } catch (error: any) {
      console.error("Erro ao deletar contato:", error);
      throw error;
    }
  },

  exportarContatos: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos/exportar/csv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao exportar contatos");
      }

      return response.blob();
    } catch (error: any) {
      console.error("Erro ao exportar contatos:", error);
      throw error;
    }
  },
};
