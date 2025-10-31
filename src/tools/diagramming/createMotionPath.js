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
  let xRange = maxX - minX;
  const yArray = points.map((item) => item.y);
  const minY = Math.min(...yArray);
  const maxY = Math.max(...yArray);
  let yRange = maxY - minY;
  if (xRange == 0 && yRange != 0) {
    xRange = yRange;
  }
  if (yRange == 0 && xRange != 0) {
    yRange = xRange;
  }
  if (xRange == 0 && yRange == 0) {
    xRange = 10;
    yRange = 10;
  }

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
      .circle(0.025 * xRange)
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

  let lastPoint = points[points.length - 1];
  let firstPoint = points[0];
  let displacementVect = dg.V2(
    lastPoint.x - firstPoint.x,
    lastPoint.y - firstPoint.y
  );
  let displacement = dg.annotation
    .vector(displacementVect, "", dg.V2(0.0), 0.03 * xRange)
    .position(dg.V2(firstPoint.x, firstPoint.y))
    .fill("lightred")
    .stroke("lightred")
    .strokewidth(3)
    .opacity(0);

  if (showDisplacement && displacementVect.length() != 0) {
    displacement = displacement.opacity(1);
  }

  let lengths = [];
  for (let i = 0; i < points.length - 1; i++) {
    let point1 = dg.V2(points[i].x, points[i].y);
    let point2 = dg.V2(points[i + 1].x, points[i + 1].y);
    let length = Math.sqrt(
      (points[i + 1].x - points[i].x) ** 2 +
        (points[i + 1].y - points[i].y) ** 2
    ).toFixed(0);
    lengths.push(
      dg.annotation
        .length(point1, point2, length.toString(), 0.03 * xRange, 0.03 * xRange)
        .opacity(0)
    );
  }

  if (showSectionLength) {
    for (let i = 0; i < lengths.length; i++) {
      lengths[i] = lengths[i].opacity(1);
    }
  }

  // for some reason, calling draw() twice fix some initial sizing problem
  draw(path, ...nodes, ...lengths, displacement, ...labels);
  draw(path, ...nodes, ...lengths, displacement, ...labels);

  dg.handle_tex_in_svg(svg, handletex);
}
