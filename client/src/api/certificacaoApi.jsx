export const getCertificacoes = async () => {
    try {
      const response = await fetch("/api/v1/certificacoes/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Erro ao buscar certificações:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar certificações:", error);
      return null;
    }
  };