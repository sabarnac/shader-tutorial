import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import NormalMappingFirstExample from "../../components/intermediates/normal-mapping/first-example"
import NormalMappingSecondExample from "../../components/intermediates/normal-mapping/second-example"
import NormalMappingThirdExample from "../../components/intermediates/normal-mapping/third-example"
import surface1 from "../../images/intermediates/surface-1.png"
import surface2 from "../../images/intermediates/surface-2.png"
import texture from "../../images/intermediates/texture-2.png"
import normalTexture from "../../images/intermediates/normal.png"
import { Link } from "gatsby"

const NormalMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Normal Mapping"
      description="A look into the how normal map textures are used to add lighting detail to objects."
      keywords={["normal", "mapping", "texturing", "shader", "intermediates"]}
    />
    <Content>
      <h2>Shader Intermediates - Normal Mapping</h2>
      <p>
        An issue with the lighting examples seen in the{" "}
        <Link to="/intermediates/lighting/">previous chapter on lighting</Link>{" "}
        is that the entire surface of the object had the same appearance, making
        it appear flat.
      </p>
      <h3>Example - A stone wall</h3>
      <NormalMappingFirstExample />
      <p>
        In the shown example of the stone wall, we've applied our naive approach
        to lighting the surface of the wall. The result is the appearance of a
        wall with detailed color, but still looking very flat due to the simple
        form of lighting.
      </p>
      <p>
        However, the wall shouldn't appear as flat. It has bumps, scratches,
        grooves, etc. that all interact with the light in a different way. This
        should result in detailed lighting to highlight the roughness and
        imperfections on the surface, giving it "depth".
      </p>
      <p>
        A similar situation was discussed and solved in the chapter on{" "}
        <Link to="/intermediates/color-mapping/">color mapping</Link>, where the
        lack of color detail from vertex data was solved by passing color
        information using a texture.
      </p>
      <p>
        The same concept of mapping can be used to add better lighting detail
        without increasing the complexity of the object. By modifying the way
        the light interacts with the surface using a texture, the wall can be
        made to appear rough instead of a smooth flat surface.
      </p>
      <h3>What is a normal map?</h3>
      <p>
        If we look into the{" "}
        <Link to="/intermediates/lighting/">lighting chapter</Link>, we see that
        there are three main components being used to describe the object
        through its vertices
      </p>
      <ul>
        <li>The vertex position.</li>
        <li>The vertex UV coordinates.</li>
        <li>The vertex normal.</li>
      </ul>
      <p>
        Among these, the main component that affects the factor of lighting on
        an object is the vertex normal.
      </p>
      <p>
        The reason for this is simple - the normal of a surface defines what
        direction the surface is facing, which is crucial for lighting.
      </p>
      <p>
        Since the direction of the surface determines what amount of, and how
        light will bounce and fall onto your eyes, this value can affect how a
        surface looks.
      </p>
      <p className="util text-center">
        <img
          alt="Smooth Surface Light Reflection"
          style={{ width: "65%" }}
          src={surface1}
        />
      </p>
      <p>
        With a smooth surface, all points on the surface have their normals
        pointing in the same direction. This means that light falling on the
        surface bounces and reflects in the exact same manner across it, giving
        it a flat appearance, similar to the wall example seen above.
      </p>
      <p className="util text-center">
        <img
          alt="Rough Surface Light Reflection"
          style={{ width: "65%" }}
          src={surface2}
        />
      </p>
      <p>
        In contrast, a rough and bumpy surface has points with normals pointing
        towards different directions. This results in certain spots reflecting a
        lot more light towards the users view, while other spots reflect less,
        or completely reflect away light from the users view.
      </p>
      <p>
        We can mimic the look of a rough surface by defining the normals of each
        fragment through the use of a texture, similar to how the color of each
        fragment of a surface was done when{" "}
        <Link to="/intermediates/color-mapping/">color mappping</Link>.
      </p>
      <p>
        This provides the ability to generate lighting detail similar to if the
        object was modeled with its roughness described through the polygons,
        but without the additional complexity and processing to deal with those
        additional polygons.
      </p>
      <p>
        Just like with a color map, a texture map used to describe the normals
        of an object is called a normal map, and the process of mapping to map
        normals of a fragment from a texture is called normal mapping.
      </p>
      <h3>Example - Normal mapped stone wall</h3>
      <p>The texture maps that will be used to color and light the wall are:</p>
      <p className="util text-center">
        <img
          alt="Stone Wall - Color Map"
          style={{ width: "65%" }}
          src={texture}
        />
        <br />
        Color/Diffuse map
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
      <p>
        The normal map is an image that contains the following information per
        pixel:
      </p>
      <ul>
        <li>
          The value of the normals are stored in the texture as their unit
          vectors.
        </li>
        <li>
          The x-axis component of the normal is encoded as the red color of the
          pixel, with the color values 0 to 255 (0.0 - 1.0 in float) mapping
          into the range -1 to 1 on the x-axis.
        </li>
        <li>
          The y-axis component of the normal is encoded as the green color of
          the pixel, with the color values 0 to 255 (0.0 - 1.0 in float) mapping
          into the range -1 to 1 on the y-axis.
        </li>
        <li>
          The z-axis component of the normal is encoded as the blue color of the
          pixel, with the color values 128 to 255 (0.5 - 1.0 in float) mapping
          into the range 0 to 1 on the z-axis.
        </li>
      </ul>
      <p>
        The reason why the z-axis is mapped only in the positive range is
        because any normal with a negative z-axis value is a direction that is
        pointing away from the view of the user, meaning that it would never be
        visible to the user anyways.
      </p>
      <p>
        The values in the normal map are stored in a 2D space called
        "tangent-space".
      </p>
      <p>
        Consider a sphere. A plane (a flat 2D surface) is considered "tangent"
        to a point on the sphere if the plane only touches the sphere aat that
        point, and does not touch it at any other neighbouring points.
      </p>
      <p className="util text-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Image_Tangent-plane.svg/2560px-Image_Tangent-plane.svg.png"
          alt="Wikipedia Tangent Plane Example"
          style={{ maxWidth: "750px" }}
        />
        <br />
        <a
          href="https://en.wikipedia.org/wiki/Tangent#/media/File:Image_Tangent-plane.svg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
        <p>
          <small>
            The plane shown here is the plane that is tangent to the point
            marked on the sphere. In other words, it is the tangent plane of the
            marked point on the sphere.
          </small>
        </p>
      </p>
      <p>
        This 2D plane is what is considered as the tangent space for that point
        of the sphere. In order to store the information of the normals of all
        points of that sphere, the values of the normals have to be recorded
        w.r.t the tangent space of the point they belong to.
      </p>
      <p>
        Since the calculations we've seen in previous chapters are done in a
        space that is not the tangent-space, in order to use a normal map a
        transformation of values has to occur to ensure that the calculation
        occurs in the same "space" to be valid.
      </p>
      <p>
        There are two potential options in order to fix calculations into a
        specific space:
      </p>
      <ul>
        <li>
          Keep other values as is, transform the normal map values from tangent
          space into the other spaces, and perform the calculations in the other
          spaces.
        </li>
        <li>
          Keep the normal map values as is, transform all other values from
          other spaaces into tangent space, and perform the calculations in
          tangent space.
        </li>
      </ul>
      <p>
        Just like with the model, view, and projection matrices, in order to
        transform values either into (or out of) tangent space, a matrix called
        the TBN (Tangent Bi-Tangent Normal) matrix is required.
      </p>
      <NormalMappingSecondExample />
      <NormalMappingThirdExample />
      <h3>Summary</h3>
    </Content>
    <PageChange previous="/intermediates/lighting/" />
  </Layout>
)

export default NormalMappingPage
