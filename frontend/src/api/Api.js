const apiPath = 'http://localhost:8000'

const path = {
  auth: {
    signUp: () => `${apiPath}/auth/register`,
    signIn: () => `${apiPath}/auth/login`,
    logOut: () => `${apiPath}/auth/logout`,
  },
  folder: {
    listRandom: ({userId, limit}) => `${apiPath}/folders/list/${userId}?limit=${limit}`,
  },
  course: {
    listRandom: ({userId, limit}) => `${apiPath}/courses/list/${userId}?limit=${limit}`,
  },
}

export default path
