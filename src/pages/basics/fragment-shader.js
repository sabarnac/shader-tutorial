import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const FragmentShaderPage = () => (
  <Layout>
    <SEO
      title="Basics Of A Fragment Shader"
      keywords={["fragment", "shader", "basics"]}
    />
    <h2>Basics Of A Fragment Shader</h2>
    <p>foobar</p>
    <PageChange previous="/basics/vertex-shader/" />
  </Layout>
)

export default FragmentShaderPage
