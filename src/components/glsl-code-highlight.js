import PropTypes from "prop-types"
import React from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"

const GlslCodeHighlight = ({ code }) => (
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
)

GlslCodeHighlight.propTypes = {
  code: PropTypes.string,
}

export default GlslCodeHighlight