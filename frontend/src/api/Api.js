const apiPath = 'http://localhost:8000'

const path = {
  auth: {
    signUp: () => `${apiPath}/auth/register`,
    signIn: () => `${apiPath}/auth/login`,
    logOut: () => `${apiPath}/auth/logout/`,
  },
  folder: {
    listRandom: ({userId, limit}) => `${apiPath}/folders/list/${userId}?limit=${limit}`,
    getAll: () => `${apiPath}/folders/`,
    today: () => `${apiPath}/folders/today`,
    create: () => `${apiPath}/folders/`,
    getDetail: ({folderId}) => `${apiPath}/folders/${folderId}`,
    update: ({folderId}) => `${apiPath}/folders/${folderId}`,
    delete: ({folderId}) => `${apiPath}/folders/${folderId}`,
    addCourse: ({folderId, courseId}) => `${apiPath}/folders/add-course/${folderId}/${courseId}`,
    deleteCourse: ({folderId, courseId}) => `${apiPath}/folders/delete-course/${folderId}/${courseId}`,
  },
  course: {
    listRandom: ({userId, limit}) => `${apiPath}/courses/list/${userId}?limit=${limit}`,
    getAll: () => `${apiPath}/courses/`,
    today: () => `${apiPath}/courses/today`,
    create: () => `${apiPath}/courses/`,
    getDetail: ({courseId}) => `${apiPath}/courses/${courseId}`,
    update: ({courseId}) => `${apiPath}/courses/${courseId}`,
    delete: ({courseId}) => `${apiPath}/courses/${courseId}`,
  },
  user: {
    getAll: () => `${apiPath}/users/`,
    getUser: ({userId}) => `${apiPath}/users/${userId}`,
    delete: ({userId}) => `${apiPath}/users/${userId}`,
  },
  utils: {
    search: ({query}) => `${apiPath}/other/search/${query}`,
    study: ({courseId}) => `${apiPath}/other/score/${courseId}`,
    statistics: () => `${apiPath}/other/statistics`,
  }
}

export default path
