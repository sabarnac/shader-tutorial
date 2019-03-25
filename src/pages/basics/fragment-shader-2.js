import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const VertexShaderPage = () => {
  return (
    <Layout>
      <SEO
        title="Fragment Shader Basics - Part 2"
        keywords={["fragment", "shader", "basics", "part", "two", "2"]}
      />
      <h2>Basics Of A Fragment Shader - Part 2</h2>
      <p>
        So far we've passed direct color information of vertices to the fragment
        shader, which was then interpolated for each fragment and then set as
        the pixel color.
      </p>
      <p>
        However, if we require to retrieve the color values form a texture, will
        the same process still apply? Let's take a look at a cube with a texture
        attached to it.
      </p>
      <h3>An example - A cube</h3>
      <p>TODO</p>
      <PageChange previous="/basics/fragment-shader/" />
    </Layout>
  )
}

export default VertexShaderPage
