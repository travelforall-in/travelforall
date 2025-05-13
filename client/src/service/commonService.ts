import BASE_URL from "@/utils/baseUrl";
import axios from "axios";
const AUTH_API = `${BASE_URL}`;

export const commonService = {
  getAll: (parentKey: string, params: any) => {
    return axios.get(`${AUTH_API}/${parentKey}`, { params: params });
  },
};
