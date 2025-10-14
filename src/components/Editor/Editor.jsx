import styles from "./Editor.module.css";
import { useState } from "react";
import { updateProblem } from "../../firebase/firestoreService";

function Editor({
  problem,
  onQuestionChange,
  onChoicesChange,
  onAnswerChange,
  onSolutionChange,
  onHintChange,
  onReviewStatusChange,
  onSaveSuccess,
}) {
  const [lastSavedProblem, setlastSavedProblem] = useState(problem);
  const [saving, setSaving] = useState(false);

  const saveButton = () => {
    if (problem === lastSavedProblem) {
      return <button disabled>save</button>;
    } else if (saving) {
      return <button disabled>saving...</button>;
    } else {
      return <button onClick={handleSave}>save</button>;
    }
  };

  const handleSave = async () => {
    if (!problem.id) {
      alert("No problem selected to save");
      return;
    }

    setSaving(true);
    try {
      await updateProblem(problem.id, {
        question: problem.question,
        choices: problem.choices,
        hint: problem.hint,
        answer: problem.answer,
        solution: problem.solution,
        isReviewed: problem.isReviewed,
      });
      setlastSavedProblem(problem);
      // alert("Problem saved successfully!");
      if (onSaveSuccess) {
        await onSaveSuccess();
      }
    } catch (error) {
      console.error("Failed to save problem:", error);
      alert("Failed to save problem. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const choices = problem.choices.map((choice, index) => {
    return (
      <textarea
        key={index}
        data-index={index}
        value={choice}
        rows="1"
        onChange={onChoicesChange}
      ></textarea>
    );
  });

  return (
    <div className={styles.editor}>
      <h3 style={{ margin: "-5px 0px 6px 0px" }}>โจทย์</h3>
      <textarea
        value={problem.question}
        onChange={onQuestionChange}
        rows="10"
      />
      <h3 style={{ margin: "10px 0px 6px 0px" }}>ตัวเลือก</h3>
      {choices}
      <h3 style={{ margin: "10px 0px 6px 0px" }}>คำใบ้</h3>
      <textarea value={problem.hint} onChange={onHintChange} rows="3" />
      <h3 style={{ margin: "10px 0px 6px 0px" }}>ตัวเลือกที่ถูก</h3>
      <input
        type="number"
        min={1}
        max={problem.choices.length}
        value={problem.answer + 1}
        onChange={onAnswerChange}
      ></input>
      <h3 style={{ margin: "10px 0px 6px 0px" }}>เฉลยละเอียด</h3>
      <textarea
        value={problem.solution}
        onChange={onSolutionChange}
        rows="22"
      />
      <div style={{ margin: "10px 0px 6px 0px" }}>
        <label>
          <input
            type="checkbox"
            checked={problem.isReviewed}
            onChange={onReviewStatusChange}
          />
          ตรวจแล้ว
        </label>
        {saveButton()}
      </div>
    </div>
  );
}

export default Editor;
