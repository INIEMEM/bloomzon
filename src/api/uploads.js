import axios from "axios";
import { TALENT_BASE_URL } from "./config";

export const uploadTalentImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${TALENT_BASE_URL}/UploadImage/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.url;
};

export const uploadTalentVideo = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${TALENT_BASE_URL}/UploadVideo/`, formData, {
    onUploadProgress,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.url;
};
