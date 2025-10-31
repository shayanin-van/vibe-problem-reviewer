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

  // find aspect ratio
  const aspectRatio = 1;

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
    xrange: [-50, 50],
    yrange: [-50, 50],
  };
  let axis = dg.axes_empty(axisOpt);
  let graphs = [];
  for (let i = 0; i < graphSections.length; i++) {
    let fn = (x) =>
      graphSections[i].a * x * x + graphSections[i].b * x + graphSections[i].c;
    let graph = dg.plotf(fn, {
      xrange: [graphSections[i].domain.xStart, graphSections[i].domain.xEnd],
      yrange: [-50, 50],
    });

    graphs.push(graph);
  }

  // for some reason, calling draw() twice fix some initial sizing problem
  draw(axis, ...graphs);
  draw(axis, ...graphs);

  dg.handle_tex_in_svg(svg, handletex);
}
