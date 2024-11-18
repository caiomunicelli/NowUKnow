const About = require("../entities/about.js");

class AboutController {
  listarAutores() {
    const arthur = new About("Arthur Siqueira da Cunha", "081210013");
    const caio = new About("Caio Henrique Diniz Municelli", "081210002");
    const lorenzo = new About("Lorenzo Messias Lacerda", "081210028");
    const lg = new About("Luiz Guilherme de Souza", "081210010");
    const lista = [arthur, caio, lorenzo, lg];
    return lista;
  }
}

module.exports = AboutController;
