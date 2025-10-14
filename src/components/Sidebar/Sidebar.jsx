import ShowButton from "./ShowButton/ShowButton";
import Menu from "./Menu/Menu";
import { useState } from "react";

function Sidebar({ problemsStructure, onProblemSelect }) {
  const [isShowed, setIsShowed] = useState(false);

  const onClick = () => {
    setIsShowed(true);
  };

  return (
    <div>
      <ShowButton onClick={onClick}></ShowButton>
      <Menu
        isShowed={isShowed}
        setIsShowed={setIsShowed}
        problemsStructure={problemsStructure}
        onProblemSelect={onProblemSelect}
      ></Menu>
    </div>
  );
}

export default Sidebar;
