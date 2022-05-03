import PropTypes from "prop-types";
import React from "react";
import MathJax from "react-mathjax2";

const EquationCore = ({ text }) => (
  <code
    style={{ display: "inline-block", padding: "0.5rem", margin: "0.5rem" }}
  >
    <MathJax.Context input="ascii">
      <MathJax.Node inline>{text}</MathJax.Node>
    </MathJax.Context>
  </code>
);

EquationCore.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EquationCore;
