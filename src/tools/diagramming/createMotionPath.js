import * as dg from "diagramatics";
import { formatLatexEquation } from "../utils/formatLatexEquation";

export function createMotionPath(parentDiv, parameters) {
  // initialize parameters
  const points = parameters.points;
  const showDisplacement = parameters.showDisplacement;
  const showSectionLength = parameters.showSectionLength;

  // handle MathJax
  let handletex = (str, conf) => {
    return MathJax.tex2svg(str, conf).innerHTML;
  };

  // size calculation
  const xArray = points.map((item) => item.x);
  const minX = Math.min(...xArray);
  const maxX = Math.max(...xArray);
  const xRange = maxX - minX;
  const yArray = points.map((item) => item.y);
  const minY = Math.min(...yArray);
  const maxY = Math.max(...yArray);
  const yRange = maxY - minY;

  // find aspect ratio
  const aspectRatio = xRange / yRange;

  // clear and reset parentDiv
  parentDiv.innerHTML = "";
  parentDiv.style.aspectRatio = aspectRatio.toString();

  // create and append svg element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("diagramSvg");
  svg.style.aspectRatio = aspectRatio.toString();
  svg.style.width = "100%";
  parentDiv.appendChild(svg);

  // define the 'draw' function
  let draw = (...diagrams) => {
    dg.draw_to_svg(svg, dg.diagram_combine(...diagrams));
  };

  // draw the diagram
  let pointsV2 = points.map((item) => {
    return dg.V2(item.x, item.y);
  });
  let path = dg.curve(pointsV2).strokewidth(3).stroke("blue").opacity(0.5);

  let nodes = [];
  let labels = [];
  points.forEach((point) => {
    let node = dg
      .circle(0.02 * xRange)
      .position(dg.V2(point.x, point.y))
      .fill("lightblue")
      .stroke("white")
      .strokewidth(3);

    nodes.push(node);

    if (point.label) {
      let label = dg
        .text(point.label)
        .position(dg.V2(point.x, point.y))
        .fontfamily("mitr, sans-serif")
        .fontsize(20)
        .textstroke("white")
        .textstrokewidth(1);

      labels.push(label);
    }
  });

  draw(path, ...nodes, ...labels);

  dg.handle_tex_in_svg(svg, handletex);
}
