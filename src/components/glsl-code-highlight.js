import PropTypes from "prop-types"
import React, { Fragment } from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"

const GlslCodeHighlight = ({ showHeader = true, code, type }) => (
  <Fragment>
    {showHeader ? (
      <p>
        <strong>{type} Shader:</strong>
      </p>
    ) : null}
    <SyntaxHighlighter
      className="glsl-code"
      language="glsl"
      style={atomOneDark}
      customStyle={{ padding: "0", background: null }}
      lineNumberContainerStyle={{
        float: "left",
        paddingRight: "1.5rem",
        borderRight: "1px dashed #9b4dca",
      }}
      codeTagProps={{
        style: { display: "inline-block" },
      }}
      showLineNumbers={true}
      wrapLines={false}
    >
      {code}
    </SyntaxHighlighter>
  </Fragment>
)

GlslCodeHighlight.propTypes = {
  showHeader: PropTypes.bool,
  code: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default GlslCodeHighlight
