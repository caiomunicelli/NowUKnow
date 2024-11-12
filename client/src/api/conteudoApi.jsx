export const createConteudo = async (conteudo, token) => {
  try {
    const response = await fetch("/api/v1/conteudos/", {
      method: "POST",
      headers: { "x-access-token": token },
      body: conteudo,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Erro na discussão:", error);
    return false; // Falha no login
  }
};
