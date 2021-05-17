import loadable from "@loadable/component"
import PropTypes from "prop-types"
import React from "react"

const EquationCore = loadable(() => import("./equation-core"))

const Equation = ({ text }) => (
  <EquationCore
    fallback={
      <code
        style={{ display: "inline-block", padding: "0.5rem", margin: "0.5rem" }}
      >
        [AsciiMath Syntax:] {text}
      </code>
    }
    text={text}
  />
)

Equation.propTypes = {
  text: PropTypes.string.isRequired,
}

export default Equation
