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
  if (yMin > 0) {
    yMin = 0;
  }
  if (xMin > 0) {
    xMin = 0;
  }
  if (yMax < 0) {
    yMax = 0;
  }
  if (xMax < 0) {
    xMax = 0;
  }

  // find aspect ratio
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

  // draw the diagram
  let axisOpt = {
    xrange: [xMin, xMax],
    yrange: [yMin, yMax],
    bbox: [dg.V2(-5 * aspectRatio, -5), dg.V2(5 * aspectRatio, 5)],
    headsize: 0,
    ticksize: 0.4,
    n_sample: 500,
  };
  let transf = dg.axes_transform(axisOpt);

  let mainAxis = dg.axes_empty(axisOpt);
  let axisExtenderX = dg
    .curve([dg.V2(0, 0), dg.V2(0.8, 0)])
    .position(transf(dg.V2(xMax, 0)));
  let axisExtenderY = dg
    .curve([dg.V2(0, 0), dg.V2(0, 0.8)])
    .position(transf(dg.V2(0, yMax)));
  let axis = dg
    .diagram_combine(mainAxis, axisExtenderX, axisExtenderY)
    .stroke("black")
    .strokewidth(1.5);

  // define function and it derivative
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
  let dFn = (x) => {
    for (let i = 0; i < graphSections.length; i++) {
      if (
        x < graphSections[i].domain.xStart ||
        x > graphSections[i].domain.xEnd
      ) {
        continue;
      } else {
        return 2 * graphSections[i].a * x + graphSections[i].b;
      }
    }
  };

  // let graph = dg.plotf(fn, axisOpt).stroke("blue").strokewidth(3);

  let graphs = [];
  for (let i = 0; i < graphSections.length; i++) {
    let domain = graphSections[i].domain.xEnd - graphSections[i].domain.xStart;
    let ratio = domain / (xMax - xMin);
    let points = [];
    for (let j = 1; j < ratio * 500; j++) {
      let x = graphSections[i].domain.xStart + (j * domain) / (ratio * 500);
      points.push(transf(dg.V2(x, fn(x))));
    }
    let graph = dg
      .curve(points)
      .stroke("blue")
      .strokewidth(3)
      .strokelinecap("round");
    graphs.push(graph);

    if (i > 0) {
      let pCurrentStart = transf(
        dg.V2(
          graphSections[i].domain.xStart,
          fn(graphSections[i].domain.xStart + domain / (ratio * 500)),
        ),
      );
      let pPrevEnd = transf(
        dg.V2(
          graphSections[i - 1].domain.xEnd,
          fn(graphSections[i - 1].domain.xEnd),
        ),
      );
      let connector = dg
        .curve([pPrevEnd, pCurrentStart])
        .stroke("blue")
        .strokewidth(2)
        .strokedasharray([6, 6]);
      graphs.push(connector);
    }
  }

  let xLabelDiagram = dg
    .text(xLabel)
    .position(transf(dg.V2(xMax, 0)))
    .fontfamily("mitr, sans-serif")
    .move_origin_text("center-left")
    .translate(dg.V2(0.4 + 0.8, 0));
  let yLabelDiagram = dg
    .text(yLabel)
    .position(transf(dg.V2(0, yMax)))
    .fontfamily("mitr, sans-serif")
    .move_origin_text("bottom-center")
    .translate(dg.V2(0, 0.4 / aspectRatio + 0.8));
  let axisLabel = dg.diagram_combine(xLabelDiagram, yLabelDiagram);

  let tickMarks = [];
  for (let i = 0; i < graphSections.length; i++) {
    let xStart = graphSections[i].domain.xStart;
    let xEnd = graphSections[i].domain.xEnd;
    tickMarks.push(dg.xtickmark(xStart, 0, xStart.toString(), axisOpt));
    tickMarks.push(dg.xtickmark(xEnd, 0, xEnd.toString(), axisOpt));

    let yAtXStart =
      graphSections[i].a * xStart * xStart +
      graphSections[i].b * xStart +
      graphSections[i].c;
    let yAtXEnd =
      graphSections[i].a * xEnd * xEnd +
      graphSections[i].b * xEnd +
      graphSections[i].c;
    tickMarks.push(dg.ytickmark(yAtXStart, 0, yAtXStart.toString(), axisOpt));
    tickMarks.push(dg.ytickmark(yAtXEnd, 0, yAtXEnd.toString(), axisOpt));
  }

  let horiGuides = [];
  for (let i = 0; i < graphSections.length; i++) {
    let xEnd = graphSections[i].domain.xEnd;
    let yEnd = fn(xEnd);
    let p1 = transf(dg.V2(0, yEnd));
    let p2 = transf(dg.V2(xEnd, yEnd));

    let guide = dg
      .curve([p1, p2])
      .stroke("grey")
      .strokewidth(1)
      .opacity(0.5)
      .strokedasharray([6, 10]);
    horiGuides.push(guide);
  }

  let areaUnder = dg.curve([]);
  let areaMark = [];
  if (intervalsToShowArea) {
    areaUnder = dg
      .under_curvef(
        fn,
        intervalsToShowArea.xStart,
        intervalsToShowArea.xEnd,
        axisOpt,
      )
      .fill("lightblue")
      .opacity(0.5)
      .stroke("none");

    areaMark.push(
      dg.xtickmark(
        intervalsToShowArea.xStart,
        0,
        intervalsToShowArea.xStart.toString(),
        axisOpt,
      ),
    );
    areaMark.push(
      dg.xtickmark(
        intervalsToShowArea.xEnd,
        0,
        intervalsToShowArea.xEnd.toString(),
        axisOpt,
      ),
    );
    let yAtXStart = fn(intervalsToShowArea.xStart);
    let yAtXEnd = fn(intervalsToShowArea.xEnd);
    areaMark.push(dg.ytickmark(yAtXStart, 0, yAtXStart.toString(), axisOpt));
    areaMark.push(dg.ytickmark(yAtXEnd, 0, yAtXEnd.toString(), axisOpt));
  }

  let slopes = [];
  if (pointsToShowSlope) {
    for (let i = 0; i < pointsToShowSlope.length; i++) {
      let slopeDot = dg
        .circle(0.2)
        .fill("lightred")
        .strokewidth(0)
        .position(
          transf(dg.V2(pointsToShowSlope[i], fn(pointsToShowSlope[i]))),
        );
      let angle = Math.atan(dFn(pointsToShowSlope[i]));
      let lineStart = transf(
        dg.V2(
          pointsToShowSlope[i] - Math.cos(angle),
          fn(pointsToShowSlope[i]) - Math.sin(angle),
        ),
      );
      let lineEnd = transf(
        dg.V2(
          pointsToShowSlope[i] + Math.cos(angle),
          fn(pointsToShowSlope[i]) + Math.sin(angle),
        ),
      );
      let tranfV2 = lineEnd.sub(lineStart);
      let tranfAngle = Math.atan2(tranfV2.y, tranfV2.x);
      let slopeLine = dg
        .curve([dg.V2(-1, 0), dg.V2(1, 0)])
        .rotate(tranfAngle)
        .strokewidth(3.5)
        .stroke("red")
        .position(
          transf(dg.V2(pointsToShowSlope[i], fn(pointsToShowSlope[i]))),
        );
      let slope = dg.diagram_combine(slopeLine, slopeDot);

      slopes.push(slope);
      slopes.push(
        dg.xtickmark(
          pointsToShowSlope[i],
          0,
          pointsToShowSlope[i].toString(),
          axisOpt,
        ),
      );
    }
  }

  // for some reason, calling draw() twice fix some initial sizing problem
  draw(
    ...horiGuides,
    axis,
    areaUnder,
    ...areaMark,
    ...graphs,
    ...slopes,
    axisLabel,
    ...tickMarks,
  );
  draw(
    ...horiGuides,
    axis,
    areaUnder,
    ...areaMark,
    ...graphs,
    ...slopes,
    axisLabel,
    ...tickMarks,
  );

  dg.handle_tex_in_svg(svg, handletex);
}
