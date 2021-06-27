import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import React from "react"

import Content from "../../components/content"
import Equation from "../../components/equation/equation"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import NormalMappingFirstExample from "../../components/intermediates/normal-mapping/first-example"
import NormalMappingSecondExample from "../../components/intermediates/normal-mapping/second-example"
import { secondFragmentShaderSource, secondVertexShaderSource } from "../../components/intermediates/normal-mapping/second-example-shaders"
import NormalMappingThirdExample from "../../components/intermediates/normal-mapping/third-example"
import { thirdFragmentShaderSource, thirdVertexShaderSource } from "../../components/intermediates/normal-mapping/third-example-shaders"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const NormalMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
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
        is that the entire surface of the object has a uniform appearance,
        making it appear flat.
      </p>
      <h3>Example - Stone wall</h3>
      <NormalMappingFirstExample />
      <p>
        In the above example of the stone wall, we've applied our naive approach
        to lighting the surface of the wall. The result is the appearance of a
        wall with detailed color, but looking very flat due to the simple form
        of lighting.
      </p>
      <p>
        The wall shouldn't appear as flat since it has bumps, scratches,
        grooves, etc. These interact with light in different ways resulting in a
        surface that highlights the roughness and imperfections on it, giving it
        "depth".
      </p>
      <p>
        A similar situation was discussed and solved in the chapter on{" "}
        <Link to="/intermediates/color-mapping/">color mapping</Link>, where the
        lack of color detail from vertex data was solved by passing color
        information using a texture.
      </p>
      <p>
        The same concept of mapping can be used to add better lighting detail
        without increasing the complexity of the object. By changing the way the
        light interacts with the surface using a texture, the wall can be made
        to appear rough instead of smooth and flat.
      </p>
      <h3>Why store normals in a map?</h3>
      <p>
        If we look into the{" "}
        <Link to="/intermediates/lighting/">lighting chapter</Link>, we see that
        there are three main components being used to describe the object
        through its vertices.
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
        direction the surface is facing, which is important for lighting.
      </p>
      <p>
        Since the direction of the surface determines what amount of and how
        light will bounce and fall onto your eyes, this value can affect how a
        surface looks.
      </p>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/surface-1.png"
          alt="Smooth Surface Light Reflection"
          style={{ maxWidth: "65%" }}
        />
      </div>
      <p>
        With a smooth surface, all points on the surface have their normals
        pointing in the same direction. This means that light falling on the
        surface bounces and reflects in the exact same manner across it, giving
        it a flat appearance, similar to the wall example seen above.
      </p>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/surface-2.png"
          alt="Rough Surface Light Reflection"
          style={{ maxWidth: "65%" }}
        />
      </div>
      <p>
        In contrast, a rough and bumpy surface has points with normals pointing
        towards different directions. This results in certain spots reflecting a
        lot more light towards the users view, while other spots reflect less,
        or completely reflect light away from the users view.
      </p>
      <p>
        We can mimic the look of a rough surface by defining the normals of each
        point through the use of a texture, similar to how the color of each
        point of a surface was defined the same way in the{" "}
        <Link to="/intermediates/color-mapping/">color mappping</Link> chapter.
      </p>
      <p>
        This provides the ability to generate lighting detail similar to if the
        object was modeled with its roughness described through polygons, but
        without the additional complexity and processing to deal with those
        polygons.
      </p>
      <p>
        Just like with a diffuse map, a texture map used to describe the normals
        of an object is called a normal map, and the process of mapping normals
        of a fragment from a texture is called normal mapping.
      </p>
      <h3>Normal Maps</h3>
      <p>The texture maps that will be used to color and light the wall are:</p>
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
      <p>
        The normal map is an image that contains the following information per
        pixel:
      </p>
      <ul>
        <li>
          The value of the normals are stored in the map as their unit vectors.
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
        The values of the normals in the normal map are stored in a 2.5D space
        called "tangent-space".
      </p>
      <h4>Tangent-Space</h4>
      <p>
        Consider a sphere. A plane (a flat 2D surface) is considered "tangent"
        to a point on the sphere if the plane only touches the sphere at that
        point and not at any other neighbouring points.
      </p>
      <p className="util text-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Image_Tangent-plane.svg/2560px-Image_Tangent-plane.svg.png"
          alt="Wikipedia Tangent Plane Example"
          style={{ width: "65%" }}
        />
        <br />
        <a
          href="https://en.wikipedia.org/wiki/Tangent#/media/File:Image_Tangent-plane.svg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
        <br />
        <small>
          The plane shown here is the plane that is tangent to the point marked
          on the sphere. In other words, it is the tangent plane of the marked
          point on the sphere.
        </small>
      </p>
      <p>
        This plane is what is considered as XY-axis part of the tangent-space
        for that point of the sphere, with the Z-axis protruding outwards and
        away from the sphere (the direction of the normal of that point on the
        sphere).
      </p>
      <p>
        In order to store the information of the normals of all points of that
        sphere, the values of the normals have to be recorded w.r.t the
        tangent-space of the point they belong to.
      </p>
      <h3>Calculating the lighting</h3>
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
          Keep other values as is, transform the normal map values from
          tangent-space into the other spaces, and perform the calculations in
          the other spaces.
        </li>
        <li>
          Keep the normal map values as is, transform all other values from
          other spaces into tangent-space, and perform the calculations in
          tangent-space.
        </li>
      </ul>
      <p>
        In order to perform either of these, we'll need a certain matrix to
        perform the transformation. This matrix is called the
        Tangent-Bitangent-Normal matrix (or TBN matrix).
      </p>
      <h4>TBN Matrix</h4>
      <p>
        Just like with the model, view, and projection matrices, in order to
        transform values either into (or out of) tangent-space, a matrix called
        the TBN (Tangent Bi-Tangent Normal) matrix is required.
      </p>
      <p>
        A TBN matrix for a vertex is calculated by generating a 3x3 matrix using
        the tangent, bi-tangent, and normal direction values of a vertex.
      </p>
      <p>
        If we represent the tangent vector as T, bi-tangent vector as B, and
        normal vector as N, the TBN matrix would look like:
      </p>
      <p className="util text-center">
        <Equation
          text={`TBN = [[T_x, B_x, N_x], [T_y, B_y, N_y], [T_z, B_z, N_z]]`}
        />
      </p>
      <p>
        Similar to how a model matrix can transform a point or direction from
        model-space into world-space, a TBN matrix can transform a point or
        direction from tangent-space into model-space.
      </p>
      <p>
        Similarly, if the inverse of the TBN matrix is used instead, then the
        matrix can transform a point or direction from model-space into
        tangent-space. This is useful if you wish to keep calculations present
        in tangent-space.
      </p>
      <p>
        Since the TBN matrix is calculated for each vertex, the matrix value for
        each fragment is interpolated from the matrix values for each vertex
        that forms the polygon that the fragment belongs to.
      </p>
      <p>
        Let's look at an example where the calculation for lighting using the
        normal values in the normal map are done in view-space using the TBN
        matrix.
      </p>
      <h3>Example - Normal-mapped stone wall (in view-space)</h3>
      <NormalMappingSecondExample />
      <GlslCodeHighlight
        code={secondVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <GlslCodeHighlight
        code={secondFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        The shaders are written similar to the final shader in the{" "}
        <Link to="/intermediates/lighting/">lighting chapter</Link>, but with
        all the main lighting calculation moved to the fragment shader. The
        reason for this is since we'd be grabbing the normal of the surface at
        the fragment level, the lighting can only be calculated in the fragment
        shader.
      </p>
      <p>
        The first step is to calculate the TBN matrix which we need for
        transforming the normal values from tangent-space into view-space. This
        is done from line 22 onwards in the vertex shader.
      </p>
      <p>
        The tangent, bi-tangent and normal values for each vertex in a model is
        known beforehand. These values are in model-space, and so need to be
        converted to view-space in order to calculate the TBN matrix in
        view-space.
      </p>
      <p>
        The tangent, bi-tangent and normal values are first normalized
        (converted into a unit vector), and then a 3x3 matrix is constructed
        using them, as explained previously.
      </p>
      <p>
        The resultant matrix is a TBN matrix that transforms vectors from
        tangent-space to model-space. Since we want to work in view-space
        instead, we multiply the model-view matrix against the TBN matrix to get
        a TBN matrix in view-space.
      </p>
      <p>
        However, if you notice carefully, the TBN matrix is a 3x3 matrix,
        whereas a model-view matrix is a 4x4 matrix.
      </p>
      <p>
        To transform the TBN matrix into view-space, the last column and last
        row of the model-view matrix can be removed in order to multiply it
        against the TBN matrix. This is fine because those fields don't contain
        any values that affect the calculation.
      </p>
      <p>
        Alternatively, the TBN matrix can be converted into a 4x4 matrix, but
        this wouldn't provide much benefit as the resultant matrix would be used
        with vectors with three dimensions, not four.
      </p>
      <p>
        The calculated TBN matrix in view-space is now passed to the fragment
        shader, along with certain other values that can only be calculated in
        the vertex shader (<code>vertexPosition_viewSpace</code>).
      </p>
      <p>
        In the fragment shader, the normal value of the fragment is retrieved
        the normal map, similar to how the color value is retrieved from tge
        color map
      </p>
      <p>
        Once the normal color value is retrieved, it needs to be converted into
        an actual normal vector (in tangent-space). Since we know what the range
        of the color values are supposed to represent, we can perform the
        conversion using a simple mathematical formula.
      </p>
      <p className="util text-center">
        <Equation text={`"normal" = ("normalColor" * 2.0) - 1.0`} />
      </p>
      <p>
        Let's take a color value of whose RGB value is{" "}
        <Equation text={`"normalColor" = [128, 128, 128]`} />. In OpenGL, the
        colors are represented in a range of 0 - 1 instead of 0 - 255, so the
        RGB value would actually be{" "}
        <Equation text={`"normalColor" = [0.5, 0.5, 0.5]`} />.
      </p>
      <p>
        This color value is right in the middle of the color range, so it should
        represent a normal vector{" "}
        <Equation text={`"normal" = [0.0, 0.0, 0.0]`} />.
      </p>
      <p>
        When we plug in the normal color value into our formula for calculating
        the normal, we get:
      </p>
      <p className="util text-center">
        <Equation
          text={`"normal" = ([0.5, 0.5, 0.5] * 2.0) - 1.0 = [1.0, 1.0, 1.0] - 1.0 = [0.0, 0.0, 0.0]`}
        />
      </p>
      <p>Which matches perfectly with what we expect to get!</p>
      <p>
        Just to further verify the formula, let's take a color value{" "}
        <Equation text={`"normalColor" = [64, 64, 192]`} />. In OpenGL, this
        would be <Equation text={`"normalColor" = [0.25, 0.25, 0.75]`} />, which
        should represent a normal{" "}
        <Equation text={`"normal" = [-0.5, -0.5, 0.5]`} />.
      </p>
      <p>Plugging this color value into the formula returns:</p>
      <p className="util text-center">
        <Equation
          text={`"normal" = ([0.25, 0.25, 0.75] * 2.0) - 1.0 = [0.5, 0.5, 1.5] - 1.0 = [-0.5, -0.5, 0.5]`}
        />
      </p>
      <p>Which again equals to the expected normal vector.</p>
      <p>
        Once the normal vector in tangent-space is calculated, it can now be
        transformed into view-space by multiplying the TBN matrix against it.
      </p>
      <p className="util text-center">
        <Equation text={`"normal"_"viewSpace" = "TBN" times "normal"`} />
      </p>
      <p>
        Once this is calculated, the rest of the lighting calculations use this
        normal value to calculate the lighting on the fragment. This is similar
        to what was taught in the{" "}
        <Link to="/intermediates/lighting/">lighting chapter</Link>.
      </p>
      <p>
        Now that we've seen what the calculation looks like in view-space, let's
        now look at how the calculation would appear in tangent-space.
      </p>
      <h3>Example - Normal-mapped stone wall (in tangent-space)</h3>
      <NormalMappingThirdExample />
      <GlslCodeHighlight
        code={thirdVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <GlslCodeHighlight
        code={thirdFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        Since the TBN matrix we previously had transformed vectors from
        tangent-space to view-space, in order to transform values the other way
        we need to calculate the transpose of the TBN matrix we previously
        calculated. This is done in line 33 of the vertex shader.
      </p>
      <p>
        Once the new TBN matrix is calculated, we now transform all the values
        we were previously using in view-space into tangent space. In the vertex
        shader, we transform the vertex position into tangent-space, and in the
        fragment shader we transform the light position into tangent-space.
      </p>
      <p>
        Once in the fragment shader, we grab the normal vector from the normal
        map as we did in the previous example. Since the lighting calculations
        are being done in tangent-space, only the conversion from the color
        value to the vector value is required.
      </p>
      <p>
        Now that all the variables we require for calculating lighting are in
        tangent-space, we can perform the lighting calculations in the exact
        same way as in the previous example. The resultant lighting value will
        be the same!
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Similar to color mapping, normal mapping can be used to map normals to
          fragments inside a polygon to add more detail to a surface.
        </li>
        <li>
          Normal maps add the appearance of roughness or small bumps on the
          surface of objects.
        </li>
        <li>
          The normals of each point are stored in an image in "tangent-space"
          with the X, Y, and Z coordinates represented using RGB color values.
        </li>
        <li>
          The color values representing the normals for each fragment are
          retrieved from the texture and then converted into normal vectors,
          which are then used to perform lighting calculations.
        </li>
        <li>
          Check out{" "}
          <a
            href="http://www.mattrittman.com/create-normal-map-photoshop/"
            rel="noopener noreferrer"
            target="_blank"
          >
            this guide by Matt Rittman
          </a>{" "}
          on how to generate a normal map in Photoshop. You should find other
          references for generating normal maps online.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/intermediates/lighting/"
      next="/intermediates/specular-mapping/"
    />
  </Layout>
)

export default NormalMappingPage
