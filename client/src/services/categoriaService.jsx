// src/services/categoriaService.js
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../apis/categoriaApi";

export const fetchCategorias = async () => {
  try {
    const categorias = await getCategorias(); // Chama a API para obter todas as categorias
    if (!categorias) throw new Error("Erro ao carregar as categorias");
    return categorias;
  } catch (error) {
    console.error("Erro ao buscar categorias no service:", error);
    throw error; // Lança o erro para ser tratado pelo componente
  }
};

export const fetchCategoriaPorId = async (id) => {
  try {
    const categoria = await getCategoriaById(id); // Chama a API para obter uma categoria pelo ID
    if (!categoria) throw new Error("Categoria não encontrada");
    return categoria;
  } catch (error) {
    console.error("Erro ao buscar categoria no service:", error);
    throw error; // Lança o erro para ser tratado pelo componente
  }
};

export const criarCategoria = async (categoria) => {
  try {
    const novaCategoria = await createCategoria(categoria); // Chama a API para criar uma categoria
    if (!novaCategoria) throw new Error("Erro ao criar categoria");
    return novaCategoria;
  } catch (error) {
    console.error("Erro ao criar categoria no service:", error);
    throw error; // Lança o erro para ser tratado pelo componente
  }
};

export const editarCategoria = async (id, categoria) => {
  try {
    const categoriaAtualizada = await updateCategoria(id, categoria); // Chama a API para atualizar uma categoria
    if (!categoriaAtualizada) throw new Error("Erro ao atualizar categoria");
    return categoriaAtualizada;
  } catch (error) {
    console.error("Erro ao editar categoria no service:", error);
    throw error; // Lança o erro para ser tratado pelo componente
  }
};

export const excluirCategoria = async (id) => {
  try {
    const sucesso = await deleteCategoria(id); // Chama a API para deletar uma categoria
    if (!sucesso) throw new Error("Erro ao deletar categoria");
    return sucesso;
  } catch (error) {
    console.error("Erro ao excluir categoria no service:", error);
    throw error; // Lança o erro para ser tratado pelo componente
  }
};
