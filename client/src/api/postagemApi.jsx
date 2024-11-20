export const createPostagem = async (postagem, token) => {
  try {
    const response = await fetch("/api/v1/postagens/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify(postagem),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Erro na postagens:", error);
    return false;
  }
};

export const deletePostagem = async (postagem_id, token) => {
  try {
    const response = await fetch(`/api/v1/postagens/${postagem_id}`, {
      method: "DELETE",
      headers: { "x-access-token": token },
    });
    const data = await response.json();

    if (response.ok) {
      console.log("Sucesso:", data);
      return data.mensagem; // Retorna a mensagem de sucesso
    } else {
      console.error("Erro retornado pela API:", data.errors || data.error);
      return data.errors || data.error; // Retorna os erros da API
    }
  } catch (error) {
    console.error("Erro no postagemApi.deletePostagem:", error);
    return "Erro inesperado ao comunicar com o servidor.";
  }
};
