export const createDiscussao = async (discussao, token) => {
  try {
    const response = await fetch("/api/v1/discussoes/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify(discussao),
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

export const getDiscussaoByPost = async (postagem_id) => {
  try {
    const response = await fetch(`/api/v1/discussoes/postagem/${postagem_id}`, {
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

export const updateDiscussao = async (discussao, discussao_id, token) => {
  try {
    console.log("Discussao json:", JSON.stringify(discussao));
    const response = await fetch(`/api/v1/discussoes/${discussao_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify(discussao),
    });
    const data = await response.json();
    console.log("Data discussao:", data);
    return data;
  } catch (error) {
    console.error("Erro na discussão:", error);
    return false;
  }
};
