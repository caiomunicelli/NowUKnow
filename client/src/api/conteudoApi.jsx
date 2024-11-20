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
    return false;
  }
};

export const getConteudoByPost = async (postagem_id) => {
  try {
    const response = await fetch(`/api/v1/conteudos/postagem/${postagem_id}`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Erro na discussão:", error);
    return false;
  }
};

export const updateConteudo = async (conteudo_id, conteudo, token) => {
  try {
    const response = await fetch(`/api/v1/discussoes/${conteudo_id}`, {
      method: "PUT",
      headers: { "x-access-token": token },
      body: conteudo,
    });
    const data = await response.json();
    if (response.ok) {
      return data.mensagem;
    } else {
      return data.errors;
    }
  } catch (error) {
    console.error("Erro na discussão:", error);
    return false;
  }
};
