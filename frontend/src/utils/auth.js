import axios from 'axios';

export async function getUserRole() {
  try {
    const response = await axios.get('http://localhost:8081/user/getUserData', { withCredentials: true });

    if (response.data.error) {
      console.error(response.data.error);
      return null;
    }

    return response.data.role_id;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export function checkRole(userRole, allowedRoles) {
  return userRole && allowedRoles && allowedRoles.includes(userRole.toString());
}