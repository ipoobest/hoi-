import axios from "@/api/axios.js";
import _ from "lodash";

export const uploadOne = async data => {
  const formData = new FormData();
  _.forOwn(data, (value, key) => {
    formData.append(key, value);
  });
  return await axios.post("upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteFile = async fileId => {
  return await axios.delete("upload/files/" + fileId);
};

export const getFile = async fileId => {
  const response = await axios.get("upload/files/" + fileId);
  return response.data;
};
