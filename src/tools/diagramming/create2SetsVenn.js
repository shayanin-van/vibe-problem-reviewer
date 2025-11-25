import * as dg from "diagramatics";
import { formatLatexEquation } from "../utils/formatLatexEquation";

export function create2SetsVenn(parentDiv, parameters) {
  // initialize parameters
  const setALabel = parameters.setALabel;
  const setBLabel = parameters.setBLabel;
  const setULabel = parameters.setULabel;
  const regionAonly = parameters.regionAonly;
  const regionBonly = parameters.regionBonly;
  const regionAandB = parameters.regionAandB;
  const regionOutside = parameters.regionOutside;

  // handle MathJax
  let handletex = (str, conf) => {
    return MathJax.tex2svg(str, conf).innerHTML;
  };

  // aspect ratio
  const aspectRatio = 2;

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

  // define set
  let setU = dg.rectangle(16, 10);
  let setA = dg.circle(3.2).position(dg.V2(-1.8, 0));
  let setB = dg.circle(3.2).position(dg.V2(1.8, 0));
  let sets = dg.diagram_combine(setU, setA, setB);

  // sets label
  let labelA;
  if (setALabel) {
    labelA = dg.text(setALabel).fontscale(0.06).position(dg.V2(-4.8, 2.8));
  } else {
    labelA = dg.text("A").fontscale(0.06).position(dg.V2(-4.8, 2.8));
  }
  let labelB;
  if (setBLabel) {
    labelB = dg.text(setBLabel).fontscale(0.06).position(dg.V2(4.8, 2.8));
  } else {
    labelB = dg.text("B").fontscale(0.06).position(dg.V2(4.8, 2.8));
  }
  let labelU;
  if (setULabel) {
    labelU = dg.text(setULabel).fontscale(0.06).position(dg.V2(-7, 4));
  } else {
    labelU = dg.text("U").fontscale(0.06).position(dg.V2(-7, 4));
  }
  let setLabels = dg.diagram_combine(labelA, labelB, labelU);

  // regions
  let rAonly = dg.boolean.difference(setA, setB);
  let rBonly = dg.boolean.difference(setB, setA);
  let rAandB = dg.boolean.intersect(setB, setA);
  let rOutside = dg.diagram_combine(
    dg.boolean.difference(dg.rectangle(8.04, 10).position(dg.V2(-4, 0)), setA),
    dg.boolean.difference(dg.rectangle(8.04, 10).position(dg.V2(4, 0)), setB)
  );
  let areaToShade = [];
  if (regionAonly.isShaded) {
    areaToShade.push(rAonly);
  }
  if (regionBonly.isShaded) {
    areaToShade.push(rBonly);
  }
  if (regionAandB.isShaded) {
    areaToShade.push(rAandB);
  }
  if (regionOutside.isShaded) {
    areaToShade.push(rOutside);
  }
  let shadedArea = dg
    .diagram_combine(...areaToShade)
    .strokewidth(0)
    .fill("lightblue");

  // text
  let textAonly = dg
    .text(regionAonly.label)
    .fontscale(0.04)
    .position(dg.V2(-3, 0));
  let textBonly = dg
    .text(regionBonly.label)
    .fontscale(0.04)
    .position(dg.V2(3, 0));
  let textAandB = dg.text(regionAandB.label).fontscale(0.04);
  let textOutside = dg
    .text(regionOutside.label)
    .move_origin_text("center-right")
    .fontscale(0.04)
    .position(dg.V2(7, -4));
  let textLabels = dg.diagram_combine(
    textAonly,
    textBonly,
    textAandB,
    textOutside
  );

  // for some reason, calling draw() twice fix some initial sizing problem
  draw(shadedArea, sets, setLabels, textLabels);
  draw(shadedArea, sets, setLabels, textLabels);

  dg.handle_tex_in_svg(svg, handletex);
}
