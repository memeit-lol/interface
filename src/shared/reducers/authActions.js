export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

/**
 * Adds the user into the redux store.
 * @param {Object} payload - An object with the properties user, username, isLogged and isMod.
 * @returns {Object} - Returns a redux action.
 */
export const login = (payload) => {
  return { type: LOGIN, payload };
}

/**
 * Logs out a user, deleting their info from the redux store.
 * @returns {Object} - Returns a redux action.
 */
export const logout = () => {
  return { type: LOGOUT };
}