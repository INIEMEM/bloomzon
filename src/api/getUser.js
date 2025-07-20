// api/getUser.js
import axios from 'axios';

export const getUser = async (baseUrl, token) => {
  try {
    const response = await axios.get(`${baseUrl}auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('the data response', response.data.data.user)
    return response.data.data;
  } catch (error) {
  
    throw new Error('Unauthorized');
  }
};
