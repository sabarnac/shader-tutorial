import React from "react"

import Content from "../../components/content"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const EndPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Basics - The End"
      description="An epilogue to the basics of shaders."
      keywords={["shader", "basics", "end", "complete", "epilogue"]}
    />
    <Content>
      <h2>Shader Basics - The End</h2>
      <p>
        You've completed the basics of shader programming, from plotting points
        on a screen using a vertex shader to simulating lighting in a simple
        realistic way on objects.
      </p>
      <p>
        These concepts are the groundwork needed to help you get started and
        experiment with shader programming. Examples are provided for how
        experimentation can be done within the vertex and fragment shader
        chapters with the final examples in them.
      </p>
      <p>
        Start experimenting and see what crazy things you can come up with.
        Share what you've created with others, and show how you've done them as
        well. Either publish the code on repositories like GitHub, or create
        examples on shader sandboxes like{" "}
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
        <a
          href="http://shadertoy.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shadertoy
        </a>{" "}
        (these use GLSL because they rely on WebGL).
      </p>
    </Content>
    <PageChange previous="/basics/fragment-shader/" />
  </Layout>
)

export default EndPage
