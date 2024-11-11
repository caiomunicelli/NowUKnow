export const createPostagem = async (postagem, token) => {
    try {
      const response = await fetch("/api/v1/postagens/", {
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
      console.error("Erro na postagens:", error);
      return false; // Falha no login
    }
  };