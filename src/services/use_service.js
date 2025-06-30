import { API_URL } from "../helpers/constants";

export const useFetch = async (type) => {
  const response = await fetch(`${API_URL}/${type}`);
  return await response.json();
};

export const useCreate = async (unit, type) => {
  const response = await fetch(`${API_URL}/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unit),
  });
  return await response.json();
};

export const useUpdate = async (id, unit, type) => {
  const response = await fetch(`${API_URL}/${type}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unit),
  });
  return await response.json();
};

export const Usedelete = async (id, type) => {
  const response = await fetch(`${API_URL}/${type}/${id}`, {
    method: "DELETE",
  });
  return response.ok;
};
