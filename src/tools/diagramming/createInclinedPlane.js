import * as dg from "diagramatics";
import { formatLatexEquation } from "../utils/formatLatexEquation";

export function createInclinedPlane(parentDiv, parameters) {
  // initialize parameters
  let angle = parameters.angle;
  let angleLabel = parameters.angleLabel;
  let isSmooth = parameters.isSmooth;
  let showFBD = parameters.showFBD;
  let showGraviCompo = parameters.showGraviCompo;
  let massLabel = parameters.massLabel;
  let normalLabel = parameters.normalLabel;
  let fricLabel = parameters.fricLabel;
  let graviLabel = parameters.graviLabel;
  let perGraviLabel = parameters.perGraviLabel;
  let parGraviLabel = parameters.parGraviLabel;

  // handle MathJax
  let handletex = (str, conf) => {
    return MathJax.tex2svg(str, conf).innerHTML;
  };

  // find aspect ratio
  let aspectRatio = 1 / Math.tan(dg.to_radian(angle));
  if (aspectRatio > 1.7) {
    aspectRatio = 1.7;
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

  // define the 'draw' function
  let draw = (...diagrams) => {
    dg.draw_to_svg(svg, dg.diagram_combine(...diagrams).fontscale(0.014));
  };

  // format the label
  angleLabel = formatLatexEquation(angleLabel);
  let graviAngleLabel = angleLabel;
  massLabel = formatLatexEquation(massLabel);
  graviLabel = formatLatexEquation(graviLabel);
  normalLabel = formatLatexEquation(normalLabel);
  fricLabel = formatLatexEquation(fricLabel);
  parGraviLabel = formatLatexEquation(parGraviLabel);
  perGraviLabel = formatLatexEquation(perGraviLabel);

  // prevent MathJax render a force label if the force is not shown
  if (isSmooth) {
    fricLabel = "";
  }
  if (showFBD == false) {
    if (showGraviCompo == false) {
      graviLabel = "";
    }
    normalLabel = "";
    fricLabel = "";
  }
  if (showGraviCompo == false) {
    graviAngleLabel = "";
    parGraviLabel = "";
    perGraviLabel = "";
  }

  // draw the diagram
  let plane = dg
    .polygon([
      dg.V2(0, 0),
      dg.V2(10, 0),
      dg.V2(10, 10 * Math.tan(dg.to_radian(angle))),
    ])
    .fill("white");

  let object = dg
    .square(2)
    .move_origin("bottom-center")
    .position(plane.parametric_point(0.5, 2))
    .rotate(dg.to_radian(angle))
    .fill("lightblue")
    .stroke("none");

  let angleAnno = dg.annotation.angle(
    [dg.V2(1, 0), dg.V2(0, 0), dg.V2(1, Math.tan(dg.to_radian(angle)))],
    angleLabel,
    2.4,
    1.8
  );

  let massAnno = dg
    .text(massLabel)
    .position(object.get_anchor("center-center"))
    .translate(dg.V2(0, 0.3));

  // vector parameter
  let arrowHeadSize = 0.28;
  let normalVectLength; // set as a base vector, every other vectors scaled relative to this normal vector
  if (angle > 45) {
    normalVectLength = 4;
  } else {
    normalVectLength = 3;
  }

  let graviAnno = dg.annotation
    .vector(
      dg.V2(0, -0.8 * normalVectLength),
      graviLabel,
      dg.V2(0, -0.4),
      arrowHeadSize
    )
    .position(object.get_anchor("center-center"))
    .fill("blue")
    .stroke("blue")
    .opacity(0);

  let normalAnno = dg.annotation
    .vector(
      dg.V2(
        -normalVectLength * Math.sin(dg.to_radian(angle)),
        normalVectLength * Math.cos(dg.to_radian(angle))
      ),
      normalLabel,
      dg.V2(0, 0.4),
      arrowHeadSize
    )
    .position(object.origin)
    .fill("blue")
    .stroke("blue")
    .opacity(0);

  let frictAnno = dg.annotation
    .vector(
      dg.V2(
        0.3 * normalVectLength * Math.cos(dg.to_radian(angle)),
        0.3 * normalVectLength * Math.sin(dg.to_radian(angle))
      ),
      fricLabel,
      dg.V2(0.5, -0.4),
      arrowHeadSize
    )
    .position(object.origin)
    .fill("blue")
    .stroke("blue")
    .opacity(0);

  if (showFBD == true) {
    graviAnno = graviAnno.opacity(1);
    normalAnno = normalAnno.opacity(1);
    if (isSmooth == false) {
      frictAnno = frictAnno.opacity(1);
    }
  }

  let Wcos = 0.8 * normalVectLength * Math.cos(dg.to_radian(angle));
  let Wsin = 0.8 * normalVectLength * Math.sin(dg.to_radian(angle));
  let perpenCompo = dg.annotation.vector(
    dg.V2(
      Wcos * Math.sin(dg.to_radian(angle)),
      -Wcos * Math.cos(dg.to_radian(angle))
    ),
    perGraviLabel,
    dg.V2(0.4, -0.4),
    arrowHeadSize
  );
  let paraCompo = dg.annotation.vector(
    dg.V2(
      -Wsin * Math.cos(dg.to_radian(angle)),
      -Wsin * Math.sin(dg.to_radian(angle))
    ),
    parGraviLabel,
    dg.V2(-0.25, -0.4),
    arrowHeadSize
  );
  let graviCompo = dg
    .diagram_combine(perpenCompo, paraCompo)
    .position(object.get_anchor("center-center"))
    .stroke("red")
    .fill("red")
    .opacity(0);
  let graviErase = dg
    .curve([
      dg.V2(-0.12, -0.12),
      dg.V2(0.12, -0.06),
      dg.V2(-0.12, 0),
      dg.V2(0.12, 0.06),
      dg.V2(-0.12, 0.12),
      dg.V2(0.12, 0.18),
    ])
    .position(graviAnno.origin)
    .translate(dg.V2(0, -1.74))
    .stroke("red")
    .opacity(0);
  let graviAngle = dg.annotation
    .angle(
      [
        dg.V2(0, -1),
        dg.V2(0, 0),
        dg.V2(Math.sin(dg.to_radian(angle)), -Math.cos(dg.to_radian(angle))),
      ],
      graviAngleLabel,
      1.4,
      1.2
    )
    .position(graviAnno.origin)
    .fill("#ffffff96")
    .opacity(0);

  if (showGraviCompo == true) {
    graviAnno = graviAnno.opacity(1);
    graviCompo = graviCompo.opacity(1);
    graviErase = graviErase.opacity(1);
    graviAngle = graviAngle.opacity(1);
  }

  draw(
    normalAnno,
    object,
    plane,
    angleAnno,
    massAnno,
    graviAnno,
    frictAnno,
    graviCompo,
    graviErase,
    graviAngle
  );

  dg.handle_tex_in_svg(svg, handletex);
}
