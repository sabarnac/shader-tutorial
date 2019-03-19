import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { Link } from "gatsby"

const VertexShaderPage = () => (
  <Layout>
    <SEO
      title="Basics Of A Vertex Shader"
      keywords={["vertex", "shader", "basics"]}
    />
    <h2>Basics Of A Vertex Shader</h2>
    <p>
      Vertex shaders are a shader <em>stage</em> whose task is to handle
      processing individual vertices provided from a dataset to the shader. They
      are supposed to take a single 3D vertex and plot it onto a 2D plane,
      optionally, with a 3rd axis value which is used to signify it's depth
      value, which is stored in a buffer (called the Z-buffer).
    </p>
    <p>
      Since this shader is executed per vertex on all vertexes passed to the
      shader pipeline, any operation that requires modifications to the vertex
      can be performed during this shader stage, as long as the final output is
      where the vertex is to be plotted in a 2D plane.
    </p>
    <p>Let's look at an example of a simple vertex shader below.</p>
    <p>
      <Link to="/basics/fragment-shader/">Go To Next Chapter.</Link>
    </p>
  </Layout>
)

export default VertexShaderPage
