import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
// import GlslCodeHighlight from "../../components/glsl-code-highlight"
// import { Link } from "gatsby"

const MappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Mapping"
      description="A look into the how textures are used to add additional detail in shaders."
      keywords={[
        "mapping",
        "textures",
        "texturing",
        "uv",
        "shader",
        "intermediates",
      ]}
    />
    <Content>
      <h2>Shader Intermediates - Mapping</h2>
      <p>
        A major concern when rendering objects in shaders is that all the
        details that can be defined and passed to the shaders have to be defined
        on a per-vertex level.
      </p>
      <p>
        This makes it harder to define detail inside a polygon, unless the
        polygons are small enough to represent a pixel on screen. This also
        means that any detail has to be easily interpolatable by the GPU when
        passing to the fragment shader.
      </p>
      <p>
        However, GPUs accept another form of data that is directly accessible in
        fragment shaders - textures! Textures are color data that can be
        directly read in fragment shaders to produce more detail than can be
        passed as vertex data.
      </p>
      <p>
        Textures are used in multiple ways when rendering objects in an image.
        They are useful for:
      </p>
      <ul>
        <li>
          Defining normals of individual fragments, which can be used to improve
          lighting detail.
        </li>
        <li>
          Defining color of individual fragments, to provide better color
          definition in cases where interpolation of color values isn't
          possible.
        </li>
        <li>
          Define velocity of individual fragments, which can be used for motion
          blur.
        </li>
        <li>
          Define shadow information of the scene, which can be used to darken
          parts of the object that are in shadow.
        </li>
        <li>And a lot more...</li>
      </ul>
      <p>
        Simply put, textures can be used to add more detail to an image that
        cannot be expressed through normal vertex data.
      </p>
      <p>
        In order to use textures on objects, we first need to define a way for
        how a texture is placed or "mapped" onto an object. This process is
        called UV mapping.
      </p>
      <h3>UV Mapping</h3>
      <h3>Summary</h3>
      <ul />
    </Content>
    <PageChange
      previous="/intermediates/image-generation/"
      next="/intermediates/color-mapping/"
    />
  </Layout>
)

export default MappingPage
