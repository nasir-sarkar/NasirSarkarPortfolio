import api from "./axios";

export const getSocialLinks = async () => {
  const res = await api.get("/social-links");
  return res.data;
};