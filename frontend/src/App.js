import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/home/Home';
import Folder from './page/folder/Folder';
import Course from './page/course/Course';
import Profile from './page/profile/Profile';
import CreateCourse from './page/course/create-course/CreateCourse';
import UpdateCourse from './page/course/update-course/UpdateCourse';
import SignIn from './page/sign_in/SignIn';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/folder/:folderId" element={<Folder />} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route path="/update_course/:courseId" element={<UpdateCourse />} />
        <Route path="/create_course" element={<CreateCourse />} />
        <Route path="/folder/:folderId/create_course" element={<CreateCourse />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
