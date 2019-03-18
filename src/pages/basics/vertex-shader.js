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
    <p>foobar</p>
    <p>
      <Link to="/basics/fragment-shader/">Go To Next Chapter.</Link>
    </p>
  </Layout>
)

export default VertexShaderPage
