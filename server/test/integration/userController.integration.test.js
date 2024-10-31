const assert = require('assert');
const UsuarioController = require('../../controllers/usuarioController.js');
describe('UserRepository - Integration Tests', () => {
    let usuarioController;
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear(); // Ano com 4 dígitos
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês (0-11, então +1) com 2 dígitos
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Dia com 2 dígitos
    const horas = String(dataAtual.getHours()).padStart(2, '0'); // Horas com 2 dígitos
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0'); // Minutos com 2 dígitos
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0'); // Segundos com 2 dígitos
    const sequenciaNumeros = `${ano}${mes}${dia}${horas}${minutos}${segundos}`; // Exemplo: "20241030235959" para 30 de outubro de 2024 às 23:59:59
    before(() => {
        usuarioController = new UsuarioController();
    });

    it('Cria um usuário no banco', async () => {
        const result = await usuarioController.criarUsuario('LG Souza', 'lgsouza'+sequenciaNumeros+'@example.com', 'passWord@123', 'moderador');
        assert.strictEqual(typeof result.usuario.id, 'number'); // Verifica se 'id' é um número
        assert.strictEqual(result.usuario.nome, 'LG Souza'); // Verifica se o nome é igual ao esperado
    });

    it('Recupera um usuário no banco pelo ID', async () => {
        const createdUser = await usuarioController.criarUsuario('LG lgzito', 'lgzito'+sequenciaNumeros+ '@example.com', 'passWord@123', 'estudante');
        const retrievedUser = await usuarioController.listarUsuarioPorId(createdUser.usuario.id);

        assert.deepStrictEqual(retrievedUser, createdUser); // Verifica se o usuário recuperado é igual ao criado
    });

    it('Atualiza um usuário no banco', async () => {
        const createdUser = await usuarioController.criarUsuario('Lorenzo Doe', 'lorenzo'+sequenciaNumeros+'@example.com', 'passWord@123', 'estudante');
        const updated = await usuarioController.atualizarUsuario(createdUser.usuario.id, 'Lorenzo Updated', 'lorenzoUpdate'+sequenciaNumeros+'@example.com', 'newpassWord*123', 'moderador');
        assert.strictEqual(updated.sucesso, true); // Verifica se a atualização foi bem-sucedida
        const updatedUser = await usuarioController.listarUsuarioPorId(createdUser.usuario.id);
        assert.strictEqual(updatedUser.usuario.nome, 'Lorenzo Updated'); // Verifica se o nome foi atualizado
    });

    it('Delete um usuário do banco', async () => {
        const createdUser = await usuarioController.criarUsuario('Delete User', 'deleteuser'+sequenciaNumeros+ '@example.com', 'passWord@123', 'moderador');
        const deleted = await usuarioController.deletarUsuario(createdUser.usuario.id);
        assert.strictEqual(deleted.sucesso, true); // Verifica se a deleção foi bem-sucedida
        const retrievedUser = await usuarioController.listarUsuarioPorId(createdUser.id);
        assert.strictEqual(retrievedUser.sucesso, false); // Verifica se o usuário foi realmente deletado
    });
});