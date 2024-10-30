const assert = require('assert');
const sinon = require('sinon');
const sql = require('mssql');
const DatabaseConnection = require('../../db/databaseConnection.js');
const UserRepository = require('../../controllers/userController.js');

describe('UserController - Unit Tests', () => {
    let userRepository;
    let dbStub;

    beforeEach(() => {
        userRepository = new UserRepository();
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

        const result = await userRepository.createUser('Lorenzo Calca', 'lorenzo@example.com', 'new@Password', 'admin');

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.deepStrictEqual(result, { id: 1, nome: 'Lorenzo Calca', email: 'lorenzo@example.com' }); //Verifica se o usuário foi criado
    });

    it('Recupera todos os usuários', async () => {
        const mockRequest = {
            query: sinon.stub().resolves({ recordset: [{ id: 1, nome: 'LG Souza' }, { id: 2, nome: 'LGzito Souza' }] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await userRepository.getAllUsers();

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.strictEqual(result.length, 2); //Verifica quantidade de registros
    });

    it('Recupera um usuário pelo ID', async () => {
        const mockRequest = {
            input: sinon.stub().returnsThis(),
            query: sinon.stub().resolves({ recordset: [{ id: 1, nome: 'Caio Calca' }] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await userRepository.getUserById(1);

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.deepStrictEqual(result, { id: 1, nome: 'Caio Calca' }); //Verifica se o usuário foi recuperado
    });

    it('Atualiza um usuário existente', async () => {
        const mockRequest = {
            input: sinon.stub().returnsThis(),
            query: sinon.stub().resolves({ rowsAffected: [1] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await userRepository.updateUser(1, 'Arthur Doe', 'arthur@example.com', 'new@Password', 'admin');

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.strictEqual(result, true); //Verifica se o usuário foi atualizado
    });

    it('Deleta um usuário pelo ID', async () => {
        const mockRequest = {
            input: sinon.stub().returnsThis(),
            query: sinon.stub().resolves({ rowsAffected: [1] })
        };
        dbStub.resolves({ request: () => mockRequest });

        const result = await userRepository.deleteUser(1);

        assert.strictEqual(mockRequest.query.calledOnce, true); //Verifica quantidade de chamadas
        assert.strictEqual(result, true); //Verifica se o usuário foi deletado
    });
});
