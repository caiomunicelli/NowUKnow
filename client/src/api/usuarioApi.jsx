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
    return false; // Falha no login
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
      return true; // Cadastro bem-sucedido
    } else {
      console.error("Erro na resposta:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return false; // Falha no cadastro
  }
};

export const updateUsuario = async (token, updatedUsuario) => {
  try {
    const response = await fetch("/api/v1/usuarios", {
      method: "PUT",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUsuario),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Sucesso: ", data);
      return true; // Login bem-sucedido
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return false; // Falha no login
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
      return data; // Login bem-sucedido
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return null; // Falha no login
  }
};