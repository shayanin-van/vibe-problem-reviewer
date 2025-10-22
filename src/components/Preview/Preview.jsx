import styles from "./Preview.module.css";
import { useEffect } from "react";
import { splitByJson } from "../../tools/utils/splitByJson";
import Diagram from "./Diagram/Diagram";

function Preview({ problem }) {
  useEffect(() => {
    MathJax.typeset();
  }, [problem]);

  const splittedQuestion = splitByJson(problem.question);
  const question = splittedQuestion.map((item, index) => {
    if (item.type === "text") {
      return <p key={index}>{item.text}</p>;
    } else if (item.type === "jsonObj") {
      return <Diagram key={index} objJson={item.jsonObj}></Diagram>;
    }
  });

  const choices = [];
  for (let i = 0; i < problem.choices.length; i++) {
    choices.push(<p key={i}>{i + 1 + ". " + problem.choices[i]}</p>);
  }

  const hint = <p>{"คำใบ้ : " + problem.hint}</p>;

  const answerNum = problem.answer + 1;
  const answer = <p>{"เฉลยหยาบ : " + answerNum}</p>;

  const splittedSolution = splitByJson(problem.solution);
  const solution = splittedSolution.map((item, index) => {
    if (item.type === "text") {
      return <p key={index}>{item.text}</p>;
    } else if (item.type === "jsonObj") {
      return <Diagram key={index} objJson={item.jsonObj}></Diagram>;
    }
  });

  return (
    <div className={styles.preview}>
      {question}
      {choices}
      {hint}
      {answer}
      {solution}
    </div>
  );
}

export default Preview;
