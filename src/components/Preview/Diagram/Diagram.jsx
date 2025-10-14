import { useEffect, useRef } from "react";
import styles from "./Diagram.module.css";
import { createInclinedPlane } from "../../../tools/diagramming/createInclinedPlane";

function Diagram({ paramJson }) {
  const divRef = useRef(null);

  useEffect(() => {
    createInclinedPlane(
      divRef.current,
      paramJson.parameters.angle,
      paramJson.parameters.angleLabel,
      paramJson.parameters.isSmooth,
      paramJson.parameters.showFBD,
      paramJson.parameters.showGraviCompo,
      paramJson.parameters.massLabel,
      paramJson.parameters.normalLabel,
      paramJson.parameters.fricLabel,
      paramJson.parameters.graviLabel,
      paramJson.parameters.perGraviLabel,
      paramJson.parameters.parGraviLabel
    );
  }, [paramJson]);

  return <div ref={divRef} className={styles.diagram}></div>;
}

export default Diagram;
