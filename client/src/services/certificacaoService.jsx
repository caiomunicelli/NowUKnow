import {
    getCertificacoes
  } from "../api/certificacaoApi";
  
  export const fetchCertificacoes = async () => {
    try {
      const certificacoes = await getCertificacoes(); // Chama a API para obter todas as categorias
      if (!certificacoes) throw new Error("Erro ao carregar as certificações");
      return certificacoes;
    } catch (error) {
      console.error("Erro ao buscar certificações no service:", error);
      throw error; // Lança o erro para ser tratado pelo componente
    }
  };
  