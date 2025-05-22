import BASE_URL from "@/utils/baseUrl";
import axios from "axios";
const AUTH_API = `${BASE_URL}`;

export const commonService = {
  
  getAll: async (parentKey: string, params: any) => {
    return await axios.get(`${BASE_URL}/${parentKey}`, { params: params });
  },

  getAllByDestinationId: async (parentKey: string, destinationId: string) => {
    const response = await axios.get(
      `${BASE_URL}/${parentKey}?destinationId=${destinationId}`
    );
    return response.data;
  },

  getItemById: async (parentKey: string, id: string) => {
    const response = await axios.get(`${BASE_URL}/${parentKey}/${id}`);
    return response.data;
  },
};
