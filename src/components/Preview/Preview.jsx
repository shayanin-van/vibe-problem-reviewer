import styles from "./Preview.module.css";
import { splitByJson } from "../../tools/utils/splitByJson";
import Diagram from "./Diagram/Diagram";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function Preview({ problem }) {
  const splittedQuestion = splitByJson(problem.question);
  const question = splittedQuestion.map((item, index) => {
    if (item.type === "text") {
      return (
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          key={index}
        >
          {item.text}
        </Markdown>
      );
    } else if (item.type === "jsonObj") {
      return <Diagram key={index} objJson={item.jsonObj}></Diagram>;
    }
  });

  const choices = [];
  for (let i = 0; i < problem.choices.length; i++) {
    choices.push(
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        key={i}
      >
        {i + 1 + ". " + problem.choices[i]}
      </Markdown>
    );
  }

  const hint = (
    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {"คำใบ้ : " + problem.hint}
    </Markdown>
  );

  const answerNum = problem.answer + 1;
  const answer = <p>{"เฉลยหยาบ : " + answerNum}</p>;

  const splittedSolution = splitByJson(problem.solution);
  const solution = splittedSolution.map((item, index) => {
    if (item.type === "text") {
      return (
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          key={index}
        >
          {item.text}
        </Markdown>
      );
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
