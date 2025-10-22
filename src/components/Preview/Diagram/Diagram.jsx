import { useEffect, useRef } from "react";
import styles from "./Diagram.module.css";
import { createInclinedPlane } from "../../../tools/diagramming/createInclinedPlane";
import { createMotionPath } from "../../../tools/diagramming/createMotionPath";

function Diagram({ objJson }) {
  const divRef = useRef(null);

  useEffect(() => {
    if (objJson.name == "create_inclined_plane_diagram") {
      createInclinedPlane(divRef.current, objJson.parameters);
    } else if (objJson.name == "create_motion_path_diagram") {
      createMotionPath(divRef.current, objJson.parameters);
    } else {
      divRef.current.innerHTML = "";
    }
  }, [objJson]);

  return <div ref={divRef} className={styles.diagram}></div>;
}

export default Diagram;
