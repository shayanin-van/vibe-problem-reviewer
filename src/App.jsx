import { useState, useEffect } from "react";
import "./App.css";
import Preview from "./components/Preview/Preview";
import Editor from "./components/Editor/Editor";
import Sidebar from "./components/Sidebar/Sidebar";
import { fetchProblemsStructure } from "./firebase/firestoreService";

function App() {
  const [problem, setProblem] = useState({
    id: null,
    question: "โจจจจจจจจจจจจจจจทย์",
    choices: ["a", "b", "c", "d"],
    hint: "ใบบบบบบบบบบบบบบบบบบ้",
    answer: 3,
    solution: "เฉลยยยยยยยยยยยยยยยยยย",
    isReviewed: false,
  });

  const [problemsStructure, setProblemsStructure] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const structure = await fetchProblemsStructure();
      setProblemsStructure(structure);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load problems:", error);
      setLoading(false);
    }
  };

  const handleProblemSelect = (selectedProblem) => {
    setProblem({
      id: selectedProblem.id,
      question: selectedProblem.question || "",
      choices: selectedProblem.choices || ["", "", "", ""],
      hint: selectedProblem.hint || "",
      answer: selectedProblem.answer || 0,
      solution: selectedProblem.solution || "",
      isReviewed: selectedProblem.isReviewed || false,
    });
  };

  const handleQuestionChange = (e) => {
    setProblem((prevProblem) => ({ ...prevProblem, question: e.target.value }));
  };

  const handleChoicesChange = (e) => {
    const index = parseInt(e.target.dataset.index, 10);
    const newChoices = [...problem.choices];
    newChoices[index] = e.target.value;

    setProblem((prevProblem) => ({ ...prevProblem, choices: newChoices }));
  };

  const handleHintChange = (e) => {
    setProblem((prevProblem) => ({ ...prevProblem, hint: e.target.value }));
  };

  const handleAnswerChange = (e) => {
    setProblem((prevProblem) => ({
      ...prevProblem,
      answer: parseInt(e.target.value - 1, 10),
    }));
  };

  const handleSolutionChange = (e) => {
    setProblem((prevProblem) => ({ ...prevProblem, solution: e.target.value }));
  };

  const handleReviewStatusChange = () => {
    setProblem((prevProblem) => ({
      ...prevProblem,
      isReviewed: !prevProblem.isReviewed,
    }));
  };

  return (
    <>
      <Sidebar
        problemsStructure={problemsStructure}
        onProblemSelect={handleProblemSelect}
      ></Sidebar>
      <h1>Problems Reviewer</h1>
      {loading ? (
        <p>Loading problems...</p>
      ) : (
        <div className="workArea">
          <Editor
            problem={problem}
            onQuestionChange={handleQuestionChange}
            onChoicesChange={handleChoicesChange}
            onHintChange={handleHintChange}
            onAnswerChange={handleAnswerChange}
            onSolutionChange={handleSolutionChange}
            onReviewStatusChange={handleReviewStatusChange}
            onSaveSuccess={loadProblems}
          ></Editor>
          <Preview problem={problem}></Preview>
        </div>
      )}
    </>
  );
}

export default App;
