import React from "react";
import { Avatar } from "../"; // Certifique-se de que o caminho do arquivo está correto
import "./About.css"; // Arquivo CSS opcional para estilizar a página

const About = () => {
  const integrantes = [
    {
      nome: "Arthur Siqueira da Cunha",
      imagem: "https://nowuknow.s3.sa-east-1.amazonaws.com/devs/arthur.png",
    },
    {
      nome: "Caio Henrique Diniz Municelli",
      imagem: "https://nowuknow.s3.sa-east-1.amazonaws.com/devs/caio.png",
    },
    {
      nome: "Lorenzo Messias Lacerda",
      imagem: "https://nowuknow.s3.sa-east-1.amazonaws.com/devs/lorenzo.jpg",
    },
    {
      nome: "Luiz Guilherme de Souza",
      imagem: "https://nowuknow.s3.sa-east-1.amazonaws.com/devs/luiz.jpg",
    },
  ];

  return (
    <div className="sobre-container">
      <h1>Sobre o Projeto</h1>
      <p>
        Dos criadores da inovativa livraria automatizada iKnow, apresenta-se o
        mais novo projeto: <strong>NowUKnow</strong>, uma rede social
        Open-Source criada com foco na disseminação do conhecimento e
        capacitação de aspirantes para o mercado de trabalho de forma
        democrática e gratuita, com foco em certificações técnicas, com conteúdo
        feito integralmente por usuários, para usuários.
      </p>
      <p>
        Nosso projeto atual procura atender aos Objetivos de Desenvolvimento
        Sustentável (ODS), utilizando a enorme comunidade da internet para
        promover o foco principal na <strong>Educação de Qualidade</strong> e{" "}
        <strong>Redução da Desigualdade</strong>.
      </p>
      <h2>Sobre a Equipe</h2>
      <p>
        Somos estudantes de Engenharia de Computação da{" "}
        <strong>Faculdade Engenheiro Salvador Arena (FESA)</strong>, localizada
        em São Bernardo do Campo. Buscamos sempre incluir em nossos projetos
        questões sociais, trazendo soluções tecnológicas que ampliem a
        acessibilidade à informação e serviços de qualidade. Estamos sempre
        buscando diferentes tecnologias a fim de expandir nossas habilidades e
        conhecimentos arquiteturais e de desenvolvimento.
      </p>
      <div className="integrantes-container">
        {integrantes.map((integrante, index) => (
          <div className="integrante" key={index}>
            <Avatar
              imagem={integrante.imagem}
              nome={integrante.nome}
              tamanho={128}
            />
            <p>{integrante.nome}</p>
          </div>
        ))}
      </div>
      <div className="nowuknow-div-grow"></div>
      <div className="links-container">
        <p>
          <strong>Repositório do GitHub do projeto:</strong>{" "}
          <a
            href="https://github.com/caiomunicelli/NowUKnow"
            target="_blank"
            rel="noopener noreferrer"
          >
            NowUKnow
          </a>
        </p>
        <p>
          <strong>Faculdade Salvador Arena:</strong>{" "}
          <a
            href="https://faculdadesalvadorarena.org.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Faculdade Salvador Arena
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
