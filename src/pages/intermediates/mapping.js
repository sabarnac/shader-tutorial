import { StaticImage } from "gatsby-plugin-image"
import React from "react"

import Content from "../../components/content"
import Heading from "../../components/heading"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const MappingPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Intermediates - Mapping"
      description="A look into the how textures/maps are used to add additional detail in shaders."
      keywords={["mapping", "textures", "uv", "shader", "intermediates"]}
    />
    <Content>
      <h1>Shader Intermediates - Mapping</h1>
      <p>
        A major concern when rendering objects in shaders is that all object
        details that can be defined and passed to shaders have to be defined on
        a per-vertex level.
      </p>
      <p>
        This makes it harder to define detail inside a polygon, unless the
        polygons are small enough to represent a pixel on screen. This also
        means that any detail has to be easily interpolatable by the GPU when
        passing to the fragment shader.
      </p>
      <p>
        However, GPUs accept another form of data, one that is directly
        accessible in fragment shaders - textures! Textures are images, i.e.,
        array of color data, whose values can be read at specific coordinates
        and then used in various operations.
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
        Simply put, textures can be used to add more detail to an object that
        cannot be expressed through vertex data.
      </p>
      <p>
        In order to use textures on objects, we first need to learn how a
        texture is overlayed onto on object.
      </p>
      <Heading type="h2">UV Mapping</Heading>
      <p>
        The process of overlaying, or "mapping", a texture (2D plane) onto an
        object (3D system) is known as UV mapping. Just as how the axes of a 3D
        system is denoted as X, Y, and Z, the axes of a texture are denoted as
        U, and V.
      </p>
      <p>
        By mapping a vertex of an object to a particular texture coordinate
        (giving the vertex a "UV coordinate"), a texture can be overlayed onto
        an object by pinning points of the texture to their mapped vertices.
      </p>
      <p>For example, suppose we have the following triangle:</p>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/triangle.png"
          alt="Triangle - UV Mapping Example"
          style={{ maxWidth: "65%" }}
        />
      </div>
      <p>
        And we wish to map a part of the following texture onto the triangle:
      </p>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/triangle-texture.png"
          alt="Triangle Texture - UV Mapping Example"
          style={{ maxWidth: "65%" }}
        />
      </div>
      <p>
        We can first overlay the triangle on top of the image and adjust the
        corners of the triangle, such that the triangle covers the area of the
        texture that needs to be used to color it. The corners are also placed
        in the correct positions that represent what color they should be.
      </p>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/triangle-texture-mapped.png"
          alt="Mapped Triangle Texture - UV Mapping Example"
          style={{ maxWidth: "65%" }}
        />
      </div>
      <p>
        <em>
          Note: For the sake of simplicity, in this example we've overlayed the
          triangle with no modification in position of the corners.
        </em>
      </p>
      <p>
        We can then note down the coordinates of the corners of the triangle
        within the texture, relative to an origin. Generally, the origin is
        either the top left corner or bottom left corner of the image, depending
        on the graphics API you use.
      </p>
      <p>These become the UV coordinates of the vertices in the texture.</p>
      <p>
        The UV coordinates can be passed along with the rest of the vertex data.
        When passing the coordinates to the fragment shader, these values can be
        easily interpolated by the GPU per fragment, providing an accurate UV
        coordinate of the fragment within the texture.
      </p>
      <p>
        The value of the texture at the interpolated coordinate can then be read
        within the fragment shader and be used for any operation.
      </p>
      <p>
        Textures used for operations other than coloring are referred to as
        "maps", since they act as a map upon which the fragment being drawn is
        present within, and needs to be found using the UV coordinates of that
        fragment.
      </p>
      <p>
        In the next chapter, we'll look at the use of texture mapping to color
        objects, the process being called color mapping, or texturing (for
        simplicity).
      </p>
      <Heading type="h2">Summary</Heading>
      <ul>
        <li>
          GPU can only be provided with raw data at the vertex level. This
          creates a problem when more detail is required in the image.
        </li>
        <li>
          However, GPUs also accept a separate type of data known as textures,
          which contains an array of color data.
        </li>
        <li>
          A texture can be overlayed onto an object through the process of UV
          mapping, where each vertex of the object is mapped to a coordinate in
          the texture.
        </li>
        <li>
          By passing the UV coordinates as part of the vertex data, the
          fragments inside the polygons can have their UV coordinates
          interpolated by the GPU. These can be used to read values from the
          texture, which can then be used during operations and rendering.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/intermediates/image-generation/"
      next="/intermediates/color-mapping/"
    />
  </Layout>
)

export default MappingPage
