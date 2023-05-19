import { vec3 } from "gl-matrix";
import React, { useState } from "react";

import skyboxFaceNegativeX from "../../../images/advanced/skybox-face-negative-x.png";
import skyboxFaceNegativeY from "../../../images/advanced/skybox-face-negative-y.png";
import skyboxFaceNegativeZ from "../../../images/advanced/skybox-face-negative-z.png";
import skyboxFacePositiveX from "../../../images/advanced/skybox-face-positive-x.png";
import skyboxFacePositiveY from "../../../images/advanced/skybox-face-positive-y.png";
import skyboxFacePositiveZ from "../../../images/advanced/skybox-face-positive-z.png";
import skyboxFaces from "../../../images/advanced/skybox-faces.png";
import { coordArrToString } from "../../util";

const FACES = [
  {
    name: "All Faces",
    src: skyboxFaces,
  },
  {
    name: "+X-Axis Face",
    src: skyboxFacePositiveX,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
  {
    name: "-X-Axis Face",
    src: skyboxFaceNegativeX,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
  {
    name: "+Y-Axis Face",
    src: skyboxFacePositiveY,
    up: vec3.fromValues(0.0, 0.0, -1.0),
  },
  {
    name: "-Y-Axis Face",
    src: skyboxFaceNegativeY,
    up: vec3.fromValues(0.0, 0.0, 1.0),
  },
  {
    name: "+Z-Axis Face",
    src: skyboxFacePositiveZ,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
  {
    name: "-Z-Axis Face",
    src: skyboxFaceNegativeZ,
    up: vec3.fromValues(0.0, 1.0, 0.0),
  },
];

const SkyboxMapTexture = () => {
  const [currentFace, updateCurrentFace] = useState(0);

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <p>
        <img src={FACES[currentFace].src} />
      </p>
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

export default SkyboxMapTexture;
