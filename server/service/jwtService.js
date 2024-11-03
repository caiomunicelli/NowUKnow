const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY;

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send('Unauthorized');
        }
        req.usuarioId = decoded.UsuarioId;
        next();
    });
}

module.exports = verifyJWT;
