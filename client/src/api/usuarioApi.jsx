export const loginUsuario = async (credenciais) => {
  console.log(JSON.stringify(credenciais));
  try {
    const response = await fetch("/api/v1/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciais),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return false;
  }
};

export const signupUsuario = async (novoUsuario) => {
  try {
    console.log("Novo Usuario: ", novoUsuario);
    const response = await fetch("/api/v1/usuarios", {
      method: "POST",
      body: novoUsuario,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Sucesso: ", data);
      return true;
    } else {
      console.error("Erro na resposta:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return false;
  }
};

export const updateUsuario = async (token, updatedUsuario) => {
  try {
    const response = await fetch("/api/v1/usuarios", {
      method: "PUT",
      headers: {
        "x-access-token": token,
      },
      body: updatedUsuario,
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
    console.error("Erro no usuarioApi.updateUsuario:", error);
    return "Erro inesperado ao comunicar com o servidor.";
  }
};

export const getUsuarioAtual = async (token) => {
  try {
    const response = await fetch("/api/v1/usuarios", {
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Sucesso: ", data);
      return data;
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return null;
  }
};

export const deleteUsuarioAtual = async (token) => {
  try {
    const response = await fetch("/api/v1/usuarios", {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    });

    // Tenta processar a resposta JSON, mesmo em caso de erro
    const data = await response.json();

    if (response.ok) {
      console.log("Sucesso:", data);
      return data.mensagem; // Retorna a mensagem de sucesso
    } else {
      console.error("Erro retornado pela API:", data.errors || data.error);
      return data.errors || data.error; // Retorna os erros da API
    }
  } catch (error) {
    console.error("Erro no usuarioApi.deleteUsuarioAtual:", error);
    return "Erro inesperado ao comunicar com o servidor.";
  }
};

export const removerFotoUsuario = async (token) => {
  try {
    const response = await fetch("/api/v1/usuarios/imagem", {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Foto de perfil removida com sucesso:", data);
      return data.mensagem; // Retorna a mensagem de sucesso
    } else {
      console.error("Erro retornado pela API:", data.errors || data.error);
      return data.errors || data.error; // Retorna os erros da API
    }
  } catch (error) {
    console.error("Erro ao remover foto do usuário:", error);
    return "Erro inesperado ao comunicar com o servidor.";
  }
};
