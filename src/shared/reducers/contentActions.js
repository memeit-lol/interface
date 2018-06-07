export const ADDPOST = 'ADDPOST'

/**
 * Adds the post into the redux store.
 * @param {Object} payload - An object with the post's data.
 * @returns {Object} - Returns a redux action.
 */
export const addpost = (payload) => {
  return { type: ADDPOST, payload }
}
