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
  if (a != 0) {
    const tCrit = -u / a; // t when velocity = 0
    if (tCrit > 0 && tCrit < t) {
      const sAtCrit = u * tCrit + 0.5 * a * tCrit * tCrit;
      if (sAtCrit >= 0 && sAtCrit > sMaxPos) {
        sMaxPos = sAtCrit;
      } else if (sAtCrit < 0 && sAtCrit < sMaxNeg) {
        sMaxNeg = sAtCrit;
      }
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
    bg = dg
      .rectangle(sRange, sRange / aspectRatio)
      .position(dg.V2((sMaxNeg + sMaxPos) / 2, 0));
  } else {
    bg = dg
      .rectangle(sRange * aspectRatio, sRange)
      .position(dg.V2(0, (sMaxNeg + sMaxPos) / 2));
  }
  bg = bg.scale(dg.V2(1.2, 1.2)).strokewidth(0);

  let object = dg
    .circle(0.04 * sRange)
    .fill("lightblue")
    .stroke("white")
    .strokewidth(3);

  let label = dg
    .text(objectLabel)
    .fontfamily("mitr, sans-serif")
    .fontsize(16)
    .textstroke("white")
    .textstrokewidth(0.4);

  let aVect;
  if (direction == "horizontal") {
    aVect = dg.annotation
      .vector(
        dg.V2(0.2 * sRange * Math.sign(a), 0),
        "a = " + a + " m/s²",
        dg.V2(-(0.1 * sRange * Math.sign(a)), 0.04 * sRange),
        0.02 * sRange
      )
      .fill("red")
      .stroke("red")
      .position(bg.origin)
      .translate(dg.V2(-(0.1 * sRange * Math.sign(a)), 0.06 * sRange));
  } else {
    aVect = dg.annotation
      .vector(
        dg.V2(0, 0.2 * sRange * Math.sign(a)),
        "a = " + a + " m/s²",
        dg.V2(0.12 * sRange, -(0.1 * sRange * Math.sign(a))),
        0.02 * sRange
      )
      .fill("red")
      .stroke("red")
      .position(bg.origin)
      .translate(dg.V2(0.14 * sRange, -(0.1 * sRange * Math.sign(a))));
  }
  if (showAccel == false || a == 0) {
    aVect = aVect.opacity(0);
  }

  let vVect;
  let sVect;

  int.draw_function = (inp) => {
    let t = inp["t"];

    let currentPos = u * t + 0.5 * a * t * t;
    let currentVel = u + a * t;
    let velScaleFactor = 0.01 * sRange;

    if (direction == "horizontal") {
      object = object.position(dg.V2(currentPos, -0.03 * sRange));
      label = label.position(dg.V2(currentPos, -0.03 * sRange));
    } else {
      object = object.position(dg.V2(0, currentPos));
      label = label.position(dg.V2(0, currentPos));
    }

    if (direction == "horizontal") {
      vVect = dg.annotation
        .vector(
          dg.V2(velScaleFactor * currentVel, 0),
          currentVel.toFixed(1) + " m/s",
          dg.V2(-((velScaleFactor / 2) * currentVel), 0.04 * sRange),
          0.02 * sRange
        )
        .fill("blue")
        .stroke("blue")
        .position(object.origin);
    } else {
      vVect = dg.annotation
        .vector(
          dg.V2(0, velScaleFactor * currentVel),
          currentVel.toFixed(1) + " m/s",
          dg.V2(0.12 * sRange, -((velScaleFactor / 2) * currentVel)),
          0.02 * sRange
        )
        .fill("blue")
        .stroke("blue")
        .position(object.origin);
    }
    if (showVelo == false) {
      vVect = vVect.opacity(0);
    }

    if (direction == "horizontal") {
      sVect = dg.annotation.length(
        dg.V2(0, -0.03 * sRange),
        object.origin,
        "s = " + currentPos.toFixed(1) + " m",
        0.06 * sRange * Math.sign(currentPos),
        0.03 * sRange,
        0.1 * sRange * Math.sign(currentPos)
      );
    } else {
      sVect = dg.annotation.length(
        dg.V2(0, 0),
        object.origin,
        "s = " + currentPos.toFixed(1) + " m",
        -0.1 * sRange * Math.sign(currentPos),
        0.03 * sRange,
        -0.2 * sRange * Math.sign(currentPos)
      );
    }

    if (showDist == false || currentPos == 0) {
      sVect = sVect.opacity(0);
    }

    draw(bg, object, label, aVect, vVect, sVect);
  };

  int.slider("t", 0, t, 0, t / 1000, t);
  int.draw();

  dg.handle_tex_in_svg(svg, handletex);
}
