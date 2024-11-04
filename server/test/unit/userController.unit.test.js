const assert = require('assert');
const sinon = require('sinon');
const sql = require('mssql');
const DatabaseConnection = require('../../db/databaseConnection.js');
const UsuarioController = require('../../controllers/usuarioController.js');
const UserRepository = require('../../service/serviceUsuario');


describe('UserController - Unit Tests', () => {
    let usuarioController;
    let dbStub;

    beforeEach(() => {
        usuarioController = new UsuarioController();
        dbStub = sinon.stub(DatabaseConnection.prototype, 'connect');
    });

    afterEach(() => {
        dbStub.restore();
    });

    it('Cria novo usuário', async () => {
        const mockRequest = {
            input: sinon.stub().returnsThis(),
            query: sinon.stub().resolves({ recordset: [{ id: 1, nome: 'Lorenzo Calca', email: 'lorenzo@example.com' }] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await usuarioController.criarUsuario('Lorenzo Calca', 'lorenzo@example.com', 'new@Password123', 'estudante');

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        console.log(result);
        assert.deepStrictEqual(result, {sucesso:true, usuario: { id: 1,  nome: 'Lorenzo Calca', email: 'lorenzo@example.com' }}); //Verifica se o usuário foi criado
    });

    it('Recupera todos os usuários', async () => {
        const mockRequest = {
            query: sinon.stub().resolves({ recordset: [{ id: 1, nome: 'LG Souza' }, { id: 2, nome: 'LGzito Souza' }] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await usuarioController.listarUsuarios();

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.strictEqual(result.usuario.length, 2); //Verifica quantidade de registros
    });

    it('Recupera um usuário pelo ID', async () => {
        const mockRequest = {
            input: sinon.stub().returnsThis(),
            query: sinon.stub().resolves({ recordset: [{ id: 1, nome: 'Caio Calca' }] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await usuarioController.listarUsuarioPorId(1);

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.deepStrictEqual(result, {sucesso:true, usuario:{ id: 1, nome: 'Caio Calca' }}); //Verifica se o usuário foi recuperado
    });

    it('Atualiza um usuário existente', async () => {
        const mockRequest = {
            input: sinon.stub().returnsThis(),
            query: sinon.stub().resolves({rowsAffected:[1]})
        };
        sinon.stub(UserRepository.prototype, 'getUserById').resolves({ id: 1, nome: 'LG Souza' });
        dbStub.resolves({ request: () => mockRequest });

        const result = await usuarioController.atualizarUsuario(1, 'Arthur Doe', 'arthur@example.com', 'new@Password123', 'admin');

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.deepStrictEqual(result, {  sucesso: true,  usuario: true }); //Verifica se o usuário foi atualizado
    });

    it('Deleta um usuário pelo ID', async () => {
        const mockRequest = {
            input: sinon.stub().returnsThis(),
            query: sinon.stub().resolves({ rowsAffected: [1] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await usuarioController.deletarUsuario(1);

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.deepStrictEqual(result, { mensagem: 'Usuário deletado com sucesso.',  sucesso: true}); //Verifica se o usuário foi deletado
    });
});
