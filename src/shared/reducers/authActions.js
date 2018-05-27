export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const TOKEN = 'TOKEN';

export const login = (payload) => {
  return { type: LOGIN, payload };
}

export const token = (payload) => {
  return { type: TOKEN, payload };
}

export const logout = () => {
  return { type: LOGOUT };
}