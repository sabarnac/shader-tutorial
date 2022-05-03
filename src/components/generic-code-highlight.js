import PropTypes from "prop-types";
import React, { Fragment } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const GenericCodeHighlight = ({ showHeader = true, code, type, language }) => (
  <Fragment>
    {showHeader ? (
      <p>
        <strong>{type} Code:</strong>
      </p>
    ) : null}
    <SyntaxHighlighter
      className="glsl-code"
      language={language}
      style={atomOneDark}
      customStyle={{ padding: "0", background: null }}
      lineNumberContainerStyle={{
        float: "left",
        fontSize: "100%",
        paddingRight: "1.5rem",
        marginRight: "1.5rem",
        borderRight: "0.2rem dashed #9b4dca",
        borderRadius: "0",
        whiteSpace: "inherit",
      }}
      codeTagProps={{
        style: { display: "inline-block" },
      }}
      showLineNumbers={true}
      showInlineLineNumbers={false}
      wrapLines={false}
    >
      {code}
    </SyntaxHighlighter>
  </Fragment>
);

GenericCodeHighlight.propTypes = {
  showHeader: PropTypes.bool,
  code: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default GenericCodeHighlight;
