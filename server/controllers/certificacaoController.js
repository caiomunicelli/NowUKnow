const CertificacaoRepository = require("../service/certificacaoService.js");
const Certificacao = require("../entities/certificacao.js");

const certificacaoRepository = new CertificacaoRepository();

class CertificacaoController {
  async criarCertificacao(
    nome,
    descricao,
    requisitos,
    imagem,
    categoriaId,
    nivel
  ) {
    if (!nome || !descricao || !categoriaId || !nivel) {
      return {
        sucesso: false,
        erros: [
          {
            campo: "dados",
            mensagem: "Todos os campos obrigatórios devem ser preenchidos.",
          },
        ],
      };
    }

    try {
      const certificacao = new Certificacao(
        0,
        nome,
        descricao,
        requisitos,
        imagem,
        categoriaId,
        nivel
      );
      const novaCertificacao = await certificacaoRepository.createCertificacao(
        certificacao
      );
      return { sucesso: true, certificacao: novaCertificacao };
    } catch (error) {
      return {
        sucesso: false,
        erros: [{ campo: "erro", mensagem: error.message }],
      };
    }
  }

  async listarCertificacoes() {
    try {
      const certificacoes = await certificacaoRepository.getAllCertificacoes();
      return { sucesso: true, certificacoes };
    } catch (error) {
      return {
        sucesso: false,
        erros: [{ campo: "erro", mensagem: error.message }],
      };
    }
  }

  async listarCertificacaoPorId(id) {
    try {
      const certificacao = await certificacaoRepository.getCertificacaoById(id);
      if (!certificacao) {
        return {
          sucesso: false,
          erros: [{ campo: "id", mensagem: "Certificação não encontrada." }],
        };
      }
      return { sucesso: true, certificacao };
    } catch (error) {
      return {
        sucesso: false,
        erros: [{ campo: "erro", mensagem: error.message }],
      };
    }
  }

  async atualizarCertificacao(
    id,
    nome,
    descricao,
    requisitos,
    imagem,
    categoriaId,
    nivel
  ) {
    try {
      const certificacaoExistente =
        await certificacaoRepository.getCertificacaoById(id);
      if (!certificacaoExistente) {
        return {
          sucesso: false,
          erros: [{ campo: "id", mensagem: "Certificação não encontrada." }],
        };
      }

      const certificacaoAtualizada = new Certificacao(
        id,
        nome,
        descricao,
        requisitos,
        imagem,
        categoriaId,
        nivel
      );
      const resultado = await certificacaoRepository.updateCertificacao(
        certificacaoAtualizada
      );

      return { sucesso: true, mensagem: resultado };
    } catch (error) {
      return {
        sucesso: false,
        erros: [{ campo: "erro", mensagem: error.message }],
      };
    }
  }

  async deletarCertificacao(id) {
    try {
      const certificacaoExistente =
        await certificacaoRepository.getCertificacaoById(id);
      if (!certificacaoExistente) {
        return {
          sucesso: false,
          erros: [{ campo: "id", mensagem: "Certificação não encontrada." }],
        };
      }

      await certificacaoRepository.deleteCertificacao(id);
      return { sucesso: true, mensagem: "Certificação deletada com sucesso." };
    } catch (error) {
      return {
        sucesso: false,
        erros: [{ campo: "erro", mensagem: error.message }],
      };
    }
  }
}

module.exports = CertificacaoController;
