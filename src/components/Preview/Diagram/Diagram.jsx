import { useEffect, useRef } from "react";
import styles from "./Diagram.module.css";
import { createInclinedPlane } from "../../../tools/diagramming/createInclinedPlane";
import { createMotionPath } from "../../../tools/diagramming/createMotionPath";
import { createRectilinearMotion } from "../../../tools/diagramming/createRectilinaerMotion";
import { createPolynomialGraph } from "../../../tools/diagramming/createPolynomialGraph";

function Diagram({ objJson }) {
  const divRef = useRef(null);

  useEffect(() => {
    if (objJson.name == "create_inclined_plane_diagram") {
      createInclinedPlane(divRef.current, objJson.parameters);
    } else if (objJson.name == "create_motion_path_diagram") {
      createMotionPath(divRef.current, objJson.parameters);
    } else if (objJson.name == "create_rectilinear_motion_animation") {
      createRectilinearMotion(divRef.current, objJson.parameters);
    } else if (objJson.name == "create_polynomial_graph") {
      createPolynomialGraph(divRef.current, objJson.parameters);
    } else {
      divRef.current.innerHTML = "";
    }
  }, [objJson]);

  return <div ref={divRef} className={styles.diagram}></div>;
}

export default Diagram;
