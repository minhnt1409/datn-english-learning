const apiPath = 'http://localhost:8000'

const path = {
  auth: {
    signUp: () => `${apiPath}/auth/register`,
    signIn: () => `${apiPath}/auth/login`,
    logOut: () => `${apiPath}/auth/logout`,
  },
  folder: {
    listRandom: ({userId, limit}) => `${apiPath}/folders/list/${userId}?limit=${limit}`,
    delete: ({folderId}) => `${apiPath}/folders/${folderId}`,
  },
  course: {
    listRandom: ({userId, limit}) => `${apiPath}/courses/list/${userId}?limit=${limit}`,
    delete: ({courseId}) => `${apiPath}/courses/${courseId}`,
  },
  user: {
    getUser: ({userId}) => `${apiPath}/users/${userId}`,
  },
}

export default path
