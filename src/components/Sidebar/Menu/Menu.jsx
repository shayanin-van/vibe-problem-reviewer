import styles from "./Menu.module.css";
import { useState, useEffect, useRef } from "react";

function Menu({ isShowed, setIsShowed, problemsStructure, onProblemSelect }) {
  const [expandedUnits, setExpandedUnits] = useState({});
  const [expandedPGreatSubtopics, setExpandedPGreatSubtopics] = useState({});
  const [expandedKaiLevels, setExpandedKaiLevels] = useState({});
  const menuRef = useRef(null);

  const toggleUnit = (unit) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unit]: !prev[unit],
    }));
  };

  const togglePGreatSubtopic = (unit, pGreatSubtopic) => {
    const key = `${unit}-${pGreatSubtopic}`;
    setExpandedPGreatSubtopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleKaiLevel = (unit, pGreatSubtopic, kaiLevel) => {
    const key = `${unit}-${pGreatSubtopic}-${kaiLevel}`;
    setExpandedKaiLevels((prev) => ({
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
              <div className={styles.pGreatSubtopics}>
                {Object.keys(problemsStructure[unit]).map((pGreatSubtopic) => {
                  const pGreatSubtopicKey = `${unit}-${pGreatSubtopic}`;
                  return (
                    <div
                      key={pGreatSubtopic}
                      className={styles.pGreatSubtopicSection}
                    >
                      <div
                        className={styles.pGreatSubtopicHeader}
                        onClick={() =>
                          togglePGreatSubtopic(unit, pGreatSubtopic)
                        }
                      >
                        <span className={styles.arrow}>
                          {expandedPGreatSubtopics[pGreatSubtopicKey]
                            ? "▼"
                            : "▶"}
                        </span>
                        <span>{pGreatSubtopic}</span>
                      </div>

                      {expandedPGreatSubtopics[pGreatSubtopicKey] && (
                        <div className={styles.kaiLevels}>
                          {Object.keys(
                            problemsStructure[unit][pGreatSubtopic]
                          ).map((kaiLevel) => {
                            const kaiLevelKey = `${unit}-${pGreatSubtopic}-${kaiLevel}`;
                            return (
                              <div
                                key={kaiLevel}
                                className={styles.kaiLevelSection}
                              >
                                <div
                                  className={styles.kaiLevelHeader}
                                  onClick={() =>
                                    toggleKaiLevel(
                                      unit,
                                      pGreatSubtopic,
                                      kaiLevel
                                    )
                                  }
                                >
                                  <span className={styles.arrow}>
                                    {expandedKaiLevels[kaiLevelKey] ? "▼" : "▶"}
                                  </span>
                                  <span>{kaiLevel}</span>
                                </div>
                                {expandedKaiLevels[kaiLevelKey] && (
                                  <div className={styles.problems}>
                                    {problemsStructure[unit][pGreatSubtopic][
                                      kaiLevel
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
                          })}
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
