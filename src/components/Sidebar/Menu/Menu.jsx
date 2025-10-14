import styles from "./Menu.module.css";
import { useState, useEffect, useRef } from "react";

function Menu({ isShowed, setIsShowed, problemsStructure, onProblemSelect }) {
  const [expandedUnits, setExpandedUnits] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});
  const menuRef = useRef(null);

  const toggleUnit = (unit) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unit]: !prev[unit],
    }));
  };

  const toggleLesson = (unit, lesson) => {
    const key = `${unit}-${lesson}`;
    setExpandedLessons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSubtopic = (unit, lesson, subtopic) => {
    const key = `${unit}-${lesson}-${subtopic}`;
    setExpandedSubtopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleProblemClick = (problem) => {
    onProblemSelect(problem);
    // setIsShowed(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsShowed(false);
      }
    };

    if (isShowed) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowed, setIsShowed]);

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      style={{ display: isShowed ? "block" : "none" }}
    >
      <div className={styles.header}>
        <h2>โจทย์</h2>
        <button onClick={() => setIsShowed(false)}>←</button>
      </div>

      <div className={styles.navigation}>
        {Object.keys(problemsStructure).map((unit) => (
          <div key={unit} className={styles.unitSection}>
            <div className={styles.unitHeader} onClick={() => toggleUnit(unit)}>
              <span className={styles.arrow}>
                {expandedUnits[unit] ? "▼" : "▶"}
              </span>
              <span>{unit}</span>
            </div>

            {expandedUnits[unit] && (
              <div className={styles.lessons}>
                {Object.keys(problemsStructure[unit]).map((lesson) => {
                  const lessonKey = `${unit}-${lesson}`;
                  return (
                    <div key={lesson} className={styles.lessonSection}>
                      <div
                        className={styles.lessonHeader}
                        onClick={() => toggleLesson(unit, lesson)}
                      >
                        <span className={styles.arrow}>
                          {expandedLessons[lessonKey] ? "▼" : "▶"}
                        </span>
                        <span>{lesson}</span>
                      </div>

                      {expandedLessons[lessonKey] && (
                        <div className={styles.subtopics}>
                          {Object.keys(problemsStructure[unit][lesson]).map(
                            (subtopic) => {
                              const subtopicKey = `${unit}-${lesson}-${subtopic}`;
                              return (
                                <div
                                  key={subtopic}
                                  className={styles.subtopicSection}
                                >
                                  <div
                                    className={styles.subtopicHeader}
                                    onClick={() =>
                                      toggleSubtopic(unit, lesson, subtopic)
                                    }
                                  >
                                    <span className={styles.arrow}>
                                      {expandedSubtopics[subtopicKey]
                                        ? "▼"
                                        : "▶"}
                                    </span>
                                    <span>{subtopic}</span>
                                  </div>
                                  {expandedSubtopics[subtopicKey] && (
                                    <div className={styles.problems}>
                                      {problemsStructure[unit][lesson][
                                        subtopic
                                      ].map((problem) => {
                                        const questionPreview = problem.question
                                          ? problem.question.substring(0, 50) +
                                            (problem.question.length > 50
                                              ? "..."
                                              : "")
                                          : "ไม่มีโจทย์";
                                        return (
                                          <div
                                            key={problem.id}
                                            className={`${styles.problemItem} ${
                                              problem.isReviewed
                                                ? styles.reviewedProblem
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleProblemClick(problem)
                                            }
                                          >
                                            {questionPreview}
                                            {problem.isReviewed && (
                                              <span
                                                className={styles.reviewedBadge}
                                              >
                                                ✓
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
