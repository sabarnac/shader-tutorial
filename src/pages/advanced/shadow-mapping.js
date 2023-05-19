import { Link } from "gatsby";
import React from "react";

import ShadowMappingAreaLightMapExample from "../../components/advanced/shadow-mapping/area-light/map-example";
import ShadowMappingAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-example";
import { areaLightShadowFragmentShaderSource } from "../../components/advanced/shadow-mapping/area-light/shadow-example-shaders";
import ShadowMappingDirectionalLightMapExample from "../../components/advanced/shadow-mapping/directional-light/map-example";
import {
  directionalLightMapFragmentShaderSource,
  directionalLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/map-example-shaders";
import * as ShadowMappingDirectionalLightMapFixedExample from "../../components/advanced/shadow-mapping/directional-light/map-fixed-example";
import { directionalLightMapFixedFragmentShaderSource } from "../../components/advanced/shadow-mapping/directional-light/map-fixed-example-shaders";
import * as ShadowMappingFixedDirectionalLightPeterPanningExample from "../../components/advanced/shadow-mapping/directional-light/peter-panning-example";
import ShadowMappingDirectionalLightShadowAcneExample from "../../components/advanced/shadow-mapping/directional-light/shadow-acne-example";
import ShadowMappingDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-example";
import {
  directionalLightShadowFragmentShaderSource,
  directionalLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/shadow-example-shaders";
import * as ShadowMappingFixedAltDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-alt-example";
import { directionalLightShadowFixedAltFragmentShaderSource } from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-alt-example-shaders";
import * as ShadowMappingFixedDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-example";
import { directionalLightShadowFixedFragmentShaderSource } from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-example-shaders";
import * as ShadowMappingFixedModelDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-model-fixed-example";
import * as ShadowMappingFixedModelDirectionalLightZoomedShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-model-fixed-zoomed-example";
import ShadowMappingDirectionalLightPcfShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-example";
import { directionalLightShadowPcfFragmentShaderSource } from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-example-shaders";
import * as ShadowMappingDirectionalLightPcfZoomedShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-zoomed-example";
import ShadowMappingNoShadowExample from "../../components/advanced/shadow-mapping/no-shadow/shadow-example";
import ShadowMappingPointLightMapExample from "../../components/advanced/shadow-mapping/point-light/map-example";
import {
  pointLightMapFragmentShaderSource,
  pointLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/point-light/map-example-shaders";
import ShadowMappingPointLightShadowExample from "../../components/advanced/shadow-mapping/point-light/shadow-example";
import { pointLightShadowFragmentShaderSource } from "../../components/advanced/shadow-mapping/point-light/shadow-example-shaders";
import ShadowMappingSpotLightMapExample from "../../components/advanced/shadow-mapping/spot-light/map-example";
import ShadowMappingSpotLightShadowExample from "../../components/advanced/shadow-mapping/spot-light/shadow-example";
import {
  spotLightShadowFragmentShaderSource,
  spotLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/spot-light/shadow-example-shaders";
import Content from "../../components/content";
import Equation from "../../components/equation/equation";
import GlslCodeHighlight from "../../components/glsl-code-highlight";
import Heading from "../../components/heading";
import Layout from "../../components/layout";
import PageChange from "../../components/page-change";
import Seo from "../../components/seo";

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
      <h1>Shader Advanced - Shadow Mapping</h1>
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
      <Heading type="h2">Directional light</Heading>
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
        Sun because the Sun is far enough for the rays of light being emitted by
        it being effectively parallel, and the intensity of the light always
        being uniform across an entire scene.
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
      <Heading type="h3">Rendering a shadow map</Heading>
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
        type="Shadow Map Vertex"
      />
      <GlslCodeHighlight
        code={directionalLightMapFragmentShaderSource}
        type="Shadow Map Fragment"
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
      <Heading type="h3">Utilizing the shadow map</Heading>
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
        type="Final Scene Vertex"
      />
      <GlslCodeHighlight
        code={directionalLightShadowFragmentShaderSource}
        type="Final Scene Fragment"
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
      <Heading type="h3">Shadow acne</Heading>
      <p>
        The most obvious artifact present is the dark shadow stripes in the
        scene. This shadow artifact is called "shadow acne". This artifact is
        caused by the imprecision from generating the shadow map. We can look at
        it more closely here:
      </p>
      <ShadowMappingDirectionalLightShadowAcneExample />
      <p>
        Shadow acne occurs due how the shadow map is rendered, with two main
        causes:
      </p>
      <Heading type="h4">1. Shadow map resolution</Heading>
      <p>
        The shadow map can only contain as much detail as is allowed by its
        resolution.
      </p>
      <p>
        If a fragment exists in the final rendered scene but not in the shadow
        map, and if the depth of the fragment it sampled from the map happened
        to be lower than it, then it will be incorrectly rendered to be in
        shadow even when it is visible to the light source.
      </p>
      <p>
        This can be solved by increasing the resolution of the shadow to ensure
        as much detail of the scene from the perspective of the light source is
        captured.
      </p>
      <p>
        However, increasing the resolution of the shadow map also means that
        you're taxing the GPU more to render it as well, which is not ideal,
        especially for real-time performance scenarios.
      </p>
      <p>
        This solution will also never fully fix shadow acne, which is the second
        (and primary) cause for shadow acne.
      </p>
      <Heading type="h4">2. Precision per pixel of shadow map</Heading>
      <p>
        Each pixel in the shadow map is also limited by the number of bits used
        to store them. If we are storing high precision values in a low
        precision format, that loss of information can introduce errors result
        in fragments being rendered to be in shadow even if they are visible to
        the light soruce.
      </p>
      <p>
        If we store the shadow map as a typical 32-bit color map, then each
        pixel can store 32 bits of information.
      </p>
      <p>
        In our case, we were storing the entire depth value in each RGBA
        component of the shadow map separately. Since each color would have
        8-bits of information, we were effectively storing the depth of the
        fragment as an 8-bit value, when it's originally a 32-bit float.
      </p>
      <p>
        Since we are converting a 32-bit value to 8 bits, we have lost a lot of
        precision. As a result when rendering the final scene and comparing the
        depth of the fragment to the stored value in, the inaccuracy of the
        depth of the stored fragment can result in some fragments being
        considered to be in shadow, even if they actually aren't.
      </p>
      <p>We could fix this in a few ways.</p>
      <Heading type="h5">
        i. Better fit the depth value into the resultant pixel
      </Heading>
      <p>
        We could fix this in a few ways. Since we have a 32-bit float, instead
        of storing it in an 8-bit format in each component of the RGBA value, we
        can split the 32 bits into four 8 bit chunks, and store those as the
        final RGBA values instead.
      </p>
      <p>
        This allows us to fully utlize the entire 32-bit range of the pixel data
        without losing any precision, and making comparisons accurate.
      </p>
      <p>
        However, it may not always be possible to store the depth value at full
        precision. In such cases, we can make sure we utilize as much of the
        data value range as we possibly can to reduce shadow acne to a certain
        degree.
      </p>
      <p>
        How does one utilize the full range of values possible to store in a
        pixel? We know that the depth coordinate we're storing is a homogenous
        coordinate (where the value is between 0 and 1), with 0 representing
        being at the near plane of the light source's "camera", and 1
        representing being at the far plane of the light source's "camera".
      </p>
      <p>
        If we adjust this near and far plane such that the entire scene that we
        want to render into the shadow map just barely fits within those planes,
        then the depth values that will be stored in the shadow map will be more
        widely spread across that range, improving accuracy and reducing shadow
        acne.
      </p>
      <p>
        We can see these two approaches implemented in the shadow map and final
        rendered scene below:
      </p>
      <ShadowMappingDirectionalLightMapFixedExample.default />
      <ShadowMappingFixedAltDirectionalLightShadowExample.default />
      <GlslCodeHighlight
        code={directionalLightMapFixedFragmentShaderSource}
        type="Shadow Map Fragment"
      />
      <GlslCodeHighlight
        code={directionalLightShadowFixedAltFragmentShaderSource}
        type="Final Scene Fragment"
      />
      <p>
        We can see from the above results that by splitting the depth value into
        chunks to be stored across the entire RGBA fragment color value, and by
        adjusting our near and far planes to stretch the scene across the entire
        depth range we've fixed our shadow acne issue.
      </p>
      <p>
        For our case this was possible because our depth value (which is 32
        bits) was possible to store without losing any precision as an RGBA
        color value.
      </p>
      <p>
        However, it may be more common to not be able to store these values in
        full precision in the shadow map, as a result there will always be some
        amount of shadow acne generated in the final scene.
      </p>
      <p>
        To completely remove the issue of shadow acne, we can follow the next
        solution.
      </p>
      <Heading type="h5">ii. Use a bias value</Heading>
      <p>
        The best (and most common) approach to removing shadow approach is to
        introduce a bias value to the comparison called an acne bias/depth bias.
      </p>
      <p>
        The bias value allows you to set a threshold for how close the depth of
        the current fragment in the final scene has to be compared to the depth
        value read from the shadow map.
      </p>
      <p>
        If the difference in distance is within the threshold defined by the
        bias value, then the fragment is considered to be visible to the light
        source and lit accordingly.
      </p>
      <p>We can see this solution in action below:</p>
      <ShadowMappingFixedDirectionalLightShadowExample.default />
      <GlslCodeHighlight
        code={directionalLightShadowFixedFragmentShaderSource}
        type="Final Scene Fragment"
      />
      <p>
        From the result, we can see that by introducing the acne bias value (in
        line 28) and using it as part of the depth comparison (in line 30), we
        were able to remove the shadow acne completely.
      </p>
      <p>
        However, this solution does introduce a new problem that we will look at
        in the next section.
      </p>
      <Heading type="h5">
        iii. Move the shadow acne to parts already in shadow
      </Heading>
      <p>
        There is one more approach that could be taken with "fixing" the shadow
        acne, which is to make sure it only occurs in the areas of the scene
        under shadow.
      </p>
      <p>
        Traditionally when rendering a scene, we have the GPU cull the back
        faces of the object that are not facing towards the camera. This saves
        on time that would otherwise be spent rendering faces that are hidden
        from us.
      </p>
      <p>
        The shadow acne problem we're facing is occuring on the faces that we
        render in the shadow map, the ones that are visible to the light source.
      </p>
      <p>
        If we instead render the back faces of the objects in the shadow map,
        and cull the front faces, now the shadow acne problem will only occur on
        the faces of the objects that are not visible to the light, and hence
        should be in shadow.
      </p>
      <p>
        Since those faces would not be lit anyways, the shadow acne problem
        should not affect the scene in any way.
      </p>
      <p>
        However, this solution doesn't work always. If you're scene has very
        thin geometry, where the front and back faces are basically at the same
        depth (considering the imprecision in the shadow map), or parts of the
        scene are touching/connected to each other within the imprecision margin
        of the shadow map, then shadows may appear to "hover" slightly.
      </p>
      <p>
        For this reason, you may need to evaluate on a per light basis on
        whether using front-culling in the shadow map is possible or not.
      </p>
      <p>
        Now let's look at the second problem we're facing from using the acne
        bias solution.
      </p>
      <Heading type="h3">Peter-panning</Heading>
      <p>
        Looking at the final rendered scene using the acne bias solution, we can
        clearly see that the shadow projected by the wall is "hovering".
      </p>
      <ShadowMappingFixedDirectionalLightPeterPanningExample.default />
      <p>
        This "hovering" is called "Peter-Panning", being named after the
        fictional character Peter Pan and his ability to fly.
      </p>
      <p>
        This problem does occur with the other solutions as well. You can spot
        the shadow in the first solution to the shadow acne problem hovering
        slightly on the edge, and we mentioned that this occurs in the third
        solution as well.
      </p>
      <p>
        The solution to shadow peter-panning is to update the scene to make the
        geometry thicker. This will push the rendered fragments in the shadow
        map close enough to the light source to counter the peter-panning effect
        introduced by the acne-bias/imprecision from the shadow map.
      </p>
      <ShadowMappingFixedModelDirectionalLightShadowExample.default />
      <p>
        You can see from the above example that by making the floor and walls
        thicker the peter-panning problem now no longer exists
      </p>
      <p>
        When using the third solution for the shadow acne problem, this won't
        fix the issue because we're rendering the faces that are not visible to
        the light source. So no matter how thick we make the geometry, the
        resultant shadow map will still be the same in the areas where
        peter-panning occurs.
      </p>
      <p>
        However, when using the other two solutions for the shadow acne problem,
        this fix should work well.
      </p>
      <p>
        Now let's further zoom into the edges of the shadow to find another
        problem.
      </p>
      <Heading type="h3">Shadow aliasing</Heading>
      <p>
        If we zoom in to the edges of the shadow we can spot another problem -
        aliasing.
      </p>
      <ShadowMappingFixedModelDirectionalLightZoomedShadowExample.default />
      <p>
        This problem is caused mainly by the resolution of the shadow map. We
        can increase the resolution to reduce the amount of aliasing, but this
        will not completely remove the aliasing artifacts from the shadows.
      </p>
      <Heading type="h3">Percentage-Closer Filtering (PCF)</Heading>
      <p>
        Instead of increasing the shadow map resolution, we can implement a form
        of anti-aliasing calculation when determining whether a fragment is in
        shadow or not to blur the edges of the shadow and smoothen it to a
        certain degree.
      </p>
      <p>
        This can be done by checking whether the current fragment is close to
        the edge of the shadow within a certain range. If it is, then it is set
        to be partially in shadow proportional to its distance from the shadow
        edge, and then rendered accordingly.
      </p>
      <p>
        This sort of anti-aliasing algorithm where we're shading the fragment to
        be in shadow based on how close it is to the shadow edge is called
        Percentage-Closer Filtering.
      </p>
      <p>
        There are a wide variety of PCF algorithms that can be used to smoothen
        the edges of shadows, or make it more appealing or realistic. However,
        for our example we'll go with a simple PCF algorithm.
      </p>
      <ShadowMappingDirectionalLightPcfShadowExample />
      <ShadowMappingDirectionalLightPcfZoomedShadowExample.default />
      <GlslCodeHighlight
        code={directionalLightShadowPcfFragmentShaderSource}
        type="Final Scene Fragment"
      />
      <p>
        Previously we were setting the <code>fragmentVisibility</code> value to
        either <code>0</code> or <code>1</code> based on if its depth was lower
        than the depth recorded in the shadow map.
      </p>
      <p>
        However, this time we'll be calculating an "average" visibility value
        for the fragment using a PCF algorithm, so we've created a function{" "}
        <code>getAverageVisibility</code> to calculate this value on line 22.
      </p>
      <p>
        Normally we just sample the shadow map depth value at the coordinate the
        current fragment is supposed to be located at.
      </p>
      <p>
        As part of our PCF algorithm, we will also be sampling the depth value
        at various coordinates surrounding the coordinate where our current
        fragment is located.
      </p>
      <p>
        We iterate through the shadow map coordinates using two nested loops on
        line 24 and 25, getting the depth values of all fragments that are at
        most 2 units away from the position of the current fragment in both the
        X and Y coordinates.
      </p>
      <p>
        We then compare all of them to the depth of the current fragment and sum
        the visibilities based on the comparison results.
      </p>
      <p>
        This is then divided by the number of samples taken in total, thereby
        giving us the average visibility of the fragment across all shadow map
        samples taken.
      </p>
      <p>
        This results in the shadow softening near the edge as the average
        visibility slowly reduces till the fragments are far enough away from
        the shadow edge.
      </p>
      <p>
        This can be seen in the end result, with the shadow in the main view
        having the "stair-case" effect caused by the aliasing being reduced, and
        the shadow edge looking blurrier compared to before in the zoomed
        example.
      </p>
      <p>
        As said before, there are a wide variety of PCF algorithms that can be
        used to soften shadow edges and reduce the aliasing effect. They all
        have their benefits and drawbacks based on performance and appearance.
      </p>
      <p>
        We've showcased a very simple PCF algorithm to show how it's
        implemented, and recommend exploring other PCF algorithms and see how
        the behave.
      </p>
      <p>
        This covers how to render shadows for directional lights, and also a
        look into the various issues that crop up when rendering shadows and how
        to solve them.
      </p>
      <p>
        Next lets look at how to render shadows for some other types of lights,
        and implementing the same solutions we've learnt here for solving the
        problems we face when rendering shadows.
      </p>
      <p>
        With the other lights we'll be looking at, they are considered to be a
        finite distance away, and so follow the typical lighting calculations we
        were using in the{" "}
        <Link to="/intermediates/lighting/">lighting chapter</Link> (with
        intensity of the light reducing with distance).
      </p>
      <Heading type="h2">Spot light</Heading>
      <p>
        Spot lights represent the typical light sources we see. The light
        originates from a single point, covering a certain area of the scene,
        and is considered to be a normal light source (considered to be a finite
        distance away with intensity dropping with increase in distance).
      </p>
      <p>
        Since the light from spot light originates from a single point, with the
        rays not being parallel, they more accurately represent traditional
        lights we see, such as bulbs, street lights, lamps, etc.
      </p>
      <p>
        The approach for generating shadows for spot lights is similar to
        directional lights, with the main differences being:
      </p>
      <ul>
        <li>
          The lighting calculation now does consider intensity reduction with
          increase in distance, as is generally done (unlike with directional
          lights).
        </li>
        <li>
          The projection matrix used for the light's point of view is a 3D
          perspective matrix instead of an orthogonal one (which was used for
          the directional light).
        </li>
      </ul>
      <p>
        The reason for using a 3D perspective matrix for the projection matrix
        instead of an orthogonal one is because the orthogonal projection for
        the shadow map would work if the rays of light are travelling in
        parallel.
      </p>
      <p>
        However, in the case of spot lights, the rays are not travelling in
        parallel. They instead project from a single point and extend in various
        directions, with the rays generally following the same direction as the
        light source is facing.
      </p>
      <p>
        A 3D perspective projection is the one that would accurately reflect
        this in the shadow map, hence why it is used for generating the spot
        light's shadow map.
      </p>
      <p>
        Let's look at how the shadow map and the final scene look under a spot
        light.
      </p>
      <ShadowMappingSpotLightMapExample />
      <ShadowMappingSpotLightShadowExample />
      <GlslCodeHighlight
        code={spotLightShadowVertexShaderSource}
        type="Final Scene Vertex"
      />
      <GlslCodeHighlight
        code={spotLightShadowFragmentShaderSource}
        type="Final Scene Fragment"
      />
      <p>
        We can see that switching to the 3D perspective projection matrix has
        changed the way the shadow map has rendered. The code for rendering the
        shadow map itself is the same as before, with the only change being the
        projection matrix that is passed to it.
      </p>
      <p>
        The shader for rendering the final scene is also practically the same as
        well, with the only difference being the <code>getDiffuseLighting</code>
        , which uses the same way we calculated diffuse lighting in the{" "}
        <Link to="/intermediates/lighting/">lighting chapter</Link>.
      </p>
      <Heading type="h2">Area light</Heading>
      <p>
        Area lights are similar to directional lights, with the only distance
        being that they are considered to be a finite distance away, and the
        intensity of their light does reduce with increase in distance.
      </p>
      <p>
        These lights are for representing flat plane lights that only light up
        the area that they directly face, rather than traditional lights which
        spot lights are better for.
      </p>
      <p>
        Let's look at how the shadow map and the final scene look under an area
        light.
      </p>
      <ShadowMappingAreaLightMapExample />
      <ShadowMappingAreaLightShadowExample />
      <GlslCodeHighlight
        code={areaLightShadowFragmentShaderSource}
        type="Final Scene Fragment"
      />
      <p>
        The shadow map is rendered exactly the same way as with directional
        lights, so they will look exactly the same as well. When it comes to
        rendering the final scene, the main difference compared to spot lights
        is how the distance is calculated from the light source.
      </p>
      <p>
        With spot lights, the rays originate from a single point. So when
        calculating the distance of the fragment from the light source, we just
        need to calculate the distance between two points.
      </p>
      <p>
        With area lights, however, the rays of light don't originate from a
        single point, but instead from a plane, with all rays being parallel to
        each other.
      </p>
      <p>
        However, the only information we have about the light source is a single
        point on the plane (which we can consider to be the center of the
        plane), and the direction the plane is facing.
      </p>
      <p>
        In order to calculate the distance of the current fragment from the
        light source, we need to find the point on the light plane whose ray is
        travelling in the direction of the light source towards the fragment,
        and then calculate the distance between that point and the fragment.
        This would also be the shortest distance of the fragment from the plane.
      </p>
      <p>
        Luckily, there is a way to describe a plane when given a point on the
        plane and the direction the plane is facing (also called the normal of
        the plane). The equation that describes a plane using these two
        parameters is called the Point-Normal Form (PNF) of a plane. You can
        learn more about this{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/dot-cross-products/v/defining-a-plane-in-r3-with-a-point-and-normal-vector"
        >
          here
        </a>
        .
      </p>
      <p>
        In order to conveniently calculate the distance of a point, the equation
        of the plane needs to be converted from PNF to an equation called the
        Hessian-Normal Form (HNF) of the plane. Once this conversion is made,
        then calculating the distance of a point from the plane is very simple.
        You can learn more about this{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://mathworld.wolfram.com/HessianNormalForm.html"
        >
          here
        </a>
        .
      </p>
      <p>
        This calculation is done in the <code>getDistanceFromLight</code>{" "}
        function at line 28 in the final scene fragment shader.
      </p>
      <p>
        The standard equation for representing a plane is{" "}
        <Equation text={`ax + by + cz + d = 0`} />. If you know a point on the
        plane <Equation text={`P = (x_0, y_0, z_0)`} />, and the normal of the
        plane <Equation text={`hat N = (n_x, n_y, n_z)`} />, you can calculate
        the equation of the plane using the PNF equation{" "}
        <Equation
          text={`n_x(x - x_0) + n_y(y - y_0) + n_z(z - z_0) = 0 => n_xx + n_yy + n_zz + (- n_x x_0 - n_y y_0 - n_z z_0) = 0 `}
        />
        , where{" "}
        <Equation
          text={`a = n_x , b = n_y , c = n_z , d = - n_x x_0 - n_y y_0 - n_z z_0`}
        />
        .
      </p>
      <p>
        This can then be converted to the HNF form of the plane using the
        formula <Equation text={`hat N cdot x = - p`} />, where{" "}
        <Equation text={`x`} /> is a point, and{" "}
        <Equation
          text={`p = d / sqrt (a^2 + b^2 + c^2) = (- n_x x_0 - n_y y_0 - n_z z_0) / sqrt (n_x^2 + n_y^2 + n_z^2) = (- n_x x_0 - n_y y_0 - n_z z_0) / norm(hat N)`}
        />
        . <Equation text={`p`} /> can be considered as the shortest distance of
        the plane from the origin.
      </p>
      <p>
        Once done, then the distance between the plane and a point{" "}
        <Equation text={`x = (x_1, y_2, z_2)`} /> can be calculated using the
        formula <Equation text={`D = hat n cdot x + p`} />
      </p>
      <p>
        In line 29 we first calculate the normalized form of the normal of the
        light plane. With this normal, we calculate <Equation text={`p`} /> (the
        distance of the plane from the origin) in line 30 - 33 using the formula
        we derived above.
      </p>
      <p>
        And finally, we calculate the distance of the fragment from the plane by
        calculating the dot vector between the normal of the plane and the
        position of the fragment, and then adding the distance of the plane from
        the origin.
      </p>
      <p>
        This distance formula is then used as part of the diffuse lighting
        calculation as normal.
      </p>
      <p>
        Using this specific way of calculating the distance of the fragment from
        the light source can be ignored, with the standard method being used, if
        the inaccuracy from calculating the distance using the standard method
        compared to the accurate way is within a margin of error you set. This
        would help with improving the performance of the shader as well.
      </p>
      <Heading type="h2">Point light</Heading>
      <p>
        Point lights are a special type of spot light. While spot light only
        lights up an area in a general direction, point lights radiate light in
        all directions.
      </p>
      <p>
        So far, we've been storing the shadow map as a simple 2D texture, as all
        the lights we've seen so far point in a single general direction.
      </p>
      <p>
        However, with point lights, we need to capture the scene across all 6
        axis directions (+X, -X, +Y, -Y, +Z, -Z). For this, we would need to use
        6 textures to capture each direction.
      </p>
      <p>
        If you recall how cube map textures work from the{" "}
        <Link to="/advanced/cube-maps/">previous chapter</Link>, you'll notice
        that they seem to perfectly fit these requirements.
      </p>
      <p>
        We can use a cube map to store all 6 directions of the shadow map
        generated by a point light, and then read from this shadow cube map by
        calculating the direction from the light source to the fragment, and
        then read from the cube map in that direction.
      </p>
      <p>
        When rendering the shadow cube map, we create view matrices for each
        axis direction of the point light, and then render each face with those
        view matrices.
      </p>
      <p>
        Each face of the shadow cube map is rendered through separate render
        passes in our examples, but with certain languages/frameworks it is
        possible to render all six faces under one render pass.
      </p>
      <p>
        However, due to WebGL not supporting this behavior, and also for the
        sake of simplicity, we'll be sticking with showing shaders for rendering
        a single face at a time. Note that this doesn't change the core concepts
        for rendering the shadow maps for each direction.
      </p>
      <p>
        Now let's look at how the shadow cube map of a point light is rendered
        to capture the scene in all directions.
      </p>
      <ShadowMappingPointLightMapExample />
      <GlslCodeHighlight
        code={pointLightMapVertexShaderSource}
        type="Shadow Map Vertex"
      />
      <GlslCodeHighlight
        code={pointLightMapFragmentShaderSource}
        type="Shadow Map Fragment"
      />
      <p>
        For rendering previous shadow maps, we took the depth of the fragment
        from <code>gl_FragCoord.z</code> and saved that in the shadow map.
        However, for point light shadow maps, we can't use this value, and need
        to store our own calculated depth value instead.
      </p>
      <p>
        To do this, we calculate the distance between the light and the
        fragment, and then divide that distance by the far plane of the light's
        "camera", so that the distance is normalized to be between 0 and 1. This
        is the final depth value we store in the shadow cube map.
      </p>
      <p>
        To calculate this depth value, we pass the vertex position from the
        vertex shader to the fragment shader, allowing the GPU to interpolate
        the position for each fragment as a result, and get the position of the
        light and the far plane of the light's camera. using a uniform variable.
      </p>
      <p>
        Next let's look at how we use these recorded depth values when rendering
        the final scene.
      </p>
      <ShadowMappingPointLightShadowExample />
      <GlslCodeHighlight
        code={pointLightShadowFragmentShaderSource}
        type="Final Scene Fragment"
      />
      <p>
        As discussed previously, to read the recorded depth value from the
        shadow cube map, we need to calculate the direction of the current
        fragment from the light source. This direction vector is then used as a
        coordinate to read from the cube map.
      </p>
      <p>
        To compare against the depth of the current fragment, we calculate the
        current fragment's depth by using the same formula we used in the shadow
        map fragment shader, and then compare the two values.
      </p>
      <p>
        If we were to use the standard approach of recording the depth values in
        the shadow map, then in the final scene fragment shader we would need to
        determine which of the light view matrices would be the correct one to
        use for the current fragment and calculate the current depth
        accordingly.
      </p>
      <p>
        Since this is a lot more complex then just calculating the distance
        between the light source and each fragment of the scene and storing and
        comparing those values, this alternative approach is used instead.
      </p>
      <p>
        We calculate the firection of the vertex from the light source in line
        47, by just subtracting the position of the light source from the
        position of the current fragment. This value is then provided to the{" "}
        <code>getAverageVisibility</code> function.
      </p>
      <p>
        The depth of the current fragment is calculated on line 19 by taking the
        distance of the current fragment from the light source and dividing that
        result by the far plane of the light's "camera" (same as in the fragment
        shader for the shadow cube map).
      </p>
      <p>
        And then the rest of the calculation for the visibility of the fragment
        is the same as before. One difference is that since we are now sampling
        a cube map, we need three nested loops (one for each axis) for sampling
        the surrounding depth values for our PCF algorithm.
      </p>
      <Heading type="h2">Additional Notes</Heading>
      <Heading type="h3">
        Generating point light shadow maps in OpenGL/WebGL
      </Heading>
      <p>
        When we generate a camera for each face of the shadow cube map, we use
        an up vector that points in the positive Y-axis (with the exception for
        the Y-axis faces, where we use a negative Z-axis up vector for the
        positive Y face, and a positive Z-axis up vector for the negative Z
        face).
      </p>
      <p>
        However, in OpenGL/WebGL you need to invert these up vectors instead.
      </p>
      <p>
        In the <Link to="/intermediates/color-mapping/">color mapping</Link>{" "}
        chapter, we provided an additional note that these graphics APIs read
        image data with the origin at the bottom-left of the image instead of
        the origin being traditionally at the top-left of the image. As a
        result, you would need to either flip the UV coordinates on the Y-axis,
        or flip the image vertically for the results to appear same as other
        graphics APIs.
      </p>
      <p>
        The reason for this is that while OpenGL/WebGL typically use a
        right-handed coordinate system (where the positive Z-direction is
        towards the camera), cube maps instead use the left-handed coordinate
        system (where the positive Z-direction is away from the camera).
      </p>
      <p>
        As a result, when you transform the cube map faces from one coordinate
        system to the other, you will find that the up vectors of each face get
        flipped to the opposite direction.
      </p>
      <p>
        So keeping this in mind is important when working with cube maps and
        knowing how they behave differently compared to standard 2D maps.
      </p>
      <p>
        This will be discussed in the{" "}
        <Link to="/advanced/cube-maps/">next chapter</Link> as well under the
        "Additional Notes" section.
      </p>
      <Heading type="h3">Cascaded shadow maps</Heading>
      <p>
        One problem we didn't tackle is shadows of lights covering a large area
        having lower detail.
      </p>
      <p>
        If a light source is covering a large area, that means that the area has
        to be compressed more to fit into the shadow map, this means as the
        areas get bigger, the amount of resolution they get in the shadow map
        gets reduced, resulting in more aliased reflections.
      </p>
      <p>
        This issue primarily occurs with directional lights due to the fact they
        have to cover the entire scene, which can be a very large area.
      </p>
      <p>
        With other lights, they can only cover a smaller area due to them being
        of finite distance and their light intensity reducing with increase in
        distance as well. As a result, the shadows they cast would be relatively
        close to the light source itself, so no perspective aliasing issues
        should occur.
      </p>
      <p>
        However, with infinite light sources like directional lights, they have
        to light up the entire scene. If the scene is very large, this can cause
        degraded looking shadows near the camera position.
      </p>
      <p>
        The most common technique used to solve this problem is using Cascaded
        Shadow Maps (CSM).
      </p>
      <p>
        This technique requires rendering multiple shadow maps, at various
        distances from the camera of the viewer. Based upon how far an object is
        from the camera, the appropriate shadow map is selected and used for
        generating the shadows.
      </p>
      <p>
        This allows us to have one shadow map dedicated to covering a small area
        close to the viewer, spreading that area across the shadow map as much
        as possible.
      </p>
      <p>
        The next shadow map will cover an area more further away from the viewer
        and covers a much larger area. Since this area is further away, the
        shadow doesn't need to be as high in quality, so fitting in a larger
        area is fine.
      </p>
      <p>
        This stacking of shadow maps to cover further and further distances can
        be done according to the amount of quality needed for each distance.
      </p>
      <p>
        Typically 3 to 4 shadow maps are used to cover an entire scene, with the
        last shadow map covering the rest of the scene area not covered by the
        previous ones. Since it is the last one, it should be reasonably far
        away such that the low quality shadows from it should not be noticeable.
      </p>
      <Heading type="h3">Other types of lights</Heading>
      <p>
        The lights discussed in these chapters are generally the most commonly
        used ones. There may be some other types of lights, which also have
        different ways for generating shadows, but they should all use the same
        or similar principles discussed we've discussed here.
      </p>
      <Heading type="h3">Improving render performance</Heading>
      <p>
        There are ways to improve performance when rendering shadows. Objects in
        a scene can be tagged to be "Shadow Receivers" or "Shadow Casters"
        against each light source. Shadow receivers have the ability to be in
        shadow by another object, while shadow casters have the ability to cast
        shadows onto other objects from a specific light source. All shadow
        receivers are also considered to be shadow casters.
      </p>
      <p>
        When rendering the shadow map for a light source, you only need to
        render those objects that have been tagged as a shadow caster or shadow
        receiver for that light. When rendering the final scene, the shadow map
        only needs to be passed to those objects that are marked as shadow
        receivers.
      </p>
      <p>
        This helps to improve performance by reducing the number of objects
        being rendered into a shadow map, and having objects that won't be
        receiving shadows skip the shadow calculation parts.
      </p>
      <p>
        Other ways to improve performance is to also use lower detailed objects
        in the scene for rendering the shadow maps, if they are good enough to
        use as an approximation for the fully detailed object.
      </p>
      <Heading type="h3">Calculating projection matrices for lights</Heading>
      <p>
        The projection matrices used for the cameras of the lights were
        hand-crafted, but this isn't always practically. Sometimes (especially
        for directional lights) it is more practical to dynamically calculate
        what the projection matrix should be based on the position of objects in
        the scene.
      </p>
      <p>
        This can be done by calculating a bounding box that encompasses all the
        objects that need to be rendered into the shadow map, and then calculate
        a projection matrix using that bounding box.
      </p>
      <p>
        This allows to more effectively use the space in a shadow map,
        maximizing the resolution in the shadow map for each area in the scene.
      </p>
      <p>
        There may be cases of popping occuring, where the shadows resolution may
        suddenly improve or degrade, as objects move in and out of the shadow
        map bounding box. This can be somewhat countered by smoothing out the
        change in shadow quality.
      </p>
      <p>
        If you use cascaded shadow maps, this approach won't provide any
        benefits, but it is still a useful alternative to cascaded shadow maps
        and is also simpler to implement.
      </p>
      <Heading type="h2">Summary</Heading>
      <ul>
        <li>
          Rendering shadows are an important aspect of lighting to make a scene
          appear complete.
        </li>
        <li>
          Shadows are rendered with the help of shadow maps.
          <ul>
            <li>
              A shadow map is the scene rendered from the perspective of the
              light source.
            </li>
            <li>
              The shadow map captures the depth of all fragments that are
              visible to the light source.
            </li>
          </ul>
        </li>
        <li>
          When rendering the final scene, calculate the position of where the
          fragment would be if it were to be rendered in the shadow map, and get
          the depth value of the closest fragment from that map.
          <ul>
            <li>
              If the current fragment's depth is higher than the closest
              fragment, it isn't visible to the light source and is in shadow.
            </li>
            <li>
              If the current fragment's depth is lower than or equal to the
              closest fragment, it is visible to the light source and should be
              lit instead.
            </li>
          </ul>
        </li>
        <li>
          There are certain artifacts that can occur when rendering shadows
          using shadow maps:
          <ul>
            <li>
              <strong>Shadow acne</strong> - If the precision of the data being
              stored in the shadow map is higher than what the shadow map can
              support, the loss in precision can result in some fragments
              appearing to be in shadow when they aren't. The possible
              approaches for solving this are:
              <ul>
                <li>
                  Storing the data into the shadow map in such a way that no
                  precision is lost, such as increasing the effective range that
                  the depth values will be stored as, or transforming the data
                  into a data type that the shadow map can support in a lossless
                  fashion.
                </li>
                <li>
                  Alternatively, a bias value can be introduced where as long as
                  the difference of depth is less than this value then it can
                  still be considered to be visible to the light source.
                </li>
                <li>
                  Since the acne is rendered on surfaces that are rendered in
                  the shadow map, if the back faces of the scene are rendered
                  when rendering the shadow map, then the acne will only occur
                  in the areas of the scene in shadow, which will not be
                  visible.
                </li>
              </ul>
            </li>
            <li>
              <strong>Peter-panning</strong> - Some of the solutions to shadow
              acne can result in shadows appearing to hover from where they
              should be. This primarily occurs in areas where two objects are
              touching or are very close to each other.
              <ul>
                <li>
                  The solution to this problem is to make geometry thicker so
                  that the solution of using a bias value or rendering the back
                  faces of a scene in a shadow map doesn't cause peter-panning.
                </li>
              </ul>
            </li>
            <li>
              <strong>Shadow aliasing</strong> - Due to the limited resolution
              of a shadow map, shadows can have sharp jagged edges due to
              aliasing.
              <ul>
                <li>
                  The resolution of shadow maps can be increased to reducing the
                  size of the aliasing, but this will increase the rendering
                  time of the shadow map.
                </li>
                <li>
                  Alternatively, the shadow can be filtered using Percentage
                  Closer Filtering (PCF) algorithms to get multiple samples of
                  the shadow map and calculate the average intensity of the
                  fragment being in shadow/light, resulting in softer edges on
                  shadows.
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          There are various kinds of lights, all of which generate different
          kinds of shadows:
          <ul>
            <li>
              <strong>Directional lights</strong> - Light sources that are very
              far away and their light travels in the same direction and don't
              reduce in intensity w.r.t. the distance from the light source.{" "}
              <em>Ex: the Sun</em>.
            </li>
            <li>
              <strong>Spot Lights</strong> - Light sources that are a finite
              distance away, where the light travels in a cone like way towards
              a single direction from the light source, and the intensity does
              reduce with distance. <em>Ex: Torches</em>.
            </li>
            <li>
              <strong>Area Lights</strong> - Similar to directional lights,
              except that they are a finite distance away and their intensity
              does drop with distance. <em>Ex: Office florescent lights</em>.
            </li>
            <li>
              <strong>Point Lights</strong> - Similar to spot lights, but their
              light travels in all directions, not just one approximate
              direction. <em>Ex: Traditional light bulb</em>.
            </li>
          </ul>
        </li>
      </ul>
    </Content>
    <PageChange previous="/advanced/cube-maps/" />
  </Layout>
);

export default ShadowMappingPage;
