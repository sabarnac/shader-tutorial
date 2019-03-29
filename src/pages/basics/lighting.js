import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import LightingNoLightExample from "../../components/basics/lighting/no-light-example.js"
import LightingFirstExample from "../../components/basics/lighting/first-example"
import LightingSecondExample from "../../components/basics/lighting/second-example"
import LightingThirdExample from "../../components/basics/lighting/third-example"
import LightingFourthExample from "../../components/basics/lighting/fourth-example"
import LightingIssueExample from "../../components/basics/lighting/issue-example"
import { renderEquation } from "../../components/util"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import {
  firstVertexShaderSource,
  firstFragmentShaderSource,
} from "../../components/basics/lighting/first-example-shaders"
import { Link } from "gatsby"

const ShaderTexturingPage = () => {
  return (
    <Layout>
      <SEO
        title="Shader Basics - Lighting"
        keywords={[
          "lighting",
          "shader",
          "basics",
          "diffuse",
          "specular",
          "ambient",
        ]}
      />
      <h2>Shader Basics - Lighting</h2>
      <p>
        While adding textures to color your objects helps to add more detail,
        simulating the lighting of the environment on the object adds further
        detail and makes it appear in place with the rest of the world.
      </p>
      <p>
        There are primarily components of lighting that come into effect when
        simulating light falling on an object:
      </p>
      <ul>
        <li>The diffuse component</li>
        <li>The ambient component</li>
        <li>The specular component</li>
      </ul>
      <p>
        The{" "}
        <a
          href="https://www.opengl-tutorial.org/beginners-tutorials/tutorial-8-basic-shading/"
          rel="noopener noreferrer"
          target="_blank"
        >
          following chapter
        </a>{" "}
        of the{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          rel="noopener noreferrer"
          target="_blank"
        >
          OpenGL Tutorial
        </a>{" "}
        provides a good explanation of what the three components are, but we'll
        be going through them here as well. You can use that material as a
        secondary reference if required.
      </p>
      <p>
        Let's look at each component, and how they effect the look of the object
        when simulating lighting. We'll currently only work with point light,
        which has light rays going in every direction, but the same principles
        apply to other kinds of lights, as well as multiple sources of light,
        but possibly with more restrictions.
      </p>
      <p>
        But before that, let's look at how the cube appears with no lighting for
        reference.
      </p>
      <LightingNoLightExample />
      <h3>The Diffuse Component</h3>
      <p>
        The first component is the diffuse component and is the primary lighting
        component that lights up objects.
      </p>
      <p>
        When a ray of light hits an object, due to the roughness and texture of
        the object, this light spreads out in multiple directions.
      </p>
      <p>
        However, not all of the light is reflected. The parts of the light that
        don't fall in the color spectrum of the surface the light hits is
        absorbed by the object, and only the rest of the light is reflected.
      </p>
      <p className="util text-center">
        <img
          src="https://www.opengl-tutorial.org/assets/images/tuto-8-basic-shading/diffuseWhite1.png"
          alt="Diffuse Lighting Main Example"
        />
        <br />
        <a
          href="https://www.opengl-tutorial.org/beginners-tutorials/tutorial-8-basic-shading/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </p>
      <p>
        This results in the reflected light matching the color of the surface,
        which means this light component is the light that actually shows you
        what the object looks like.
      </p>
      <p>
        The brightness of the reflected light is also dependent on the angle at
        which the incident light hits the surface of the object.
      </p>
      <p className="util text-center">
        <img
          src="https://www.opengl-tutorial.org/assets/images/tuto-8-basic-shading/diffuseAngle.png"
          alt="Diffuse Lighting Angle Example"
        />
        <br />
        <a
          href="https://www.opengl-tutorial.org/beginners-tutorials/tutorial-8-basic-shading/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </p>
      <p>
        If the light hits the surface of the object at an angle, the light gets
        spread out over a wide surface.
      </p>
      <p>
        However, if the light hits the surface at an angle that's closer to
        perpendicular to the surface of the obejct, then a lot more light gets
        concentrated across a smaller surface, making the surface appear
        brighter.
      </p>
      <p>
        This can be done through an experiment as well. Grab your phone and turn
        on the flashlight (or else grab a torch) and shine it perpendicularly
        away by a certain distance on a rough surface and note down the
        brightness.
      </p>
      <p>
        Next, shine it from approximately the same distance at an acute angle to
        the surface, with the light source being the same distance away as in
        the first test.
      </p>
      <p>
        The brightness of the surface should decrease when the light is shining
        at an angle compared to when it was perpendicularly. The color of the
        light should also match the color of the surface of the object as well.
      </p>
      <p>This is what is considered the diffused lightiing component.</p>
      <h3>Example - Cube with diffused lighting</h3>
      <LightingFirstExample />
      <h4>How it works</h4>
      <p>
        We now know that diffuse light is the light that shows the color of the
        surface of an object, and it's brighter when the incident light is
        closer to being perpendicular to the surface.
      </p>
      <p>
        The first thing required is the normal of the surface being lighted. A
        normal can be considered as a direction that is perpendicular to a
        surface. So if there was a surface that was across the XZ-plane, then
        it's normal would be any direction along the Y-axis.
      </p>
      <p>
        Since we can only tell the GPU information about each vertex, the normal
        of the plane is set as the normal of each vertex forming that plane.
      </p>
      <p>
        This way when the entire plane is being drawn, since all vertices have
        the same normal, the entire plane will also be interpolated to have that
        normal.
      </p>
      <p>
        The second thing required is the direction of the light. Since the
        position of the light and objects in the world are known, and the light
        is a point light, the direction would of the light would be from the
        light source to the object itself.
      </p>
      <p>
        In order to determine the brightness effect of the light on a surface of
        the object, the angle between the normal of the surface and the
        direction of light must be compared.
      </p>
      <h5>The mathematics</h5>
      <p>
        If the direction of the light is perpendicular to the surface, then the
        angle between the direction of light and the normal of the surface will
        equal 0 degrees, which means the brightness at that point should be
        brightest.
      </p>
      <p>
        Conversely, if the direction of the light is parallel to the surface,
        then the angle between the direction of light and the normal of the
        surface will be 90 degrees, which should result in no light present.
      </p>
      <p>
        Consider brightness as a factor. If this factor is 1, then the
        brightness is at its highest possible value, and at 0, it is at it's
        lowest possible value.
      </p>
      <p>
        So a mathematical operation is required which, when given an angle of 0
        degrees provides a result of 1, and when given an angle of 0 degrees
        provides a result of 0.
      </p>
      <p>
        The best operation for this is the trignometric function{" "}
        {renderEquation(`cos(theta)`)}, where {renderEquation(`theta`)} is the
        angle between the two directions.
      </p>
      <p>
        Do note that if the angle between the normal and the light is greater
        than 90 and upto 180, the result of this operation goes upto -1. So the
        result of the operation needs to be clamped to 0 to prevent the diffuse
        factor from being negative, since you can't have a negative amount of
        light.
      </p>
      <p>
        In the GPU, we'll be representing the directions of the surface normal
        and light direction in the form of vectors. So a mathematical operation
        is required between two vectors, which can provide us with the{" "}
        {renderEquation(`cos(theta)`)} result of the angle between them. This
        operation is the <code>dot</code> product.
      </p>
      <p>
        Let us take two vectors {renderEquation(`vec v_1 = ((x_1),(y_1))`)} and{" "}
        {renderEquation(`vec v_2 = ((x_2),(y_2))`)}. The <code>dot</code>{" "}
        product of these two vectors would be{" "}
        {renderEquation(`vec v_1 cdot vec v_2 = ((x_1 ** x_2),(y_1 ** y_2))`)}.
      </p>
      <p>
        Another way to represent this operation is{" "}
        {renderEquation(
          `vec v_1 cdot vec v_2 = norm(vec v_1) norm(vec v_2) cos(theta)`
        )}
        , where {renderEquation(`norm(vec v_1)`)} and{" "}
        {renderEquation(`norm(vec v_2)`)} represent the magnitute of{" "}
        {renderEquation(`vec v_1`)} and {renderEquation(`vec v_2`)}{" "}
        respectively.
      </p>
      <p>
        If we move around parts of this equation, we can represent this as
        equation as{" "}
        {renderEquation(
          `(vec v_1) / norm(vec v_1) cdot (vec v_2) / norm(vec v_2) = cos(theta)`
        )}
        , where {renderEquation(`(vec v) / norm(vec v)`)} is considered the unit
        vector of the vector (because the magnitude of the vector is removed
        from the vector itself).
      </p>
      <p>
        This results in the final equation being{" "}
        {renderEquation(`hat(v_1) cdot hat(v_2) = cos(theta)`)}. So we can
        determine the {renderEquation(`cos(theta)`)} of two vectors by finding
        the dot product of their unit vectors. This can be done easily, because
        there are built-in functions that let us calculate the unit vector of a
        given vector.
      </p>
      <p>
        Along with the angle, other factors such as the color of the light, as
        well as the intensity of the light also affect the brightness of the
        object.
      </p>
      <p>
        A light of a particular color will increase the brightness within that
        color spectrum, and the intensity of the light will further increase the
        brightness as well.
      </p>
      <p>
        However, there is also a factor that affects how much the brightness of
        the light is reduced by, which is distance. This is due to the
        inverse-square law, which tells us that the intensity of the light is
        inversely proportional to the square of the distance between the light
        and the object.
      </p>
      <p>
        From these factors, the final equation for the factor that affects the
        diffuse lighting of the object is:
      </p>
      <p className="util text-center">
        {renderEquation(
          `"diffuseFactor" = ((hat "lightDirection" cdot hat "surfaceNormal") ** "lightColor" ** "lightIntensity") / "distance" ^ 2`
        )}
      </p>
      <p>Let us look at the code to see how this equation is implemented.</p>
      <GlslCodeHighlight
        code={firstVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <GlslCodeHighlight
        code={firstFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        In the vertex shader, the lines 17-21 are the standard operations we've
        seen in previous chapters, so we can ignore those.
      </p>
      <p>
        The important things to note from this is that the results of the
        position of the vertex in the world space and view space (see the{" "}
        <Link to="/basics/vertex-shader">Vertex Shader Basics</Link> if you need
        to recollect) are saved in certain variables which will be required
        later.
      </p>
      <p>
        After those lines, we first calculate the combined product of the light
        color and intensity, which is a simple multiplication. This result is
        stored in a <code>vec3</code> named <code>lightColorIntensity</code>,
        since it stores the intensity of each color (R, G, and B) of the light.
      </p>
      <p>
        The distance between the light source and object is very simple. Since
        the positions of both are already stored in vectors, the distance
        between them can be calculated through a built-in function available in
        shading languages. In GLSL, this function is <code>distance</code>.
      </p>
      <p>
        The direction of the normal of the vertex is required to be known
        respective to the camera, which is why the calculation of the normal in
        viewspace is performed and stored in
        <code>normal_viweSpace</code>. This is similarly done for the light
        direction and stored in the <code>lightDirection_viweSpace</code>.
      </p>
      <p>
        The results of those two calculations provide a vector, which needs to
        be converted into a unit vector, since that is what is required in order
        to calculate the diffuse factor by the angle of the light and the normal
        of the surface. In GLSL, the built-in function for this calculation is{" "}
        <code>normalize</code>.
      </p>
      <p>
        The diffuse strength is calculated based on the angle of the light and
        surface normal by finding the dot product of{" "}
        <code>normal_viewSpace</code> and <code>lightDirection_viewSpace</code>{" "}
        (done through the built-in function <code /> in GLSL). This is clamped
        between 0 and 1 to prevent a negative factor.
      </p>
      <p>
        The final diffuse lighting factor of the object is calculated by
        multiplying the diffuse strength calculated in the previous step with
        the product of the light color and intensity.
      </p>
      <p>
        This result is then divided by the square of the distance between the
        light and the object, which is required due to the inverse-square law.
      </p>
      <p>
        This final diffuse factor is then passed to the fragment shader,
        allowing the value to be interpolated per fragment. The diffuse factor
        is multiplied with the color of the fragment to determine how bright
        that fragment will be.
      </p>
      <p>
        Do note that the alpha value of the fragment color is not multiplied,
        since the transparency of an object would not change based upon the
        light falling on it.
      </p>
      <h3>The Ambient Component</h3>
      <LightingSecondExample />
      <h3>The Specular Component</h3>
      <LightingThirdExample />
      <h3>Color Banding</h3>
      <LightingIssueExample />
      <h3>Dithering</h3>
      <LightingFourthExample />
      <PageChange previous="/basics/texturing-branching/" />
    </Layout>
  )
}

export default ShaderTexturingPage
