export const createDiscussao = async (discussao, token) => {
    try {
      const response = await fetch("/api/v1/discussoes/", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                    "x-access-token": token
         },
        body: JSON.stringify(discussao),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Erro na discussão:", error);
      return false; // Falha no login
    }
  };