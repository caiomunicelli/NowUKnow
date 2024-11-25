// client/src/components/Avatar.jsx
import React from "react";
import ReactAvatar from "react-avatar";
import PropTypes from "prop-types";

const Avatar = ({ imagem, nome, tamanho = 40 }) => {
  const nomeAvatar = nome.split(" ").slice(0, 2).join(" ");

  return imagem ? (
    <img
      src={imagem}
      alt={nome}
      className="avatar-imagem"
      style={{
        width: `${tamanho}px`,
        height: `${tamanho}px`,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <ReactAvatar name={nomeAvatar} size={tamanho} round={true} />
  );
};

Avatar.propTypes = {
  imagem: PropTypes.string,
  nome: PropTypes.string.isRequired,
  tamanho: PropTypes.number,
};

export default Avatar;
