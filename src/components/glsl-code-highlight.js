import PropTypes from "prop-types";
import React from "react";

import GenericCodeHighlight from "./generic-code-highlight";

const GlslCodeHighlight = (props) => (
  <GenericCodeHighlight
    {...props}
    type={`${props.type} Shader`}
    language="glsl"
  />
);

GlslCodeHighlight.propTypes = {
  showHeader: PropTypes.bool,
  code: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default GlslCodeHighlight;
