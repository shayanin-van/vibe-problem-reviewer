import * as dg from "diagramatics";
import { formatLatexEquation } from "../utils/formatLatexEquation";

export function createRectilinearMotion(parentDiv, parameters) {
  // initialize parameters
  const s = parameters.s;
  const u = parameters.u;
  const v = parameters.v;
  const a = parameters.a;
  const t = parameters.t;
  const direction = parameters.direction;
  const objectLabel = parameters.objectLabel;
  const showAccel = parameters.showAccel;
  const showVelo = parameters.showVelo;
  const showDist = parameters.showDist;

  // handle MathJax
  let handletex = (str, conf) => {
    return MathJax.tex2svg(str, conf).innerHTML;
  };

  // size calculation
  let sMaxPos = 0;
  let sMaxNeg = 0;
  if (s >= 0) {
    sMaxPos = s;
  } else {
    sMaxNeg = s;
  }
  const tCrit = -u / a; // t when velocity = 0
  if (tCrit < t) {
    const sAtCrit = u * tCrit + 0.5 * a * tCrit;
    if (sAtCrit >= 0) {
      sMaxPos = sAtCrit;
    } else {
      sMaxNeg = sAtCrit;
    }
  }
  const sRange = sMaxPos - sMaxNeg;

  // find aspect ratio
  let aspectRatio;
  if (direction == "horizontal") {
    aspectRatio = 4;
  } else {
    aspectRatio = 1;
  }

  // clear and reset parentDiv
  parentDiv.innerHTML = "";
  parentDiv.style.aspectRatio = aspectRatio.toString();

  // create and append svg element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("diagramSvg");
  svg.style.aspectRatio = aspectRatio.toString();
  svg.style.width = "100%";
  parentDiv.appendChild(svg);

  // create and append slider div element
  const sliderDiv = document.createElement("div");
  parentDiv.appendChild(sliderDiv);

  // define the 'draw' function
  let draw = (...diagrams) => {
    dg.draw_to_svg(svg, dg.diagram_combine(...diagrams));
  };

  // create the interactive object
  let int = new dg.Interactive(sliderDiv, svg);

  // draw the diagram
  let bg;
  if (direction == "horizontal") {
    bg = dg.rectangle(sRange, sRange / aspectRatio);
  } else {
    bg = dg.rectangle(sRange * aspectRatio, sRange);
  }

  let object = dg
    .circle(0.025 * sRange)
    .fill("lightblue")
    .stroke("white")
    .strokewidth(3);

  int.draw_function = (inp) => {
    let t = inp["t"];

    if (direction == "horizontal") {
      object = object.position(dg.V2(u * t + 0.5 * a * t * t, 0));
    } else {
      object = object.position(dg.V2(0, u * t + 0.5 * a * t * t));
    }

    draw(bg, object);
  };

  int.slider("t", 0, t, 0);
  int.draw();

  dg.handle_tex_in_svg(svg, handletex);
}
