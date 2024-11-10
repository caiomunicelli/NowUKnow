import Cookies from "js-cookie";

const TOKEN = "authToken";

export const saveToken = (token) => {
  Cookies.set(TOKEN, token, {
    expires: 30,
    secure: true,
    sameSite: "Strict",
    path: "/",
    httpOnly: false,
  });
};

export const getToken = () => {
  return Cookies.get(TOKEN);
};

export const clearToken = () => {
  Cookies.remove(TOKEN, { path: "/" });
};
