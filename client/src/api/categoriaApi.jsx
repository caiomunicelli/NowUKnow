// src/apis/categoriaApi.js

export const getCategorias = async () => {
  try {
    const response = await fetch("/api/v1/categorias/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Erro ao buscar categorias:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return null;
  }
};

export const getCategoriaById = async (id) => {
  try {
    const response = await fetch(`/api/categorias/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Erro ao buscar categoria:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return null;
  }
};

export const createCategoria = async (categoria) => {
  try {
    const response = await fetch("/api/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Categoria criada com sucesso
    } else {
      console.error("Erro ao criar categoria:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return null;
  }
};

export const updateCategoria = async (id, categoria) => {
  try {
    const response = await fetch(`/api/categorias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Categoria atualizada com sucesso
    } else {
      console.error("Erro ao atualizar categoria:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return null;
  }
};

export const deleteCategoria = async (id) => {
  try {
    const response = await fetch(`/api/categorias/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true; // Categoria deletada com sucesso
    } else {
      console.error("Erro ao deletar categoria:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return false;
  }
};
