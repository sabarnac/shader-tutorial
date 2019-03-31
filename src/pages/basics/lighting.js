import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
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
import { secondFragmentShaderSource } from "../../components/basics/lighting/second-example-shaders"
import {
  thirdVertexShaderSource,
  thirdFragmentShaderSource,
} from "../../components/basics/lighting/third-example-shaders"
import { fourthFragmentShaderSource } from "../../components/basics/lighting/fourth-example-shaders"
import glslReflect from "../../images/basics/glsl-reflect.png"
import banding from "../../images/basics/banded.png"
import bandingExaggerated from "../../images/basics/banded-exaggerated.png"
import noised from "../../images/basics/noised.png"
import noisedExaggerated from "../../images/basics/noised-exaggerated.png"
import actualGradient from "../../images/basics/actual-gradient.png"
import bandedGradient from "../../images/basics/banded-gradient.png"

const LandingPage = () => {
  return (
    <Layout>
      <SEO
        title="Shader Basics - Lighting"
        description="A look into how lighting can be simulated on objects through shaders."
        keywords={[
          "lighting",
          "shader",
          "basics",
          "diffuse",
          "specular",
          "ambient",
          "banding",
          "dithering",
        ]}
      />
      <Content>
        <h2>Shader Basics - Lighting</h2>
        <p>
          While adding textures to color your objects helps to add more detail,
          simulating the lighting of the environment on the object adds further
          detail and makes it appear in place with the rest of the world.
        </p>
        <p>
          There are three components of light reflection that come into effect
          when simulating light falling on an object:
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
          provides a good explanation of what the three components are, but
          we'll be going through them here as well. You can use that material as
          a secondary reference if required.
        </p>
        <p>
          Let's look at each component, and how they effect the look of the
          object when simulating lighting. We'll only work with a single point
          light, which has light rays going from a single point in every
          direction, but the same principles apply to other kinds of lights, as
          well as multiple sources of light.
        </p>
        <p>
          But before that, let's look at how the cube appears with no lighting
          for reference.
        </p>
        <LightingNoLightExample />
        <h3>The Diffuse Component</h3>
        <p>
          The first component is the diffuse component and is the primary
          reflection component that lights up objects.
        </p>
        <p>
          When a ray of light hits an object, due to the roughness and texture
          of the object, this light spreads out and reflects in multiple
          directions.
        </p>
        <p>
          However, not all of the light is reflected. Certain colors that are
          part of the light are absorbed by the object, with the rest being
          reflected. The colors that are reflected by the object are the ones
          that we see, which means these are the colors which we see as being
          the color of that object.
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
          For example, when white light falls on an apple, we see that the apple
          is red. This is because white light is made up of multiple colors in a
          spectrum mixed together.
        </p>
        <p>
          The colors that are not red are absorbed by the surface of the apple,
          and the red components of light that remain are reflected. This
          results in us seeing the apple as being red.
        </p>
        <p>
          The light that shows us this color is what we consider as the diffuse
          component of the light reflection of the apple.
        </p>
        <p>The diffuse component is dependent on four factors:</p>
        <ul>
          <li>
            <strong>The color of the light</strong> - If the light is red and
            the object is blue, since these two colors are completely separate
            in the color spectrum, all the light is absorbed by the object and
            nothing is reflected, making the object appear black (or having no
            color).
          </li>
          <li>
            <strong>The intensity of the light</strong> - The brighter the
            source of light is, more light will hit an object, making it appear
            brighter (unless the example in the first point occurs).
          </li>
          <li>
            <strong>The distance of the light source from the object</strong> -
            The further away a source of light is from an object, the less
            intense the light will be when it hits the object. This is due to
            the
            <a
              href="https://en.wikipedia.org/wiki/Inverse-square_law"
              target="_blank"
              rel="noopener noreferrer"
            >
              inverse-square law
            </a>
            , which states that the intensity of the light is inversely
            proportional to the square of the distance between the light source
            and the object.
          </li>
          <li>
            <strong>The angle at which the light hits the object</strong> - This
            we'll explain below.
          </li>
        </ul>
        <p>
          If the light hits the surface of the object at an angle, the light
          gets spread out over a wide surface.
        </p>
        <p>
          However, if the light hits the surface at an angle that's closer to
          perpendicular to the surface of the obejct, then a lot more light gets
          concentrated across a smaller surface, making the surface appear
          brighter.
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
          This can be done through an experiment as well. Grab your phone and
          turn on the flashlight (or else grab a torch) and shine it
          perpendicularly away by a certain distance on a rough surface and note
          down the brightness.
        </p>
        <p>
          Next, shine it from approximately the same distance at an acute angle
          to the surface, with the light source being the same distance away as
          in the first test.
        </p>
        <p>
          The brightness of the surface should decrease when the light is
          shining at an angle compared to when it was perpendicularly, and is
          why the angle of the light compared to the surface of the object
          matters.
        </p>
        <p>
          These four factors combined together affect how the diffuse reflection
          will finally appear.
        </p>
        <h3>Example - Cube with diffused reflection</h3>
        <LightingFirstExample />
        <h4>How it works</h4>
        <p>
          We now know that diffuse light is the light that shows the color of
          the surface of an object, and it's brighter when the incident light is
          closer to being perpendicular to the surface, its color falls within
          the color spectrum of the object, has a high intensity, and is close
          to the object.
        </p>
        <p>
          The first thing required is the normal of the surface being lighted. A
          normal can be considered as a direction that is perpendicular to a
          surface. So if there was a surface that was across the XZ-plane, then
          it's normal would be any direction along the Y-axis.
        </p>
        <p>
          Since we can only tell the GPU information about each vertex, the
          normal of the plane is set as the normal of each vertex forming that
          plane.
        </p>
        <p>
          This way when the entire plane is being drawn, since all vertices have
          the same normal, the entire plane will also be interpolated to have
          that normal.
        </p>
        <p>
          The second thing required is the direction of the light. Since the
          position of the light and objects in the world are known, and the
          light is a point light, the direction would be from the light source
          to the object itself.
        </p>
        <p>
          In order to determine the brightness of a point on the surface of the
          object, the angle between the normal of the surface and the direction
          of light must be compared.
        </p>
        <h5>The mathematics</h5>
        <p>
          If the direction of the light is perpendicular to the surface, then
          the angle between the direction of light and the normal of the surface
          will equal 0 degrees, resulting in the brightness at that point should
          be brightest.
        </p>
        <p>
          Conversely, if the direction of the light is parallel to the surface,
          then the angle between the direction of light and the normal of the
          surface will be 90 degrees, which results in no light hitting the
          surface and its brighness being zero.
        </p>
        <p>
          Consider brightness as a factor from 0 to 1, where at 1, the
          brightness is at its highest possible value, and at 0, it is at it's
          lowest possible value.
        </p>
        <p>
          So a mathematical operation is required which, when given an angle of
          0 degrees provides a result of 1, and when given an angle of 0 degrees
          provides a result of 0.
        </p>
        <p>
          The best operation for this is the trignometric function{" "}
          {renderEquation(`cos(theta)`)}, where {renderEquation(`theta`)} is the
          angle between the two directions.
        </p>
        <p>
          Do note that if the angle between the normal and the light is greater
          than 90 and upto 180, the result of this operation goes upto -1. So
          the result of the operation needs to be clamped to 0 to prevent the
          diffuse factor from being negative, since you can't have a negative
          amount of light.
        </p>
        <p>
          In the GPU, we'll be representing the directions of the surface normal
          and light direction in the form of vectors. So a mathematical
          operation is required between two vectors, which can provide us with
          the {renderEquation(`cos(theta)`)} result of the angle between them.
          This operation is the <code>dot</code> product.
        </p>
        <p>
          Let us take two vectors {renderEquation(`vec v_1`)} and{" "}
          {renderEquation(`vec v_2`)}. The <code>dot</code> product of these two
          vectors would be{" "}
          {renderEquation(
            `vec v_1 cdot vec v_2 = norm(vec v_1) norm(vec v_2) cos(theta)`
          )}
          , where {renderEquation(`norm(vec v_1)`)} and{" "}
          {renderEquation(`norm(vec v_2)`)} represent the magnitute of{" "}
          {renderEquation(`vec v_1`)} and {renderEquation(`vec v_2`)}{" "}
          respectively.
        </p>
        <p>
          The magnitude of a vector can be considered as a certain quantity that
          is required to move a point from one place to another. The magnitude
          combined with the direction of the vector forms the vector itself.
        </p>
        <p>
          If we move around parts of this equation, we can represent this as
          equation as{" "}
          {renderEquation(
            `(vec v_1) / norm(vec v_1) cdot (vec v_2) / norm(vec v_2) = cos(theta)`
          )}
          , where {renderEquation(`(vec v) / norm(vec v)`)} is considered the
          unit vector of the vector (represented as {renderEquation(`hat(v)`)}),
          because the magnitude of the vector is removed from the vector itself,
          leaving it as a single unit of itself that purely represents its
          direction.
        </p>
        <p>
          This results in the final equation being{" "}
          {renderEquation(`hat(v_1) cdot hat(v_2) = cos(theta)`)}, where{" "}
          {renderEquation(`hat(v_1)`)} and {renderEquation(`hat(v_2)`)}{" "}
          represent the unit vectors of the vectors {renderEquation(`vec v_1`)}{" "}
          and {renderEquation(`vec v_2`)}. So we can determine the{" "}
          {renderEquation(`cos(theta)`)} of two vectors by finding the dot
          product of their unit vectors. This can be done easily, because there
          are built-in functions that let us calculate the unit vector of a
          given vector.
        </p>
        <p>
          Including the other factors that affect the diffuse reflection, the
          final equation is:
        </p>
        <p className="util text-center">
          {renderEquation(
            `"diffuseFactor" = ((hat "lightDirection" cdot hat "surfaceNormal") times "lightColor" times "lightIntensity") / "distance" ^ 2`
          )}
        </p>
        <p>
          The factors are combined through multiplication and division and not
          addition and subtraction, because addition would mean that these
          factors pile up on each other. However, these factors mix with each
          other to determine the final factor of the diffuse reflection, which
          is done through multiplcation and division.
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
          In the vertex shader, the lines 17-21 are the standard operations
          we've seen in previous chapters, so they can be mostly ignored.
        </p>
        <p>
          The important things to note from them is that the results of the
          position of the vertex in the world space and view space (see the{" "}
          <Link to="/basics/vertex-shader">Vertex Shader Basics</Link> if you
          need to recollect) are saved in certain variables which will be
          required later.
        </p>
        <p>
          After those lines, we first calculate the combined product of the
          light color and intensity, which is a simple multiplication. This
          result is stored in a <code>vec3</code> named{" "}
          <code>lightColorIntensity</code>, since it stores the intensity of
          each color (R, G, and B) of the light.
        </p>
        <p>
          The distance between the light source and object is very simple. Since
          the positions of both are already stored in vectors, the distance
          between them can be calculated through a built-in function available
          in shading languages. In GLSL, this function is <code>distance</code>.
        </p>
        <p>
          Alternatively, the two vectors can be subtracted into another vector,
          and the magnitude of that resultant vector would give us the distance
          between the two points. The magnitude of a vector can be calculated in
          GLSL using the built-in function <code>length</code>.
        </p>
        <p>
          The direction of the normal of the vertex is required to be known
          respective to the camera, which is why the calculation of the normal
          in viewspace (multiplying the model and view matrices) is performed
          and stored in <code>normal_viweSpace</code>. This is similarly done
          for the direction of the light and stored in the{" "}
          <code>lightDirection_viweSpace</code>.
        </p>
        <p>
          The results of those two calculations provide a vector, which needs to
          be converted into a unit vector, since that is what is required in
          order to calculate the diffuse factor by the angle of the light and
          the normal of the surface. In GLSL, the built-in function for this
          calculation is <code>normalize</code>.
        </p>
        <p>
          The diffuse strength (strength of the diffuse reflection from the
          angle of the light and the surface) is calculated by finding the dot
          product of <code>normal_viewSpace</code> and{" "}
          <code>lightDirection_viewSpace</code> (done through the built-in
          function <code>dot</code> in GLSL). This is clamped between 0 and 1 to
          prevent a negative diffuse strength.
        </p>
        <p>
          The final diffuse reflection factor of the object is calculated by
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
          since the transparency of an object won't change based upon the light
          falling on it.
        </p>
        <h3>The Ambient Component</h3>
        <p>
          The ambient component is the second component of lighting reflection,
          and is generally a much more subtle form of reflection. Ambient
          reflection is not from direct interaction with the light source, but
          interaction with the rest of the environment.
        </p>
        <p>
          The rays of light from the light source hit other objects as well, and
          the light reflected from these other objects in the environment bounce
          around and eventually hit the primary object as well.
        </p>
        <p>
          This light that comes indirectly through light bouncing of other
          objects form the ambient component of lighting of an object, causing
          the object to always have a minimum amount of brightness, either over
          the entire object or over a certain area.
        </p>
        <p>
          Since this the minimum brightness of an object caused due to the
          environment, the diffuse lighting component adds on top of the ambient
          component.
        </p>
        <h3>Example - Cube with ambient and diffuse lighting</h3>
        <LightingSecondExample />
        <GlslCodeHighlight
          code={secondFragmentShaderSource.trim()}
          type={"Fragment"}
        />
        <h4>How it works</h4>
        <p>
          Since the ambient component of lighting is just a minimum brightness
          of the object due to the environment, the ambient factor doesn't need
          any calculation, so the vertex shader requires no modification.
        </p>
        <p>
          The ambient factor of the environment is directly passed to the
          fragment shader, which is then multiplied with the color of the
          fragment to introduce the minimum brightness.
        </p>
        <p>
          This is then added along with the diffusion component of lighting,
          since the ambient lighting is the base brightness of the object, and
          the diffusion component is an addition on top of it to further
          increase the brightness of surfaces being hit by the light.
        </p>
        <h3>The Specular Component</h3>
        <p>
          The specular component is the final component of lighting reflection
          and is what gives objects a "shine".
        </p>
        <p>
          Specular reflection is similar to reflection by a mirror. When a ray
          of light hits the surface, depending on the smoothness of the surface,
          this light may be completely reflected, like as if the surface were a
          mirror.
        </p>
        <p className="util text-center">
          <img
            src="https://www.opengl-tutorial.org/assets/images/tuto-8-basic-shading/specular.png"
            alt="Specular Lighting Main Example"
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
          If the reflected light is seen by the viewer, it would look like all,
          or a part of the light was reflected by the object, giving the
          impression the object has a shiny surface. This is specular
          reflection.
        </p>
        <p>
          Just like how with diffuse reflection the brightness was dependent on
          the angle of the light and the surface, with specular reflection the
          brightness is dependent on the direction of the reflected light and
          the direction of the camera.
        </p>
        <p>
          Other than this factor, specular reflection is also dependent on all
          the other factors that diffuse reflection is.
        </p>
        <h3>Example - Cube with all lighting components</h3>
        <LightingThirdExample />
        <h4>How it works</h4>
        <p>
          We can reuse the principles we've learnt from diffuse reflection. We
          know that a factor of diffuse lighting is the angle of the reflected
          light with the direction of the camera.
        </p>
        <h5>The mathematics</h5>
        <p>
          If the direction of the camera is known, as well as the direction of
          the reflected light, by applying the <code>dot</code> operation we've
          learnt, we can calculate the the {renderEquation(`cos(theta)`)} angle
          between them, which gives us the strength of the specular reflection.
        </p>
        <p>
          The same {renderEquation(`cos(theta)`)} operation is required here
          since the same principle applies - the closer the light reflection and
          the camera are in the same direction, the brighter the specular
          reflection will appear to be.
        </p>
        <p>
          Another point to note is when calculating the <code>dot</code> product
          of these two vectors, they must be in the relatively same direction.
        </p>
        <p>
          What is meant by this is, if the direction of the camera is taken as
          the direction from the camera to the object, then the direction of the
          reflected light has to also be taken from the point the light is
          travelling towards to the object.
        </p>
        <p>
          If this condition is not satisfied, the two directions will appear to
          be completely opposite to each other, resulting in their dot product
          being in the opposite sign than they should be (negative when it
          should be positive and vice-versa).
        </p>
        <p>
          Another alternate solution to this issue is to multiply the result of
          the dot product with -1 to get the correct result. Either solution can
          be applied.
        </p>
        <p>
          According to the law of reflection, the angle at which a ray of light
          hits a surface (angle of incidence) is equal to the angle at which the
          light reflects off the surface (angle of reflection).
        </p>
        <p>
          Since the normal of a surface is always perpendicular to the surface,
          this angle of incidence and angle of reflection are against the normal
          of the surface.
        </p>
        <p>An image showing this law is below:</p>
        <p className="util text-center">
          <img
            src="https://www.asu.edu/courses/phs208/patternsbb/PiN/rdg/reflection/opticsRDG1.gif"
            alt="Law Of Reflection"
          />
          <br />
          <a
            href="https://www.asu.edu/courses/phs208/patternsbb/PiN/rdg/reflection/reflection.shtml"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
        <p>
          We've already know the direction of the light to the object when
          calculating diffuse reflection. Using the normal of the surface, the
          direction of the reflected light can be calculated.
        </p>
        <p>
          Once the dot product of the direction of the reflected light and
          direction of the camera is calculated, it is combined with other
          factors resulting in the final equation:
        </p>
        <p className="util text-center">
          {renderEquation(
            `"specularFactor" = ((hat "lightDirection" cdot hat "cameraDirection") times "lightColor" times "lightIntensity") / "distance" ^ 2`
          )}
        </p>
        <p>Let us look at the code to see how this equation is implemented.</p>
        <GlslCodeHighlight
          code={thirdVertexShaderSource.trim()}
          type={"Vertex"}
        />
        <GlslCodeHighlight
          code={thirdFragmentShaderSource.trim()}
          type={"Fragment"}
        />
        <p>
          In the vertex shader, the new code is from line 33. First the
          direction of the camera is calculated. Since the object is in view,
          the direction of the camera would be everywhere in view of the camera.
        </p>
        <p>
          A direction vector is calculated by subtracting the vector that
          represents the source point from the vector that represents the point
          the direction is pointing towards.
        </p>
        <p>
          In the case for calculating the direction of the camera, it is
          calculated by subtracting the position of the camera from the
          direction of the object.
        </p>
        <p>
          In viewspace, the camera is always at the center of the world, since
          in viewspace, everything is positioned relative to the camera. This is
          why the position of the camera is taken as{" "}
          <code>vec3(0.0, 0.0, 0.0)</code>.
        </p>
        <p>
          This direction is normalized so that the resultant vector calculated
          is the unit vector that represents the just direction of the camera,
          with no magnitude.
        </p>
        <p>
          The light direction in viewspace is known, along with the direction of
          the normal of the surface. Using a built-in function, the reflection
          of the direction of light w.r.t to the normal can be calculated. In
          GLSL, this function is <code>reflect</code>.
        </p>
        <p>
          The result of the reflection calculation is not normalized since the
          direction of the incident light is already a unit vector, so it's
          resultant reflection will also be a unit vector.
        </p>
        <p>
          One thing to note is that, with <code>reflect</code> in GLSL, the
          light ray reflection is still towards the object, instead of away from
          it.
        </p>
        <p>
          Imagine the normal of the surface as a mirror. When calculating the
          reflection of the direction of the light relative to the normal, the
          reflection would appear on the other side of the normal, but the
          direction won't change.
        </p>
        <p>This is shown in the illustration below:</p>
        <p className="util text-center">
          <img
            src={glslReflect}
            alt="GLSL Reflect Function Result Illustration"
          />
        </p>
        <p>
          Since the direction calculated for the camera is from the camera to
          the object, the calculation of their <code>dot</code> product will
          still be accurate, since they are directing towards the same point.
        </p>
        <p>
          This calculation is done in the next step to determine the strength of
          the specular reflection. Similar to the same calculation for the
          diffusion strength, this result is also clamped to between 0 and 1 to
          prevent a negative strength result.
        </p>
        <p>
          The final specular reflection factor is then calculated in the same
          way as the diffusion factor - multiply the specular strength with the
          light color and intensity, and divide it by the square of the distance
          of the light source from the object.
        </p>
        <p>
          Since the specular strength is also dependent on how reflective the
          surface is, it is increased to the power of the surface reflectivity.
          So the more reflective a surface is, the specular strength of the
          surface increases exponentially.
        </p>
        <p>
          The result is then passed to the fragment shader, allowing it to be
          interpolated per fragment, and this factor is directly added to the
          other lighting reflection components to set the final color value of
          the fragment.
        </p>
        <p>
          The reason why the specular factor is not combined with the color of
          the object is because the specular reflection is a direct reflection
          of the light.
        </p>
        <p>
          With diffuse reflection, some of the light is absorbed by the object,
          and the rest is spread evenly throughout in all directions, resulting
          in the light having the same color as the surface of the object.
        </p>
        <p>
          However, with specular reflection, the light is reflected as is
          towards the camera. None of the light is absorbed by the object, so
          the reflected light is not of the same color as the surface of the
          object.
        </p>
        <p>
          This results in the specular reflection color just being the color of
          the light itself, which is shown as the white "shine" you can see on
          the cube occasionally as it rotates.
        </p>
        <h3>Color Banding</h3>
        <p>
          An issue that can occur when performing these lighting calculations is
          something called color banding. Let us look at an example using a cube
          with some exaggerated lighting.
        </p>
        <h4>Example - Cube with color banding</h4>
        <LightingIssueExample />
        <p>
          The issue may not be very obvious at first, so here's a screenshot of
          a portion of the cube with the strength of the specular reflection
          slowly decreasing from the bottom to the top.
        </p>
        <p className="util text-center">
          <img src={banding} alt="Color Banding Screenshot Normal" />
        </p>
        <p>
          We can modify this image by boosting the highlights to make the issue
          more obvious.
        </p>
        <p className="util text-center">
          <img
            src={bandingExaggerated}
            alt="Color Banding Screenshot Exaggerated"
          />
        </p>
        <p>
          It appears that the surface of the cube has bands of colors going
          across it. This shouldn't occur since the decrease of light from the
          bottom to the top should be gradual and smooth.
        </p>
        <p>
          This issue is called color banding, and it is a problem because it
          makes a gradient of colors appear to be "chunky" rather than smooth,
          which is an undesirable effect, especially when it comes to lighting.
        </p>
        <p>
          This issue occurs mainly because the colors that are required to show
          the colors transitioning smoothly just do not exist among the range of
          colors that can form an image and a monitor can show.
        </p>
        <p>
          Monitors and computers are both limited to a certain range of colors
          they can show and store. Computers generally store colors in red,
          green, and blue components, optionally with an alpha component
          (opacity/transparency).
        </p>
        <p>
          Each component is stored as an 8-bit value, which means that each
          component can have at most 256 possible values. This may not seem like
          much, but when all components are combined, this allows for{" "}
          {renderEquation(`256 times 256 times 256 = 16,777,216`)} possible
          colors.
        </p>
        <p>
          However, even with these many colors, there are some colors that just
          can't be stored and represented by computers and displays.
        </p>
        <p>
          This means that if a computer wished to show a gradient of colors,
          there will be bands of colors forming instead of a smooth transition,
          since a computer cannot show the colors in between the two bands.
        </p>
        <p>
          This issue can be illustrated in a simple way. Suppose we could only
          represent colors using a 1-bit value. This would mean a computer could
          only show two colors, black and white.
        </p>
        <p className="util text-center">
          <img src={actualGradient} alt="Actual Gradient" />
          <br />
          <a
            href="https://www.xmple.com/wallpaper/black-white-gradient-linear--c2-000000-fffaf0-a-180-f-14-image/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
        <p>
          Now, suppose the computer had to render a gradient of colors, going
          from white to black, as shown in the image above. Since the computer
          can only show black and white, all the shades of grey in between
          cannot be displayed by the computer.
        </p>
        <p className="util text-center">
          <img src={bandedGradient} alt="Banded Gradient" />
        </p>
        <p>
          This results in the computer showing a continues band of white, with a
          sudden transition to a band of black. This is a case of color banding,
          albeit an extreme one.
        </p>
        <h3>Dithering</h3>
        <p>
          The solution to this issue of not being able to represent intermediate
          colors is called dithering. The{" "}
          <a
            href="https://en.wikipedia.org/wiki/Dither"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikipedia article on dithering
          </a>
          , as well as the YouTube video by{" "}
          <a
            href="https://www.youtube.com/channel/UC9-y-6csu5WGm29I7JiwpnA"
            target="_blank"
            rel="noopener noreferrer"
          >
            Computerphile
          </a>{" "}
          on{" "}
          <a
            href="https://youtu.be/IviNO7iICTM"
            target="_blank"
            rel="noopener noreferrer"
          >
            ordered dithering
          </a>{" "}
          provide good explanations on what dithering is, but we'll also discuss
          it here.
        </p>
        <p>
          Dithering is the process of introducing noise into an image. By
          introducing this noise in a certain way, you can overcome the
          limitations of the detail that can be shown by the computer and
          screen.
        </p>
        <p>
          Below is an example showing how introducing noise can improve the
          detail of an image:
        </p>
        <p className="util text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Michelangelo%27s_David_-_Floyd-Steinberg.png"
            alt="Wikipedia Dithering Example"
          />
          <br />
          <a
            href="https://commons.wikimedia.org/wiki/File:Michelangelo%27s_David_-_Floyd-Steinberg.png"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
        <p>
          The image is just made from white and black pixels, but through the
          introduction of noise into the image, shades of grey can be seen
          within the image, although it technically doesn't exist in the image.
        </p>
        <p>
          This is due to how our eyes perceive color. Since there are multiple
          black and white pixels very close to each other, our eyes blend these
          colors and make it look like as if the image is showing us grey.
        </p>
        <p>
          The noise does introduce a grainy effect, but the added detail in
          color is a high benefit, and in multiple cases this added detail
          offsets the issue of grain in the image.
        </p>
        <p>
          The noise can be a lot harder to spot in certain issues where colors
          that form bands are a lot closer to each other in the color spectrum,
          like in our example of color banding above.
        </p>
        <p>
          If we apply a noise to our image, it should cause dithering and allow
          for the colors to blend together.
        </p>
        <p>
          Since the colors forming the bands are already pretty close in the
          color spectrum, the grainy effect introduced by dithering should be
          very hard to spot, making it ideal to fix the banding issue.
        </p>
        <h4>Example - Cube with dithering</h4>
        <LightingFourthExample />
        <p>
          Below is a zoomed in part of the cube, with the cube in approximately
          the same lighting conditions and orientation as before.
        </p>
        <p className="util text-center">
          <img src={noised} alt="Dithering Screenshot Normal" />
        </p>
        <p>
          We can modify this image by boosting the highlights to make the issue
          more obvious.
        </p>
        <p className="util text-center">
          <img src={noisedExaggerated} alt="Dithering Screenshot Exaggerated" />
        </p>
        <p>
          While with the color banding screenshots, the banding was noticeable
          even in the non-altered image (unless your display isn't calibrated
          well), with the dithered original screenshot there is no appearance of
          banding or even noise in the image.
        </p>
        <p>
          It is only when the highlights of the dithered screenshot is increased
          are the noise patterns visible, but since the patterns are so close to
          each other, they easily blend together and look smooth to your eyes.
        </p>
        <p>
          Remember that the second image for dithering exaggerates the noise. In
          the first dithering screenshot, the noise and patterns are practically
          invisible, which is required to simulate a smooth gradient.
        </p>
        <GlslCodeHighlight code={fourthFragmentShaderSource} type="Fragment" />
        <p>
          Looking at the fragment shader code, there is an addition of a new
          function called <code>random</code>. This function generates a random
          number between 0 and 1 using a given 2D coordinate, which means it
          produces the same random number for the same coordinate.
        </p>
        <p>
          This random number generator function was taken from{" "}
          <a
            href="https://github.com/PistonDevelopers/shaders/wiki/Some-useful-GLSL-functions"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          . There are many other useful GLSL functions available there, and
          functions of similar functionality can be found for other shading
          languages.
        </p>
        <p>
          So a random number is generated using the coordinates of the fragment.
          In GLSL, the 2D coordinates of a fragment is available through{" "}
          <code>gl_FragCoord.xy</code>, where <code>gl_FragCoord</code> is a
          global variable similar to <code>gl_FragColor</code>, but only read
          only.
        </p>
        <p>
          The range of granularity for the noise was set to a very small number
          (<code>0.5/255.0</code>), to ensure that any shift in color due to the
          noise would be minute and unnoticeable.
        </p>
        <p>
          Using the GLSL function <code>mix</code>, a random value was linearly
          interpolated within this noise granularity range using the generated
          random number for the fragment and added to the fragment, resulting in
          the color of the fragment being slightly modified.
        </p>
        <p>
          Since the shift in color is random for every fragment, it results in
          noise being added into the image, resulting in unordered/random
          dithering.
        </p>
        <p>
          This process of removes the chances of color banding occuring, as seen
          in the dithering screenshots, and allows for color gradients to appear
          much smoother than they really are due to the colors from the noise
          blending together.
        </p>
        <h3>A final note on lighting</h3>
        <p>
          The methods and details discussed on lighting and its components are
          on how to realistically simulate lighting of an object through basic
          methods. However, realism in lighting may not always be desirable.
        </p>
        <p>
          These concepts are present just to show one way of lighting an object,
          but it most definitely is not the only way. There are other ways to
          simulate the same effects, and many more ways to simulate different
          kinds of lighting effects that may be less realistic.
        </p>
        <p>
          The way objects are lit in an environment can be a creative process.
          You can have lighting certain reflection components be exaggerated,
          just like we did for our color banding examples.
        </p>
        <p>
          Likewise, these components can also be heavily subdued if that fits
          your requirements.
        </p>
        <p>
          If required, you can also completely forgo these methods and light
          your environment in unique and visually interesting ways. This chapter
          should just provide you a starting point to go from.
        </p>
        <p>
          While previous chapters do show points where creativity can be added
          in, they are clearcut on the concepts required to perform the
          operations that they teach.
        </p>
        <p>
          This is the first chapter that teaches a concept that can be
          completely modified, replaced, or removed to satisfy creative
          requirements, allowing for freedom on what can and cannot be done.
        </p>
        <p>
          An honest and big recommendation is to start experimenting with
          lighting, since this can heavily impact the look and feel of the
          world, which can make or break immersion. See what best fits your
          requirements, and see how changes, both big and small, can affect the
          end result.
        </p>
        <h3>Summary</h3>
        <ul>
          <li>
            Lighting helps to make an object seem more in place with the world
          </li>
          <li>
            There are three reflection components when lighting an object:
            <ul>
              <li>
                <strong>Diffuse Component</strong> - The component that shows us
                the color and look of the object. Brightness depends on at what
                angle the light hits the surface.
              </li>
              <li>
                <strong>Ambient Component</strong> - The component that is
                resultant from the light reflected by the rest of the
                environment onto the object. Results in the object always having
                a minimum amount of brightness.
              </li>
              <li>
                <strong>Specular Component</strong> - The component that is
                resultant from the light reflected by the object towards the
                camera. Results in the object looking like it has a reflective
                surface.
              </li>
            </ul>
            <li>
              When the main three lighting components are combined, they
              simulate realistic lighting of an object in a basic form.
            </li>
            <li>
              Color banding is an issue that can occur when the computer cannot
              simulate a transition between two colors since it cannot represent
              the intermediate colors between the two.
            </li>
            <li>
              Dithering is a process of adding noise to an image to remove color
              pattern issues such as color banding.
            </li>
            <li>
              <strong>EXPERIMENT! EXPERIMENT! EXPERIMENT!</strong> Lighting is
              the first main concept taught that can be experimented with in
              multiple ways, allowing for creativity. Experiment to see what
              best fits your requirements, and how variables and parts affect
              the end result.
            </li>
          </li>
        </ul>
      </Content>
      <PageChange previous="/basics/texturing-branching/" next="/basics/end/" />
    </Layout>
  )
}

export default LandingPage
