import axios from "axios";

export const BASE_URL = "https://emadhyam-backend.onrender.com";

// export const BASE_URL = "http://192.168.1.3:5000";
// export const BASE_URL = "http://192.168.186.101:5000";

export const getData = async (url: string, token: string | null) => {
  let headerObj: any = {};
  if (token) {
    headerObj = {
      ...headerObj,
      "Content-Type": "application/json",
      token: `Bearer ${token}`,
    };
  }
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: headerObj,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to handle it in the calling function
  }
};

export const postData = async (
  url: string,
  data: any,
  token: string | null,
  type: string | null
) => {
  let headerObj: any = {};
  if (token) {
    headerObj = {
      ...headerObj,
      token: `Bearer ${token}`,
    };
  }
  if (type === "media") {
    headerObj = {
      ...headerObj,
      "Content-Type": "multipart/form-data",
    };
  }
  try {
    const response = await axios.post(`${BASE_URL}${url}`, data, {
      headers: headerObj,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to handle it in the calling function
  }
};

export const putData = async (
  url: string,
  data: any,
  token: string | null,
  type?: string | null
) => {
  let headerObj: any = {};
  if (token) {
    headerObj = {
      ...headerObj,
      token: `Bearer ${token}`,
    };
  }
  if (type === "media") {
    headerObj = {
      ...headerObj,
      "Content-Type": "multipart/form-data",
    };
  }
  try {
    const response = await axios.put(`${BASE_URL}${url}`, data, {
      headers: headerObj,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to handle it in the calling function
  }
};

export const deleteData = async (url: string, token: string | null) => {
  let headerObj: any = {};
  if (token) {
    headerObj = {
      ...headerObj,
      token: `Bearer ${token}`,
    };
  }
  try {
    const response = await axios.delete(`${BASE_URL}${url}`, {
      headers: headerObj,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to handle it in the calling function
  }
};
