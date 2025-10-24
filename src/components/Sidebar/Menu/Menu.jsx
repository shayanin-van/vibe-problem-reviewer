import styles from "./Menu.module.css";
import { useState, useEffect, useRef } from "react";

function Menu({ isShowed, setIsShowed, problemsStructure, onProblemSelect }) {
  const [expandedUnits, setExpandedUnits] = useState({});
  const [expandedKaiSubtopics, setExpandedKaiSubtopics] = useState({});
  const [expandedKaiLevels, setExpandedKaiLevels] = useState({});
  const [expandedTemplates, setExpandedTemplates] = useState({});
  const menuRef = useRef(null);

  const toggleUnit = (unit) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unit]: !prev[unit],
    }));
  };

  const toggleKaiSubtopic = (unit, kaiSubtopic) => {
    const key = `${unit}-${kaiSubtopic}`;
    setExpandedKaiSubtopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleKaiLevel = (unit, kaiSubtopic, kaiLevel) => {
    const key = `${unit}-${kaiSubtopic}-${kaiLevel}`;
    setExpandedKaiLevels((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const toggleTemplate = (unit, kaiSubtopic, kaiLevel, template) => {
    const key = `${unit}-${kaiSubtopic}-${kaiLevel}-${template}`;
    setExpandedTemplates((prev) => ({
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

  //////////////////// before adding template dropdown //////////////////////////////////
  // return (
  //   <div
  //     ref={menuRef}
  //     className={styles.menu}
  //     style={{ display: isShowed ? "block" : "none" }}
  //   >
  //     <div className={styles.header}>
  //       <h2>โจทย์</h2>
  //       <button onClick={() => setIsShowed(false)}>←</button>
  //     </div>

  //     <div className={styles.navigation}>
  //       {Object.keys(problemsStructure).map((unit) => (
  //         <div key={unit} className={styles.unitSection}>
  //           <div className={styles.unitHeader} onClick={() => toggleUnit(unit)}>
  //             <span className={styles.arrow}>
  //               {expandedUnits[unit] ? "▼" : "▶"}
  //             </span>
  //             <span>{unit}</span>
  //           </div>

  //           {expandedUnits[unit] && (
  //             <div className={styles.kaiSubtopics}>
  //               {Object.keys(problemsStructure[unit]).map((kaiSubtopic) => {
  //                 const kaiSubtopicKey = `${unit}-${kaiSubtopic}`;
  //                 return (
  //                   <div
  //                     key={kaiSubtopic}
  //                     className={styles.kaiSubtopicSection}
  //                   >
  //                     <div
  //                       className={styles.kaiSubtopicHeader}
  //                       onClick={() => toggleKaiSubtopic(unit, kaiSubtopic)}
  //                     >
  //                       <span className={styles.arrow}>
  //                         {expandedKaiSubtopics[kaiSubtopicKey] ? "▼" : "▶"}
  //                       </span>
  //                       <span>{kaiSubtopic}</span>
  //                     </div>

  //                     {expandedKaiSubtopics[kaiSubtopicKey] && (
  //                       <div className={styles.kaiLevels}>
  //                         {Object.keys(
  //                           problemsStructure[unit][kaiSubtopic]
  //                         ).map((kaiLevel) => {
  //                           const kaiLevelKey = `${unit}-${kaiSubtopic}-${kaiLevel}`;
  //                           return (
  //                             <div
  //                               key={kaiLevel}
  //                               className={styles.kaiLevelSection}
  //                             >
  //                               <div
  //                                 className={styles.kaiLevelHeader}
  //                                 onClick={() =>
  //                                   toggleKaiLevel(unit, kaiSubtopic, kaiLevel)
  //                                 }
  //                               >
  //                                 <span className={styles.arrow}>
  //                                   {expandedKaiLevels[kaiLevelKey] ? "▼" : "▶"}
  //                                 </span>
  //                                 <span>{kaiLevel}</span>
  //                               </div>
  //                               {expandedKaiLevels[kaiLevelKey] && (
  //                                 <div className={styles.problems}>
  //                                   {problemsStructure[unit][kaiSubtopic][
  //                                     kaiLevel
  //                                   ].map((problem) => {
  //                                     const questionPreview = problem.question
  //                                       ? problem.question.substring(0, 50) +
  //                                         (problem.question.length > 50
  //                                           ? "..."
  //                                           : "")
  //                                       : "ไม่มีโจทย์";
  //                                     return (
  //                                       <div
  //                                         key={problem.id}
  //                                         className={`${styles.problemItem} ${
  //                                           problem.isReviewed
  //                                             ? styles.reviewedProblem
  //                                             : ""
  //                                         }`}
  //                                         onClick={() =>
  //                                           handleProblemClick(problem)
  //                                         }
  //                                       >
  //                                         {questionPreview}
  //                                         {problem.isReviewed && (
  //                                           <span
  //                                             className={styles.reviewedBadge}
  //                                           >
  //                                             ✓
  //                                           </span>
  //                                         )}
  //                                       </div>
  //                                     );
  //                                   })}
  //                                 </div>
  //                               )}
  //                             </div>
  //                           );
  //                         })}
  //                       </div>
  //                     )}
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

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
              <div className={styles.kaiSubtopics}>
                {Object.keys(problemsStructure[unit]).map((kaiSubtopic) => {
                  const kaiSubtopicKey = `${unit}-${kaiSubtopic}`;
                  return (
                    <div
                      key={kaiSubtopic}
                      className={styles.kaiSubtopicSection}
                    >
                      <div
                        className={styles.kaiSubtopicHeader}
                        onClick={() => toggleKaiSubtopic(unit, kaiSubtopic)}
                      >
                        <span className={styles.arrow}>
                          {expandedKaiSubtopics[kaiSubtopicKey] ? "▼" : "▶"}
                        </span>
                        <span>{kaiSubtopic}</span>
                      </div>

                      {expandedKaiSubtopics[kaiSubtopicKey] && (
                        <div className={styles.kaiLevels}>
                          {Object.keys(
                            problemsStructure[unit][kaiSubtopic]
                          ).map((kaiLevel) => {
                            const kaiLevelKey = `${unit}-${kaiSubtopic}-${kaiLevel}`;
                            return (
                              <div
                                key={kaiLevel}
                                className={styles.kaiLevelSection}
                              >
                                <div
                                  className={styles.kaiLevelHeader}
                                  onClick={() =>
                                    toggleKaiLevel(unit, kaiSubtopic, kaiLevel)
                                  }
                                >
                                  <span className={styles.arrow}>
                                    {expandedKaiLevels[kaiLevelKey] ? "▼" : "▶"}
                                  </span>
                                  <span>{kaiLevel}</span>
                                </div>
                                {expandedKaiLevels[kaiLevelKey] && (
                                  <div className={styles.template}>
                                    {Object.keys(
                                      problemsStructure[unit][kaiSubtopic][
                                        kaiLevel
                                      ]
                                    ).map((template) => {
                                      const templateKey = `${unit}-${kaiSubtopic}-${kaiLevel}-${template}`;
                                      return (
                                        <div
                                          key={templateKey}
                                          className={styles.templateSection}
                                        >
                                          <div
                                            className={styles.templateHeader}
                                            onClick={() =>
                                              toggleTemplate(
                                                unit,
                                                kaiSubtopic,
                                                kaiLevel,
                                                template
                                              )
                                            }
                                          >
                                            <span className={styles.arrow}>
                                              {expandedTemplates[templateKey]
                                                ? "▼"
                                                : "▶"}
                                            </span>
                                            <span>
                                              {"template " + template}
                                            </span>
                                          </div>
                                          {expandedTemplates[templateKey] && (
                                            <div className={styles.problems}>
                                              {problemsStructure[unit][
                                                kaiSubtopic
                                              ][kaiLevel][template].map(
                                                (problem) => {
                                                  const questionPreview =
                                                    problem.question
                                                      ? problem.question.substring(
                                                          0,
                                                          50
                                                        ) +
                                                        (problem.question
                                                          .length > 50
                                                          ? "..."
                                                          : "")
                                                      : "ไม่มีโจทย์";
                                                  return (
                                                    <div
                                                      key={problem.id}
                                                      className={`${
                                                        styles.problemItem
                                                      } ${
                                                        problem.isReviewed
                                                          ? styles.reviewedProblem
                                                          : ""
                                                      }`}
                                                      onClick={() =>
                                                        handleProblemClick(
                                                          problem
                                                        )
                                                      }
                                                    >
                                                      {questionPreview}
                                                      {problem.isReviewed && (
                                                        <span
                                                          className={
                                                            styles.reviewedBadge
                                                          }
                                                        >
                                                          ✓
                                                        </span>
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
