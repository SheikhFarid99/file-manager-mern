const authContextReducer = (state, action) => {
  const { type, payload } = action
  if (type === 'signup-success' || 'signin-success') {
    return {
      ...state,
      user: payload?.user || "",
      token: payload?.token || ""
    }
  }
  if (type === 'logout') {
    return {
      ...state,
      user: "",
      token: ""
    }
  }
  return state
}

export default authContextReducer