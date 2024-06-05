import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function CourseDetail() {
  const [course, setCourse] = useState();
  const [isUser, setIsUser] = useState(false);
  const { courseId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) {
      alert("No token or userId found. Redirecting to login.");
      navigate("/login");
      return;
    }
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/courses/${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          setIsUser(userId === data.userId)
          localStorage.setItem(`cards_${courseId}`, JSON.stringify(data));
        } else {
          console.error("Failed to fetch cards");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourse();
  }, [courseId, token]);

  return (
    <>
    <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <div className="course-detail__top">
          <div className='course-detail-top-container'>
            <h1 className="course-detail__name">Course: {course?.title}</h1>
            <svg className="xstudy__arrow" onClick={() => navigate(-1)} xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z" /></svg>

          </div>
          <div className="buttons-container">
            <button className="flash-button">
              <Link to={`/flash_card/${courseId}`}>Go to Flash Cards</Link>
            </button>
            <button className="quiz-button">
              <Link to={`/quiz/${courseId}`}>Go to Quiz</Link>
            </button>

          </div>
        </div>
        <h2 className='course-detail__desc'>{course?.description}</h2>
        <h2 className="cards-title">Cards Data</h2>
        <div className="cards-container">
          {course?.cards?.map((card) => (
            <div className="card" key={card._id}>
              <div className="card-key">{card.key}</div>
              <div className="card-value">{card.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CourseDetail;
