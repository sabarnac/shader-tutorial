import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const EndPage = () => (
  <Layout>
    <SEO
      title="Shader Basics - The End"
      keywords={["shader", "basics", "end", "complete", "epilogue"]}
    />
    <h2>Shader Basics - The End</h2>
    <p>
      You've completed the basics of shader programming, from plotting points on
      a screen using a vertex shader to simulating lighting in a simple
      realistic way on objects.
    </p>
    <p>
      These concepts are the groundwork needed to help you get started and
      experiment with shader programming. As the last chapter says, the concepts
      for lighting are concepts that can be creatively experimented with.
    </p>
    <p>
      Start experimenting and see what crazy things you can come up with. Share
      what you've created with others, and show how you've done them as well.
      Either publish the code on repositories like GitHub, or create examples on
      shader sandboxes like{" "}
      <a
        href="http://glslsandbox.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        GLSL Sandbox
      </a>
      ,{" "}
      <a
        href="http://shaderfrog.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        ShaderFrog
      </a>
      , or{" "}
      <a href="http://shadertoy.com/" target="_blank" rel="noopener noreferrer">
        Shadertoy
      </a>{" "}
      (these use GLSL because they rely on WebGL).
    </p>
    <PageChange previous="/basics/lighting/" />
  </Layout>
)

export default EndPage
