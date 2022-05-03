import { vec3 } from "gl-matrix";
import React, { useState } from "react";

import cubeFaceNegativeX from "../../../images/advanced/cube-face-negative-x.png";
import cubeFaceNegativeY from "../../../images/advanced/cube-face-negative-y.png";
import cubeFaceNegativeZ from "../../../images/advanced/cube-face-negative-z.png";
import cubeFacePositiveX from "../../../images/advanced/cube-face-positive-x.png";
import cubeFacePositiveY from "../../../images/advanced/cube-face-positive-y.png";
import cubeFacePositiveZ from "../../../images/advanced/cube-face-positive-z.png";
import cubeFaces from "../../../images/advanced/cube-faces.png";
import { coordArrToString } from "../../util";

const FACES = [
  {
    name: "All Faces",
    src: cubeFaces,
  },
  {
    name: "+X-Axis Face",
    src: cubeFacePositiveX,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
  {
    name: "-X-Axis Face",
    src: cubeFaceNegativeX,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
  {
    name: "+Y-Axis Face",
    src: cubeFacePositiveY,
    up: vec3.fromValues(0.0, 0.0, -1.0),
  },
  {
    name: "-Y-Axis Face",
    src: cubeFaceNegativeY,
    up: vec3.fromValues(0.0, 0.0, 1.0),
  },
  {
    name: "+Z-Axis Face",
    src: cubeFacePositiveZ,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
  {
    name: "-Z-Axis Face",
    src: cubeFaceNegativeZ,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
];

const CubeMapTexture = () => {
  const [currentFace, updateCurrentFace] = useState(0);

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <img src={FACES[currentFace].src} />
      <select
        value={currentFace}
        onChange={({ target: { value } }) => updateCurrentFace(value)}
        onBlur={({ target: { value } }) => updateCurrentFace(value)}
      >
        {FACES.map((face, i) => (
          <option key={i} value={i}>
            {face.name}
          </option>
        ))}
      </select>
      {FACES[currentFace].up ? (
        <pre className="util text-left">
          {`
Face:
    Up Vector: ${coordArrToString(FACES[currentFace].up)}
`.trim()}
        </pre>
      ) : null}
    </div>
  );
};

export default CubeMapTexture;
