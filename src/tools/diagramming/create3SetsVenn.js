import * as dg from "diagramatics";
import { formatLatexEquation } from "../utils/formatLatexEquation";

export function create3SetsVenn(parentDiv, parameters) {
  // initialize parameters
  const setALabel = parameters.setALabel;
  const setBLabel = parameters.setBLabel;
  const setCLabel = parameters.setCLabel;
  const setULabel = parameters.setULabel;
  const regionAonly = parameters.regionAonly;
  const regionBonly = parameters.regionBonly;
  const regionConly = parameters.regionConly;
  const regionAandBnotC = parameters.regionAandBnotC;
  const regionAandCnotB = parameters.regionAandCnotB;
  const regionBandCnotA = parameters.regionBandCnotA;
  const regionAandBandC = parameters.regionAandBandC;
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
  let setU = dg.rectangle(16, 14);
  let setA = dg.circle(3.2).position(dg.V2(-1.8, 1.8));
  let setB = dg.circle(3.2).position(dg.V2(1.8, 1.8));
  let setC = dg.circle(3.2).position(dg.V2(0, -1.8 * Math.sin(Math.PI / 3)));
  let sets = dg.diagram_combine(setU, setA, setB, setC);

  // sets label
  let labelA;
  if (setALabel) {
    labelA = dg.text(setALabel).fontscale(0.06).position(dg.V2(-5.3, 3.7));
  } else {
    labelA = dg.text("A").fontscale(0.06).position(dg.V2(-5, 3.5));
  }
  let labelB;
  if (setBLabel) {
    labelB = dg.text(setBLabel).fontscale(0.06).position(dg.V2(5.3, 3.7));
  } else {
    labelB = dg.text("B").fontscale(0.06).position(dg.V2(5.3, 3.7));
  }
  let labelC;
  if (setCLabel) {
    labelC = dg.text(setCLabel).fontscale(0.06).position(dg.V2(0, -5.8));
  } else {
    labelC = dg.text("C").fontscale(0.06).position(dg.V2(0, -5.8));
  }
  let labelU;
  if (setULabel) {
    labelU = dg.text(setULabel).fontscale(0.06).position(dg.V2(-7, 6));
  } else {
    labelU = dg.text("U").fontscale(0.06).position(dg.V2(-7, 6));
  }
  let setLabels = dg.diagram_combine(labelA, labelB, labelC, labelU);

  // regions
  let rAonly = dg.boolean.difference(setA, dg.boolean.union(setB, setC));
  let rBonly = dg.boolean.difference(setB, dg.boolean.union(setA, setC));
  let rConly = dg.boolean.difference(setC, dg.boolean.union(setA, setB));
  let rAandBnotC = dg.boolean.difference(
    dg.boolean.intersect(setA, setB),
    setC
  );
  let rAandCnotB = dg.boolean.difference(
    dg.boolean.intersect(setA, setC),
    setB
  );
  let rBandCnotA = dg.boolean.difference(
    dg.boolean.intersect(setB, setC),
    setA
  );
  let rAandBandC = dg.boolean.intersect(dg.boolean.intersect(setA, setB), setC);
  let rOutside = dg.diagram_combine(
    dg.boolean.difference(
      dg.rectangle(8.04, 14).position(dg.V2(-4, 0)),
      dg.boolean.union(setA, setC)
    ),
    dg.boolean.difference(
      dg.rectangle(8.04, 14).position(dg.V2(4, 0)),
      dg.boolean.union(setB, setC)
    )
  );
  let areaToShade = [];
  if (regionAonly.isShaded) {
    areaToShade.push(rAonly);
  }
  if (regionBonly.isShaded) {
    areaToShade.push(rBonly);
  }
  if (regionConly.isShaded) {
    areaToShade.push(rConly);
  }
  if (regionAandBnotC.isShaded) {
    areaToShade.push(rAandBnotC);
  }
  if (regionAandCnotB.isShaded) {
    areaToShade.push(rAandCnotB);
  }
  if (regionBandCnotA.isShaded) {
    areaToShade.push(rBandCnotA);
  }
  if (regionAandBandC.isShaded) {
    areaToShade.push(rAandBandC);
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
    .position(dg.V2(-3, 2.2));
  let textBonly = dg
    .text(regionBonly.label)
    .fontscale(0.04)
    .position(dg.V2(3, 2.2));
  let textConly = dg
    .text(regionConly.label)
    .fontscale(0.04)
    .position(dg.V2(0, -2.5));
  let textAandBnotC = dg
    .text(regionAandBnotC.label)
    .fontscale(0.04)
    .position(dg.V2(0, 2.5));
  let textAandCnotB = dg
    .text(regionAandCnotB.label)
    .fontscale(0.04)
    .position(dg.V2(-1.8, -0.4));
  let textBandCnotA = dg
    .text(regionBandCnotA.label)
    .fontscale(0.04)
    .position(dg.V2(1.8, -0.4));
  let textAandBandC = dg
    .text(regionAandBandC.label)
    .fontscale(0.04)
    .position(dg.V2(0, 0.46));
  let textOutside = dg
    .text(regionOutside.label)
    .move_origin_text("center-right")
    .fontscale(0.04)
    .position(dg.V2(6.6, -5.6));
  let textLabels = dg.diagram_combine(
    textAonly,
    textBonly,
    textConly,
    textAandBnotC,
    textAandCnotB,
    textBandCnotA,
    textAandBandC,
    textOutside
  );

  // for some reason, calling draw() twice fix some initial sizing problem
  draw(shadedArea, sets, setLabels, textLabels);
  draw(shadedArea, sets, setLabels, textLabels);

  dg.handle_tex_in_svg(svg, handletex);
}
