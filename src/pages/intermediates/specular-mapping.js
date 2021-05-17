import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import React from "react"

import Content from "../../components/content"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import SpecularMappingFirstExample from "../../components/intermediates/specular-mapping/first-example"
import { firstFragmentShaderSource, firstVertexShaderSource } from "../../components/intermediates/specular-mapping/first-example-shaders"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const SpecularMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Intermediates - Specular Mapping"
      description="A look into the how specular map textures are used to enhance specular lighting detail to objects."
      keywords={["specular", "mapping", "texturing", "shader", "intermediates"]}
    />
    <Content>
      <h2>Shader Intermediates - Specular Mapping</h2>
      <p>
        Similar to how we've stored information the normal information of a
        surface in a map (as taught in the{" "}
        <Link to="/intermediates/normal-mapping">normal mapping chapter</Link>),
        we can also store specular information of a surface in a map as well.
        Such a map is called a specular map.
      </p>
      <h3>Specular Maps</h3>
      <p>
        Like the texture maps used in the{" "}
        <Link to="/intermediates/normal-mapping">normal mapping chapter</Link>,
        the texture maps that will be used to color and light the wall are:
      </p>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/texture-2.png"
          alt="Stone Wall - Diffuse Map"
          style={{ maxWidth: "65%" }}
        />
        <br />
        Diffuse map
        <br />
        <a
          href="https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </div>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/normal.png"
          alt="Stone Wall - Normal Map"
          style={{ maxWidth: "65%" }}
        />
        <br />
        Normal map
        <br />
        <a
          href="https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </div>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/specular.png"
          alt="Stone Wall - Specular Map"
          style={{ maxWidth: "65%" }}
        />
        <br />
        Specular map
        <br />
        <a
          href="https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </div>
      <p>
        The specular map is an RGB image that contains the following information
        per pixel:
      </p>
      <ul>
        <li>
          The color value of a pixel describes what is the color of the specular
          highlight that is reflected from that point. Since the surface of the
          object can absorb part of the light and reflect the rest of it, this
          can change the specular reflection color and brightness.
        </li>
        <li>
          The brightness of the color maps into the specular reflectivity of the
          surface at that point. This means the brighter the color of the pixel,
          the smoother the surface is at that point and the more light it
          reflects.
        </li>
      </ul>
      <p>
        Let's look at the stone wall example with the specular map added in.
        We'll be performing the lighting calculation in view-space.
      </p>
      <h3>Example - Stone wall</h3>
      <SpecularMappingFirstExample />
      <GlslCodeHighlight
        code={firstVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <GlslCodeHighlight
        code={firstFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        At line 20, we grab the specular color value from the specular map, and
        use that as the specular highlight color + reflectivity value for the
        specular lighting component.
      </p>
      <p>
        Since the colors stored in the specular map are in RGB (with range 0 -
        255, 0.0 - 1.0 in GLSL), the color value tells us what is the color of
        the specular highlight that is being reflected, and the brightness of
        the color tells us how much light is reflected.
      </p>
      <p>
        As a result, the specular color retrieved from the map can be used as
        and multiplied against the specular lighting vector to give us the final
        specular lighting value for the fragment.
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Similar to normal mapping, specular mapping can be used to map
          specular highlight color and reflectivity to fragments inside a
          polygon to make a surface look more reflective and smooth.
        </li>
        <li>
          Specular maps add the appearence of smoothness on the surface of
          objects, allowing for the surface to reflect more light directly,
          increasing the specular lighting of the surface.
        </li>
        <li>
          The specular highlight color and reflectivity of each point are stored
          in the image as a RGB color value.
        </li>
        <li>
          The color values representing the specular highlight color and
          reflectivity for each fragment are retrieved from the texture and used
          as is, since the colors are in RGB and can be used directly to
          calculate how much specular light is actually reflected and the color
          of that light.
        </li>
      </ul>
    </Content>
    <PageChange previous="/intermediates/normal-mapping/" />
  </Layout>
)

export default SpecularMappingPage
