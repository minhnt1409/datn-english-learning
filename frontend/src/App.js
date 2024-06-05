import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/home/Home';
import Folder from './page/folder/Folder';
import Course from './page/course/Course';
import SignIn from './page/sign_in/SignIn';
import Header from './components/Header';

function App() {
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </Router>
    )
  }
  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/folder/:folderId" element={<Folder />} />
          <Route path="/course/:courseId" element={<Course />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
