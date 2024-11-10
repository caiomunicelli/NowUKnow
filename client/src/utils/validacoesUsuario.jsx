const regex_num = /\d+/;
const regex_caracteres_especiais = /[!@#$%^&*(),.?":{}|<>+\-+=\\\/\[\]`~;]/;
const regex_maiusculo = /[A-Z]/;
const regex_minusculo = /[a-z]/;
const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regex_usuario = /^[a-zA-Z0-9-_]+$/;
const extensoes_aceitas = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function validarNome(nome) {
  if (!nome) {
    return { isValid: false, message: "Preencha o campo de nome." };
  }
  if (regex_num.test(nome) || regex_caracteres_especiais.test(nome)) {
    return {
      isValid: false,
      message: "O nome não pode conter números ou caracteres especiais.",
    };
  }
  const nomes = nome.trim().split(" ");
  if (nomes.length < 2) {
    return {
      isValid: false,
      message: "O campo nome deve incluir o sobrenome.",
    };
  }
  return { isValid: true, message: "" };
}

export function validarSenha(senha) {
  if (!senha) {
    return { isValid: false, message: "Preencha o campo de senha." };
  }
  if (senha.includes(" ")) {
    return { isValid: false, message: "A senha não pode conter espaços." };
  }
  if (
    senha.length < 8 ||
    !regex_num.test(senha) ||
    !regex_maiusculo.test(senha) ||
    !regex_caracteres_especiais.test(senha) ||
    !regex_minusculo.test(senha)
  ) {
    return {
      isValid: false,
      message:
        "A senha deve incluir ao menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
    };
  }
  return { isValid: true, message: "" };
}

export function validarConfirmSenha(confirmSenha, senha) {
  if (senha !== confirmSenha) {
    return {
      isValid: false,
      message: "As senhas não coincidem.",
    };
  } else {
    return { isValid: true, message: "" };
  }
}

export function validarEmail(email) {
  if (!email) {
    return { isValid: false, message: "Preencha o campo de email." };
  }
  if (email.includes(" ")) {
    return { isValid: false, message: "O email não pode conter espaços." };
  }
  if (!regex_email.test(email)) {
    return { isValid: false, message: "Você deve inserir um email válido." };
  }
  return { isValid: true, message: "" };
}

export function validarUsuario(usuario) {
  if (!usuario) {
    return { isValid: false, message: "Preencha o campo de nome de usuário." };
  }

  if (!regex_usuario.test(usuario) || usuario.includes(" ")) {
    return {
      isValid: false,
      message:
        "O nome de usuário pode conter apenas letras, números, '-' e '_'.",
    };
  }
  if (usuario.length < 6) {
    return {
      isValid: false,
      message: "O nome de usuário deve conter pelo menos 6 carácteres.",
    };
  }
  return { isValid: true, message: "" };
}

export function validarFoto(foto) {
  if (!foto) {
    return { isValid: true, message: "" }; // Foto não é obrigatória, então retorna válida se estiver ausente
  }
  if (!extensoes_aceitas.includes(foto.type)) {
    return {
      isValid: false,
      message:
        "Formato de imagem inválido. Apenas PNG, JPG, GIF e WEBP são permitidos.",
    };
  }
  return { isValid: true, message: "" };
}

export const gerenciarErros = (
  nome,
  usuario,
  email,
  senha,
  confirmSenha,
  foto,
  campoAlterado,
  errosAtuais
) => {
  const errors = { ...errosAtuais };

  switch (campoAlterado) {
    case "nome":
      errors.nome = validarNome(nome).message;
      break;
    case "usuario":
      errors.usuario = validarUsuario(usuario).message;
      break;
    case "email":
      errors.email = validarEmail(email).message;
      break;
    case "senha":
      errors.senha = validarSenha(senha).message;
      errors.confirmSenha = validarConfirmSenha(confirmSenha, senha).message;
      break;
    case "confirmSenha":
      errors.confirmSenha = validarConfirmSenha(confirmSenha, senha).message;
      break;
    case "foto":
      errors.foto = validarFoto(foto).message;
      break;
    case "cadastro":
      errors.nome = validarNome(nome).message;
      errors.usuario = validarUsuario(usuario).message;
      errors.email = validarEmail(email).message;
      errors.senha = validarSenha(senha).message;
      errors.confirmSenha = validarConfirmSenha(confirmSenha, senha).message;
      errors.foto = validarFoto(foto).message;
      break;
    default:
      break;
  }
  return errors;
};
