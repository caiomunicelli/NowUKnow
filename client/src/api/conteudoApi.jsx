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

export const updateConteudo = async (conteudo, conteudo_id, token) => {
  try {
    const response = await fetch(`/api/v1/conteudos/${conteudo_id}`, {
      method: "PUT",
      headers: { "x-access-token": token },
      body: conteudo,
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    return false;
  }
};
