import * as dg from "diagramatics";
import { formatLatexEquation } from "../utils/formatLatexEquation";

export function createPolynomialGraph(parentDiv, parameters) {
  // initialize parameters
  const graphSections = parameters.graphSections;
  const xLabel = parameters.xLabel;
  const yLabel = parameters.yLabel;
  const pointsToShowSlope = parameters.pointsToShowSlope;
  const intervalsToShowArea = parameters.intervalsToShowArea;

  // handle MathJax
  let handletex = (str, conf) => {
    return MathJax.tex2svg(str, conf).innerHTML;
  };

  // size calculation
  let xMin = graphSections[0].domain.xStart;
  let xMax = graphSections[graphSections.length - 1].domain.xEnd;
  let yMin =
    graphSections[0].a * xMin * xMin +
    graphSections[0].b * xMin +
    graphSections[0].c;
  let yMax =
    graphSections[graphSections.length - 1].a * xMax * xMax +
    graphSections[graphSections.length - 1].b * xMax +
    graphSections[graphSections.length - 1].c;
  for (let i = 0; i < graphSections.length; i++) {
    let xStart = graphSections[i].domain.xStart;
    let xEnd = graphSections[i].domain.xEnd;
    if (xStart < xMin) {
      xMin = xStart;
    }
    if (xEnd > xMax) {
      xMax = xEnd;
    }
    let yAtXStart =
      graphSections[i].a * xStart * xStart +
      graphSections[i].b * xStart +
      graphSections[i].c;
    let yAtXEnd =
      graphSections[i].a * xEnd * xEnd +
      graphSections[i].b * xEnd +
      graphSections[i].c;
    if (yAtXStart < yMin) {
      yMin = yAtXStart;
    }
    if (yAtXEnd < yMin) {
      yMin = yAtXEnd;
    }
    if (yAtXStart > yMax) {
      yMax = yAtXStart;
    }
    if (yAtXEnd > yMax) {
      yMax = yAtXEnd;
    }
    let xCrit = -graphSections[i].b / (2 * graphSections[i].a);
    if (xStart < xCrit && xCrit < xEnd) {
      let yAtXCrit =
        graphSections[i].a * xCrit * xCrit +
        graphSections[i].b * xCrit +
        graphSections[i].c;
      if (yAtXCrit < yMin) {
        yMin = yAtXCrit;
      }
      if (yAtXCrit > yMax) {
        yMax = yAtXCrit;
      }
    }
  }

  // find aspect ratio
  const aspectRatio = 1.6;

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
  let axisOpt = {
    xrange: [xMin, xMax],
    yrange: [yMin, yMax],
    bbox: [dg.V2(-8, -5), dg.V2(8, 5)],
    headsize: 0,
    ticksize: 0.4,
    n_sample: 500,
  };

  let axis = dg.axes_empty(axisOpt);

  let fn = (x) => {
    for (let i = 0; i < graphSections.length; i++) {
      if (
        x < graphSections[i].domain.xStart ||
        x > graphSections[i].domain.xEnd
      ) {
        continue;
      } else {
        return (
          graphSections[i].a * x * x +
          graphSections[i].b * x +
          graphSections[i].c
        );
      }
    }
  };
  let graph = dg.plotf(fn, axisOpt);

  // for some reason, calling draw() twice fix some initial sizing problem
  draw(axis, graph);
  draw(axis, graph);

  dg.handle_tex_in_svg(svg, handletex);
}
