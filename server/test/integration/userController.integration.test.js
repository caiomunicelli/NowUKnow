const assert = require('assert');
const UserRepository = require('../../controllers/userController.js');
describe('UserRepository - Integration Tests', () => {
    let userRepository;

    before(() => {
        userRepository = new UserRepository();
    });

    it('Cria um usuário no banco', async () => {
        const result = await userRepository.createUser('John Doe', 'johndoe@example.com', 'password123', 'moderador');
        assert.strictEqual(typeof result.id, 'number'); // Verifica se 'id' é um número
        assert.strictEqual(result.nome, 'John Doe'); // Verifica se o nome é igual ao esperado
    });

    it('Recupera um usuário no banco pelo ID', async () => {
        const createdUser = await userRepository.createUser('Jane Doe', 'janedoe@example.com', 'password123', 'estudante');
        const retrievedUser = await userRepository.getUserById(createdUser.id);

        assert.deepStrictEqual(retrievedUser, createdUser); // Verifica se o usuário recuperado é igual ao criado
    });

    it('Atualiza um usuário no banco', async () => {
        const createdUser = await userRepository.createUser('Mark Doe', 'markdoe@example.com', 'password123', 'estudante');
        const updated = await userRepository.updateUser(createdUser.id, 'Mark Updated', 'markupdated@example.com', 'newpassword123', 'moderador');
        assert.strictEqual(updated, true); // Verifica se a atualização foi bem-sucedida
        const updatedUser = await userRepository.getUserById(createdUser.id);
        assert.strictEqual(updatedUser.nome, 'Mark Updated'); // Verifica se o nome foi atualizado
    });

    it('Delete um usuário do banco', async () => {
        const createdUser = await userRepository.createUser('Delete User', 'deleteuser@example.com', 'password123', 'moderador');
        const deleted = await userRepository.deleteUser(createdUser.id);
        assert.strictEqual(deleted, true); // Verifica se a deleção foi bem-sucedida
        const retrievedUser = await userRepository.getUserById(createdUser.id);
        assert.strictEqual(retrievedUser, undefined); // Verifica se o usuário foi realmente deletado
    });
});