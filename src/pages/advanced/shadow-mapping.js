import { Link } from "gatsby"
import React from "react"

import ShadowMappingAreaLightMapExample from "../../components/advanced/shadow-mapping/area-light/map-example"
import ShadowMappingAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-example"
import {
  areaLightShadowFragmentShaderSource,
  areaLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/area-light/shadow-example-shaders"
import ShadowMappingDirectionalLightMapExample from "../../components/advanced/shadow-mapping/directional-light/map-example"
import {
  directionalLightMapFragmentShaderSource,
  directionalLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/map-example-shaders"
import * as ShadowMappingDirectionalLightMapFixedExample from "../../components/advanced/shadow-mapping/directional-light/map-fixed-example"
import ShadowMappingDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-example"
import {
  directionalLightShadowFragmentShaderSource,
  directionalLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/shadow-example-shaders"
import * as ShadowMappingFixedAltDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-alt-example"
import * as ShadowMappingFixedDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-example"
import {
  directionalLightShadowFixedFragmentShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-example-shaders"
import * as ShadowMappingFixedModelDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-model-fixed-example"
import * as ShadowMappingFixedModelDirectionalLightZoomedShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-model-fixed-zoomed-example"
import ShadowMappingDirectionalLightPcfShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-example"
import {
  directionalLightShadowPcfFragmentShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-example-shaders"
import * as ShadowMappingDirectionalLightPcfZoomedShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-zoomed-example"
import ShadowMappingNoShadowExample from "../../components/advanced/shadow-mapping/no-shadow/shadow-example"
import ShadowMappingPointLightMapExample from "../../components/advanced/shadow-mapping/point-light/map-example"
import {
  pointLightMapFragmentShaderSource,
  pointLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/point-light/map-example-shaders"
import ShadowMappingPointLightShadowExample from "../../components/advanced/shadow-mapping/point-light/shadow-example"
import {
  pointLightShadowFragmentShaderSource,
  pointLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/point-light/shadow-example-shaders"
import ShadowMappingSpotLightMapExample from "../../components/advanced/shadow-mapping/spot-light/map-example"
import ShadowMappingSpotLightShadowExample from "../../components/advanced/shadow-mapping/spot-light/shadow-example"
import {
  spotLightShadowFragmentShaderSource,
  spotLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/spot-light/shadow-example-shaders"
import Content from "../../components/content"
import Equation from "../../components/equation/equation"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const ShadowMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Advanced - Shadow Mapping"
      description="A look into the how shadow maps can be generated and used to add dynamic shadows produced by objects in a scene."
      keywords={[
        "shadow",
        "mapping",
        "texturing",
        "shader",
        "spot light",
        "area light",
        "point light",
        "advanced",
      ]}
    />
    <Content>
      <h2>Shader Advanced - Shadow Mapping</h2>
      <p>
        In the <Link to="/intermediates/lighting/">lighting chapter</Link>,
        we've learnt how to color an object based on the light falling on it,
        and the various components that make up the lighting of an object.
      </p>
      <p>
        However, we're still missing an important component of lighting an
        object - the shadows that they create. While light can increase the
        visibility of an object, it also allows an object to cast shadows on
        other objects, reducing their visibility.
      </p>
      <p>
        Without shadows being considered when shading an object based on the
        sources of light in the world, the world will not look accurate.
      </p>
      <p>
        Let's take a look at an example where we only have lighting in the
        world, but no shadows being cast by objects.
      </p>
      <ShadowMappingNoShadowExample />
      <p>
        From the example, it becomes apparent why the lighting looks very odd.
      </p>
      <p>
        If each object in the scene is looked at individually, the lighting on
        them looks accurate, with how much each part is lit based on where they
        are respective to the light. However, since the objects aren't casting a
        shadow on each other, the scene feels incomplete.
      </p>
      <p>
        Depending on the type of light being used, the shadows they cast, and
        the techniques used to create them can differ slightly. Let's go through
        various types of lights that one may add to their scene and see how
        shadow mapping is done for each of them.
      </p>
      <h3>Directional light</h3>
      <p>
        Directional lights represent a light where the rays all travel in the
        same direction and don't have their intensity decrease with increase in
        distance.
      </p>
      <p>
        Directional lights are typically to light up areas uniformly with no
        reduction in light intensity, like light from the Sun.
      </p>
      <p>
        Directional lights are a very good representation of lighting by then
        Sun because the Sun is far enough for the light being emitted by it
        being effectively parallel, and the intensity of the light always being
        uniform across an entire scene.
      </p>
      <p>
        The first step for creating shadows is to determine what parts of the
        scene are visible to the light source and which parts are not.
      </p>
      <p>
        Since any part of a scene that is visible to the light would have rays
        from it fall on it, any parts that are not visible from the perspective
        of the light should not be lit by it, as they would be blocked by the
        visible parts of the scene.
      </p>
      <p>
        If we position the camera to be in the same position and facing the same
        direction as the light source, we can capture which parts of the scene
        are visible under the light source. This can allow us to determine which
        parts of the scenen are visible and not visible from the perspective of
        the light.
      </p>
      <p>
        To go about doing this, we create a texture that we will render the
        scene to from the perspective of the light source, where we capture the
        depth of each object visible to the light source in the scene (how far
        away the object is from the light source).
      </p>
      <p>
        This image that is rendered to the texture is called a depth map,
        because it is an image map that shows the depth of various parts of the
        scene that are visible to the camera.
      </p>
      <p>
        However, the depth map we've rendered is specially called a shadow map,
        because it determines which parts of the scene are visible to the light
        source, and hence can also be used to determine which parts are not
        visible to the light source and are hence in shadow.
      </p>
      <p>
        Do note that since we're only recording a single value (the depth),
        shadow maps are grayscale as a result.
      </p>
      <p>
        Let's look at an example for creating a shadow map for a directional
        light.
      </p>
      <h4>Rendering a shadow map</h4>
      <p>
        Rendering a shadow map is very simple. We just need to adjust our view
        and projection matrices to match how the light source would view the
        world.
      </p>
      <ul>
        <li>
          The view matrix is updated to change the camera position and direction
          to be the same as that of the light source.
        </li>
        <li>
          The projection matrix is updated to reflect how the light source views
          the world. For the case of directional lights, since they generate
          light rays that travel in parallel, an orthogonal projection would
          best fit it.
        </li>
      </ul>
      <p>
        Note that the camera would have to positioned and projected using the
        view and projection matrices in such a way that the area that is
        supposed to be lit by the light source is rendered into the shadow map.
        This may require some testing to figure out correctly.
      </p>
      <p>
        Once the camera is placed correctly, the rest of the process is very
        simple - render the scene into the texture, with the fragment shader
        returning the depth of the fragment it is rendering as the color of that
        fragment.
      </p>
      <ShadowMappingDirectionalLightMapExample />
      <GlslCodeHighlight
        code={directionalLightMapVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={directionalLightMapFragmentShaderSource}
        type="Fragment"
      />
      <p>
        Looking at the example above, we can see that the vertex shader is
        extremely simple and something we've already seen before in previous
        chapters. We just position the vertex using the model-view-projection
        matrix, with the view-projection matrix based on the light source.
      </p>
      <p>
        In the fragment shader, we need to return the depth of the fragment
        being rendered to be stored in the texture. Since it's just a single
        value, we can return it as a simple grayscale color value.
      </p>
      <p>
        In order to determine the depth of the fragment from the light source,
        we can calculate the depths of each vertex and pass that to the fragment
        shader, letting the GPU interpolate that into the depth value for the
        fragment.
      </p>
      <p>
        However, the GPU already provides us with the position of the fragment
        w.r.t. the camera's origin (which is in the same position as the light
        source). In OpenGL/WebGL, this value is available through the{" "}
        <code>gl_FragCoord</code> variable, with the <code>gl_FragCoord.z</code>{" "}
        telling us the depth of the fragment.
      </p>
      <p>
        If the shader language you're using doesn't provide this data already,
        as mentioned before you can just calculate the depth of each vertex and
        pass that to the fragment shader, letting the GPU interpolate the depth
        value for each fragment as a result.
      </p>
      <p>
        With the depth of the fragment known, the fragment color is set to the
        same value, and the final shadow map is saved to a texture. This lets us
        use it in the next step for drawing the shadows as part of the main
        render.
      </p>
      <p>
        Next, let's look at how we use the shadow map when rendering the actual
        scene.
      </p>
      <h4>Utilizing the shadow map</h4>
      <p>
        With the shadow map generated, now we need to use it during the main
        render of the scene.
      </p>
      <p>
        The shadow map contains the depth of all the parts of the scene that are
        visible to the light source, with the map being rendered from the light
        sources' perspective.
      </p>
      <p>
        When performing the final render of the scene in the fragment shader, we
        can calculate the position of the fragment being rendered relative to
        the light source to get the depth of the fragment that was closest and
        visible to it.
      </p>
      <p>
        Using this value, we can then check if the depth of the current fragment
        from the light source is less than or equal to the depth of the fragment
        in the shadow map.
      </p>
      <p>
        If it is, that means the current fragment has to be visible to the light
        source and should be lit by it. If not, that means the current fragment
        is covered by another fragment from the view of the light source, and
        hence is in shadow.
      </p>
      <p>Let's look at how this would be implemented in the shader.</p>
      <ShadowMappingDirectionalLightShadowExample />
      <GlslCodeHighlight
        code={directionalLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={directionalLightShadowFragmentShaderSource}
        type="Fragment"
      />
      <p>
        The vertex shader now calculates two additional values that are
        forwarded to the fragment shader - the position of the fragment relative
        to the light source (which is passed as{" "}
        <code>vertexPositionFromLight</code>), and the direction of the light
        from the light source in view-space (which is passed as{" "}
        <code>lightDirection_viewSpace</code>).
      </p>
      <p>
        Note that since we're not using normal maps, the vertex shader looks
        like the one we've learn about in the{" "}
        <Link to="/intermediates/lighting/">lighting</Link> chapter.
      </p>
      <p>
        In the fragment shader is where the shadow map is utilized. We first
        need to calculate what the depth of the current fragment is relative to
        the light source, which can be done using the{" "}
        <code>vertexPositionFromLight</code> value provided by the vertex
        shader.
      </p>
      <p>
        The coordinates provided by the vertex shader first need to be corrected
        for perspective-division and adjusting the range of the value.
      </p>
      <p>
        When we set the position of the vertex in the vertex shader using the{" "}
        <code>gl_Position</code> variable, the GPU performs some additional
        operations on the position value to transform it from clip-space to
        screen-space. This operation is a perspective-division operation.
      </p>
      <p>
        The reason for this is that the clip-space coordinates the vertex shader
        calculates are still coordinates that represent the point in 3D space.
        However, the screens we render to are a 2D plane. This means that the
        coordinates need to be adjusted to transform them from the 3D space into
        the 2D plane while correcting for the perspective the vertex is shown
        in.
      </p>
      <p>
        This operation is done by GPUs automatically when the clip-space
        coordinates are provided through the <code>gl_Position</code> variable.
        But if we're passing any clip-space coordinate from the vertex to the
        fragment shader (in our case, the clip-space coordinates of the vertex
        relative to the light source), it will interpolate the clip-space
        coordinates for that fragment correctly, but it won't perform the
        perspective-division correction.
      </p>
      <p>
        The shadow map we rendered is also in screen-space, not clip-space, so
        we cannot use the clip-space coordinates of the fragment directly.
        Instead, we would also need to perform the same correction that the GPU
        does for the vertex position automatically to get the screen-space
        coordinates of the fragment relative to the light source.
      </p>
      <p>
        The second step is to adjust the range we get from the resulting
        screen-space coordinates to be in the same range as the values from the
        shadow map.
      </p>
      <p>
        The range of the screen-space coordinates is from{" "}
        <Equation text={`(-1, -1, -1)`} /> to <Equation text={`(1, 1, 1)`} />.
        However, the range of the depth values in the shadow map are from{" "}
        <Equation text={`(0, 0, 0)`} /> to <Equation text={`(1, 1, 1)`} />.
      </p>
      <p>
        If we divide the screen-space coordinates of our current fragment by 2,
        the range gets transformed to <Equation text={`(-0.5, -0.5, -0.5)`} /> -{" "}
        <Equation text={`(0.5, 0.5, 0.5)`} />. We can then add{" "}
        <Equation text={`0.5`} /> to the coordinates to get them into the range
        of <Equation text={`(0, 0, 0)`} /> to <Equation text={`(1, 1, 1)`} />,
        which now matches the range of depth values from the shadow map, as well
        as the range of texel values of the shadow map texture (which ranges
        from <Equation text={`(0, 0)`} /> to <Equation text={`(1, 1)`} />
        ).
      </p>
      <p>
        This is what is done in line 25 in the fragment shader. The{" "}
        <code>xyz</code> coordinates are divided by the <code>w</code>{" "}
        coordinate of the fragment to perform the perspective division
        correction of the coordinates.
      </p>
      <p>
        The <code>w</code> coordinate determines how much the coordinate needs
        to be adjusted by based on how the vertex is projected onto the screen,
        and dividing the coordinates by the value transforms the coordinates
        into screen-space based on the perspective of the projection matrix
        (orthogonal or 3D perspective).
      </p>
      <p>
        The result is then multiplied by <code>0.5</code> to divide the
        coordinates by <code>2</code>, and then <code>0.5</code> is added to
        transform the coordinates into the right range.
      </p>
      <p>
        Once done, the transformed coordinates (hereby referred to as shadow map
        coordinates) can now be used with the shadow map to check if the current
        fragment is visible to the light source or not.
      </p>
      <p>
        The <code>xy</code> coordinates of the shadow map coordinates are used
        to sample the depth of the fragment closest to the light source at the
        position the current fragment is from the shadow map. This is done on
        line 26.
      </p>
      <p>
        This depth value can then be compared against the <code>z</code>{" "}
        coordinate of the shadow map coordinates representing the depth value of
        the current fragment. If the depth value of the current fragment is
        greater than the depth value sampled from the shadow map, then the
        current fragment is in shadow and it's visibility is set to{" "}
        <code>0</code>. Otherwise, the fragment is lit by the light source and
        it's visibility is set to <code>1</code>. This is done on line 29.
      </p>
      <p>
        The fragment visibility factor is then applied on the diffuse and
        specular lighting components that the light source contributes to, to
        apply the lighting only if the fragment is visible to the light source.
        In our case, we only have diffuse lighting, so it's only applied to
        that.
      </p>
      <p>
        While we do see the shadows are being rendered, there are some bad
        artifacts that are also being rendered into the scene. Let's explore the
        common artifacts you would face when rendering shadows and how to
        overcome each of them.
      </p>
      <h4>Shadow acne</h4>
      <p>
        The most obvious artifact present is the dark shadow stripes in the
        scene. This shadow artifact is called "shadow acne". This artifact is
        caused by the imprecision from generating the shadow map.
      </p>
      <p>Shadow acne occurs due how the shadow map is rendered.</p>
      <ShadowMappingFixedDirectionalLightShadowExample.default />
      <GlslCodeHighlight
        code={directionalLightShadowFixedFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingDirectionalLightMapFixedExample.default />
      <ShadowMappingFixedAltDirectionalLightShadowExample.default />
      <h4>Peter-panning</h4>
      <ShadowMappingFixedModelDirectionalLightShadowExample.default />
      <h4>Shadow aliasing</h4>
      <ShadowMappingFixedModelDirectionalLightZoomedShadowExample.default />
      <h4>Percentage-Closer Filtering (PCF)</h4>
      <ShadowMappingDirectionalLightPcfShadowExample />
      <GlslCodeHighlight
        code={directionalLightShadowPcfFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingDirectionalLightPcfZoomedShadowExample.default />
      <h3>Spot light</h3>
      <ShadowMappingSpotLightMapExample />
      <ShadowMappingSpotLightShadowExample />
      <GlslCodeHighlight
        code={spotLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={spotLightShadowFragmentShaderSource}
        type="Fragment"
      />
      <h3>Area light</h3>
      <ShadowMappingAreaLightMapExample />
      <ShadowMappingAreaLightShadowExample />
      <GlslCodeHighlight
        code={areaLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={areaLightShadowFragmentShaderSource}
        type="Fragment"
      />
      <h3>Point light</h3>
      <ShadowMappingPointLightMapExample />
      <GlslCodeHighlight code={pointLightMapVertexShaderSource} type="Vertex" />
      <GlslCodeHighlight
        code={pointLightMapFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingPointLightShadowExample />
      <GlslCodeHighlight
        code={pointLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={pointLightShadowFragmentShaderSource}
        type="Fragment"
      />
    </Content>
    <PageChange previous="/advanced/transparency/" />
  </Layout>
)

export default ShadowMappingPage
