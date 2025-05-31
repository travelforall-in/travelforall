import BASE_URL from "@/utils/baseUrl";
import axios from "axios";
const AUTH_API = `${BASE_URL}`;

// Helper to get token from localStorage (or cookie)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Or use cookies if that's how you store it
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const commonService = {
  
  getAll: async (parentKey: string, params: any) => {
    return await axios.get(`${BASE_URL}/${parentKey}`, { params: params });
  },



  // getAll: async <T>(parentKey: string, params: any): Promise<{ data: T }> => {
  //   return axios.get(`${BASE_URL}/${parentKey}`, { params });
  // },


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



