import axios from 'axios';
import getToken from './getToken';

export async function getUserRole() {
  const token = getToken();

  if (token) {
    try {
      const response = await axios.get('http://localhost:8081/user/getUserData', {
        headers: {
          'access-token': token,
        },
      });

      if (response.data.error) {
        console.error(response.data.error);
        return null;
      }

      return response.data.role_id; 
    } catch (error) {
      console.error(error);
    }
  }

  return null;
}

export function checkRole(userRole, allowedRoles) {
  return userRole && allowedRoles && allowedRoles.includes(userRole.toString());
}