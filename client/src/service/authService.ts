import BASE_URL from "@/utils/baseUrl";
import axios from "axios";
const AUTH_API = `${BASE_URL}/auth`;

export const authService = {
  
  create: (parentKey: string, payload: any) => {
    const response = axios.post(`${AUTH_API}/${parentKey}`, payload);
    return response;
  },
};
