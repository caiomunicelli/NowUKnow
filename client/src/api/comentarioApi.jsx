export const createComentario = async (comentario, token) => {
  try {
    const response = await fetch("/api/v1/comentarios/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify(comentario),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Erro nos comentários:", error);
    return false;
  }
};

export const deleteComentario = async (comentario_id, token) => {
  try {
    const response = await fetch(`/api/v1/comentarios/${comentario_id}`, {
      method: "DELETE",
      headers: { "x-access-token": token },
    });
    const data = await response.json();

    if (response.ok) {
      // console.log("Sucesso:", data);
      return data.mensagem; // Retorna a mensagem de sucesso
    } else {
      // console.error("Erro retornado pela API:", data.errors || data.error);
      return data.errors || data.error; // Retorna os erros da API
    }
  } catch (error) {
    console.error("Erro no comentarioApi.deleteComentario:", error);
    return "Erro inesperado ao comunicar com o servidor.";
  }
};

export const updateComentario = async (comentario, comentario_id, token) => {
  // console.log("Comentario json:", JSON.stringify(comentario));
  try {
    const response = await fetch(`/api/v1/comentarios/${comentario_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify(comentario),
    });
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Erro nos comentários:", error);
    return false;
  }
};
