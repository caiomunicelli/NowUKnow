import { getToken } from "./authService";
export const createPostagem = async (postagem) => {
    try {
    const token = getToken(); // Obtém o token do authService
      const response = await fetch("/api/v1/postagem/", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                    "x-access-token": token
         },
        body: JSON.stringify(postagem),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false; // Falha no login
    }
  };