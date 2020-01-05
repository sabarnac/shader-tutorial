import { Link } from "gatsby";
import React from "react";

import Content from "../../components/content";
import GlslCodeHighlight from "../../components/glsl-code-highlight";
import SpecularMappingFirstExample from "../../components/intermediates/specular-mapping/first-example";
import { firstFragmentShaderSource, firstVertexShaderSource } from "../../components/intermediates/specular-mapping/first-example-shaders";
import Layout from "../../components/layout";
import PageChange from "../../components/page-change";
import SEO from "../../components/seo";
import normalTexture from "../../images/intermediates/normal.png";
import specularTexture from "../../images/intermediates/specular.png";
import texture from "../../images/intermediates/texture-2.png";

const SpecularMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
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
        we can also store specular reflectivity information of a surface in a
        map as well. Such a map is called a specular map.
      </p>
      <h3>Specular Maps</h3>
      <p>
        Like the texture maps used in the{" "}
        <Link to="/intermediates/normal-mapping">normal mapping chapter</Link>,
        the texture maps that will be used to color and light the wall are:
      </p>
      <p className="util text-center">
        <img
          alt="Stone Wall - Color Map"
          style={{ width: "65%" }}
          src={texture}
        />
        <br />
        Diffuse map
      </p>
      <p className="util text-center">
        <img
          alt="Stone Wall - Normal Map"
          style={{ width: "65%" }}
          src={normalTexture}
        />
        <br />
        Normal map
      </p>
      <p className="util text-center">
        <img
          alt="Stone Wall - Specular Map"
          style={{ width: "65%" }}
          src={specularTexture}
        />
        <br />
        Specular map
      </p>
      <p>
        The specular map is a grayscale image that contains the following
        information per pixel:
      </p>
      <ul>
        <li>
          The value of the specular reflectivity of the surface is stored as a
          grayscale color value.
        </li>
        <li>
          The range of the color goes from 0 to 255 (0.0 - 1.0 in float),
          mapping into the range 0% - 100% specular reflectivity of the surface
          at that point.
        </li>
      </ul>
      <p>
        This means that the brighter a point is in a specular map, the smoother
        the surface is at that point, and the higher the specular lighting will
        be at that point (more of the light is directly reflected towards the
        camera).
      </p>
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
        At line 37, we grab the specular color value from the specular map, and
        use that as the specular reflectivity value for the specular lighting
        component.
      </p>
      <p>
        Since the colors stored in the specular map are in grayscale from the
        range of 0.0 to 1.0, the RGB value can be used as is and multiplied
        against the specular lighting vector.
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Similar to normal mapping, specular mapping can be used to map
          specular reflectivity to fragments inside a polygon to make a surface
          look more reflective and smooth.
        </li>
        <li>
          Specular maps add the apperence of smoothness on the surface of
          objects, allowing for the surface to reflect more light directly,
          increasing the specular lighting of the surface.
        </li>
        <li>
          The reflectivity of each point are stored in the image as a grayscale
          color value.
        </li>
        <li>
          The color values representing the specular reflectivity for each
          fragment are retrieved from the texture and used as is, since the
          colors are in grayscale and can be used directly to calculate how much
          specular light is actually reflected.
        </li>
      </ul>
    </Content>
    <PageChange previous="/intermediates/normal-mapping/" />
  </Layout>
)

export default SpecularMappingPage
