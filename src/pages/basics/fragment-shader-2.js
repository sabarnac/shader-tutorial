import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import FragmentShaderTwoFirstExample from "../../components/basics/fragment-shader-2/first-example"
import {
  firstVertexShaderSource,
  firstFragmentShaderSource,
} from "../../components/basics/fragment-shader-2/first-example-shaders"
import GlslCodeHighlight from "../../components/glsl-code-highlight"

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
        As learnt in the previous chapter, color information can only be mapped
        to the vertices of an object, with color values of parts of the object
        between the vertices being interpolated.
      </p>
      <p>
        However, now we wish to color an object using an image. This requires
        the image to be stored as a texture on the GPU and the texture being
        overlayed onto the object correctly.
      </p>
      <p>Let's first learn about how a texture is overlayed onto an object.</p>
      <h3>UV Mapping</h3>
      <p>
        The process of overlaying a texture (2D plane) onto an object (3D
        system) is known as UV mapping. Just as how the axes of a 3D system is
        denoted as X, Y, and Z, the axes of a texture are denoted as U, and V
        (because the other three are already taken).
      </p>
      <p>
        By mapping a vertex of an object to a particular texture coordinate
        (giving the vertex a "UV coordinate"), a texture can be overlayed onto
        an object by pinning points of the texture that to their mapped
        vertices.
      </p>
      <h3>An example - A cube</h3>
      <FragmentShaderTwoFirstExample />
      <h4>How it works</h4>
      <p>
        GPUs follow an operation similar to UV mapping. They can accept a
        texture, and the vertices, along with their mapped UV coordinates, are
        provided.
      </p>
      <p>
        These coordinates are then passed through the vertex shader to the
        fragment shader, with the GPU interpolating the coordinates as need for
        each fragment.
      </p>
      <p>
        The fragment shader can then take these coordinates and pull the
        required color value from the texture and set that as the final color of
        the image.
      </p>
      <p>
        <strong>Vertex Shader:</strong>
      </p>
      <GlslCodeHighlight code={firstVertexShaderSource.trim()} />
      <p>
        <strong>Fragment Shader:</strong>
      </p>
      <GlslCodeHighlight code={firstFragmentShaderSource.trim()} />
      <p>
        In the vertex shader, the UV coordinates of the vertex is provided
        through the <code>vertexUv</code> attribute, which is then passed to the
        fragment shader <code>uv</code>, allowing the GPU to interpolate the UV
        coordinates for each fragment.
      </p>
      <p>
        In the fragment shader, the color value of the texture at the given UV
        coordinates is retrieved through a texture sampler, which is then the
        final color assigned to the fragment.
      </p>
      <PageChange previous="/basics/fragment-shader/" />
    </Layout>
  )
}

export default VertexShaderPage
