import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import RandomImageGenerationFirstExample from "../../components/intermediates/image-generation/first-example"
import RandomImageGenerationSecondExample from "../../components/intermediates/image-generation/second-example"
import RandomImageGenerationThirdExample from "../../components/intermediates/image-generation/third-example"
import RandomImageGenerationFourthExample from "../../components/intermediates/image-generation/fourth-example"
import RandomImageGenerationFifthExample from "../../components/intermediates/image-generation/fifth-example"
import RandomImageGenerationSixthExample from "../../components/intermediates/image-generation/sixth-example"
import RandomImageGenerationSeventhExample from "../../components/intermediates/image-generation/seventh-example"
import RandomImageGenerationEightExample from "../../components/intermediates/image-generation/eight-example"
import RandomImageGenerationNinthExample from "../../components/intermediates/image-generation/ninth-example"
import { renderEquation } from "../../components/util"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import {
  firstVertexShaderSource,
  firstFragmentShaderSource,
} from "../../components/intermediates/image-generation/first-example-shaders"
import { secondFragmentShaderSource } from "../../components/intermediates/image-generation/second-example-shaders"
import { thirdFragmentShaderSource } from "../../components/intermediates/image-generation/third-example-shaders"
import { fourthFragmentShaderSource } from "../../components/intermediates/image-generation/fourth-example-shaders"
import { fifthFragmentShaderSource } from "../../components/intermediates/image-generation/fifth-example-shaders"
import { sixthFragmentShaderSource } from "../../components/intermediates/image-generation/sixth-example-shaders"
import { seventhFragmentShaderSource } from "../../components/intermediates/image-generation/seventh-example-shaders"
import { eightFragmentShaderSource } from "../../components/intermediates/image-generation/eight-example-shaders"
import { ninthFragmentShaderSource } from "../../components/intermediates/image-generation/ninth-example-shaders"

const ImageGenerationPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Image Generation"
      description="A look into the how images can be generated using noise and patterns."
      keywords={[
        "image",
        "generation",
        "noise",
        "patterns",
        "shader",
        "intermediates",
      ]}
    />
    <Content>
      <h2>Shader Intermediates - Image Generation</h2>
      <p>
        While images can be generated to render objects passed to a GPU, images
        can also be generated where the image is drawn over the entire screen,
        with the help of some logic for what color each pixel should be. Noise
        can also be added in to the image to change the end result.
      </p>
      <p>
        These generated images can be used as the final image to show to users,
        or can be stored as a texture for use somewhere else, such as to color
        the surface of a particular object.
      </p>
      <p>
        Certain applications do generate textures using shaders instead of
        having raw image files in order to save space or have a dynamic
        resolution for its textures depending on the system it is running on.
      </p>
      <p>
        Images can also be passed as textures to these shaders, which can then
        apply filters or effects on such images, such as bluring, pixelating,
        changing color temperature (warm/cool), etc.
      </p>
      <p>
        Since vertices are still required to be sent to the vertex shader, the
        vertices passed are:
      </p>
      <p className="util text-center">
        {renderEquation(`vertices = ((-1, -1), (-1, 1), (1, 1), (1, -1))`)}
      </p>
      <p>
        These four coordinates map to the vertices of the frame, so the vertex
        shader returns the vertex value as it receives it. No modifications are
        done to the received vertex since the passed vertices are already in the
        form of clip-space coordinates.
      </p>
      <GlslCodeHighlight code={firstVertexShaderSource.trim()} type="Vertex" />
      <h3>Pattern Example - A coordinate gradient</h3>
      <RandomImageGenerationFirstExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={firstFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        This fragment shader generates a gradient that's darkest at one corner
        and brightest at the opposite corner. The darkest corner will always be
        at the origin, since that is the point where the coordinates of the
        pixel will be 0 (or at least nearest to 0).
      </p>
      <p>
        In GLSL, the coordinates of the current fragment can be accessed through
        the <code>gl_FragCoord</code> constant. It contains the position of the
        fragment as the X and Y values, and the depth of the fragment as the Z
        value.
      </p>
      <p>
        In cases where a single fragment is generated per pixel, the position of
        this fragment will be the coordinates of the center of the pixel the
        fragment belongs to.
      </p>
      <p>
        This means that a fragment belonging to the lower-left most pixel, the
        coordinates of the fragment is {renderEquation(`(0.5, 0.5)`)}, when the
        location of the pixel itself is {renderEquation(`(0, 0)`)}.
      </p>
      <p>
        The coordinates of the fragments range from {renderEquation(`(0, 0)`)}{" "}
        to the width and height of the frame. In order to normalize these
        coordinates down to a range from 0 - 1, we can receive the total
        resolution of the frame from outside the shader (the shader by default
        has no way of knowing the resolution of the frame).
      </p>
      <p>
        The fragment coordinates can then be divided by the resolution to get
        the normalized coordinates of the fragment within the range from 0 - 1,
        which can make calculations simpler since we now work within a constant
        range.
      </p>
      <p>
        The color of the fragment is simply set as the product of the normalized
        X and Y coordinates of the fragment, and in greyscale (since R, G, and B
        components are all set to the same value).
      </p>
      <p>
        From this render, we can see that the origin of the X and Y axis is at
        the lower-left corner. The value of X increases as you move right, and
        the value of Y increases as you go up.
      </p>
      <p>Let's now look at the next example, where we tile the image.</p>
      <h3>Pattern Example - A tiled coordinate gradient</h3>
      <RandomImageGenerationSecondExample />
      <h4>How it works</h4>
      <p>
        Tiling an image is pretty simple. The image needs to be split into
        blocks, and then each block can have a calculation performed on it.
      </p>
      <p>
        However, since the fragment shader only works on inidividual fragments,
        we need to determine to which tile a fragment belongs, as well as its
        location in a tile. Once these details are known, operations can be
        performed as stated.
      </p>
      <p>
        We first define the tiling resolution in <code>tilingResolution</code>.
        This defines the number of tiles that are present along the X and Y
        axis. In our case, we define that there will be 12 tiles along the
        X-axis, and 9 along the Y-axis.
      </p>
      <p>
        The reason for this choice is that all rendered images here are at an
        aspect ratio of 4:3. In order for the tiles to be square, the tiling
        resolution needs to match this aspect ratio, which is true for our
        selected values ({renderEquation(`12:9 = 4:3`)}).
      </p>
      <p>
        Next, we have to determine the coordinates of the fragment relative to
        the tile the belong to. This can be done through a simple multiplication
        with the tiling resolution.
      </p>
      <p>
        Currently, our fragment coordinates are normalized within the range 0 -
        1. This means that these coordinates have become fully independent of
        resolution. Prior to this normalization, their positions were relative
        to the size of the frame.
      </p>
      <p>
        This is very useful, since now the coordinates can be "scaled up" to any
        resolution we wish. Let's go through an example to understand what we
        mean.
      </p>
      <p>
        Assume we have a frame with a resolution of {renderEquation(`(99, 99)`)}
        . The center of this frame would be at {renderEquation(`(50, 50)`)}. If
        we normalize the center coordinates, we would get:
      </p>
      <p className="util text-center">
        {renderEquation(`("(50, 50)") / ("(99, 99)") = (0.505050, 0.505050)`)}
        <br />
        <em>Note that these final coordinates are approximates</em>.
      </p>
      <p>
        If we multiply these coordinates with the original resolution, we get
        the original coordinate of the center back:
      </p>
      <p className="util text-center">
        {renderEquation(`("(0.505050, 0.505050)") * ("(99, 99)") = (50, 50)`)}
        <br />
        <em>Note that these final coordinates are approximates</em>.
      </p>
      <p>
        However, what if we intend to know what the coordinates of this center
        would be with a resolution of {renderEquation(`(49, 49)`)} instead?
        Simple, we just multiply this new resolution with the normalized
        coordinates of our center.
      </p>
      <p className="util text-center">
        {renderEquation(`("(0.505050, 0.505050)") * ("(49, 49)") = (25, 25)`)}
        <br />
        <em>Note that these final coordinates are approximates</em>.
      </p>
      <p>
        This means that the position of any coordinate can be when relative to
        any resolution just through the simple multiplication.
      </p>
      <p>
        Now let us assume our tiles as pixels on the screen. By multiplyign the
        tiling resolution with the normalized coordinates, we get the
        coordinates of the fragments relative to the tiling resolution.
      </p>
      <p>
        Since the number of fragments that have to be rendered by the GPU was
        initially w.r.t. the size of the frame, by downscaling the resolution
        down to the number of tiles we have set, we group up multiple fragments
        into a frame. To be more specific, it would be:
      </p>
      <p className="util text-center">
        {renderEquation(
          `(text(width of resolution) / text(number of tiles along width), text(height of resolution) / text(number of tiles along height))`
        )}
      </p>
      <p>
        Let us take our previous example and look into it further. If we took a
        tiling resolution of {renderEquation(`(10, 10)`)}, then the coordinates
        of the center w.r.t this resolution would be:
      </p>
      <p className="util text-center">
        {renderEquation(
          `("(0.505050, 0.505050)") * ("(10, 10)") = (5.050505, 5.050505)`
        )}
      </p>
      <p>
        Looking at these coordinates, we find that the value's of the components
        of the coordinates have two parts - an integral part (
        {renderEquation(`5`)}), and a decimal part ({renderEquation(`.050505`)}
        ).
      </p>
      <p>
        The integral part of the value represents the coordinate of the tile the
        fragment belongs to. In this case, the center belongs to the tile which
        has coordinates {renderEquation(`(5, 5)`)}. The decimal part of the
        value represents the normalized coordinates of the fragment w.r.t the
        tile that it belongs to.
      </p>
      <p>
        If you wish, you can further divide a tile into sub-tiles and start a
        tile-ception, and this same rule would still apply. Do note that for
        sub-tiles, you'll have to multiply the tiling resolution with the
        normalized component of this calculated coordinate, not the entire
        coordinate.
      </p>
      <p>
        Once we have the normalized coordinate of each fragment w.r.t its tile,
        the rest is as simple as the first example.
      </p>
      <GlslCodeHighlight
        code={secondFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        Looking at our code, we can see the application of the discussed
        concepts. We set a tiling resolution of ({renderEquation(`(12.0, 9.0)`)}
        ). The normalized coordinate of the fragment is then calculated.
      </p>
      <p>
        The coordinate of the fragment w.r.t. the tiling resolution is then
        calculated through the multiplication operation.
      </p>
      <p>
        However, for the color of the fragment, we only care about its
        normalized coordinate within the block it belongs to, so we grab the
        decimal component of the resultant coordinate.
      </p>
      <p>
        In GLSL, this can be done using the built-in function <code>fract</code>
        .
      </p>
      <p>
        <em>
          Note: In the shader code, any values w.r.t a parent tile will be
          prefixed with <code>block</code>. Any values w.r.t the frame of tiles
          will be prefixed with <code>tile</code>
        </em>
        . This is done to differentiate between them.
      </p>
      <p>
        These "tile normalized" coordinates are then used to calculate the color
        of the fragment, just like in the first example.
      </p>
      <p>Next, let's draw something else within the tiles.</p>
      <h3>Pattern Example - A tiled pattern with glowing center</h3>
      <RandomImageGenerationThirdExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={thirdFragmentShaderSource.trim()}
        type="Fragment"
      />
      <h3>Pattern Example - A tiled pattern with glowing diagonals</h3>
      <RandomImageGenerationFourthExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={fourthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <h3>Pattern Example - A tiled combination pattern</h3>
      <RandomImageGenerationFifthExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={fifthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <h3>Noise Example - Raw noise</h3>
      <RandomImageGenerationSixthExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={sixthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <h3>Noise Example - A tiled pattern of random colors</h3>
      <RandomImageGenerationSeventhExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={seventhFragmentShaderSource.trim()}
        type="Fragment"
      />
      <h3>Combined Example - A tiled pattern with random centers</h3>
      <RandomImageGenerationEightExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={eightFragmentShaderSource.trim()}
        type="Fragment"
      />
      <h3>Combined Example - A tiled pattern with random diagonals</h3>
      <RandomImageGenerationNinthExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={ninthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        Looking at the fragment shader code, there is an addition of a new
        function called <code>random</code>. This function generates a random
        number between 0 and 1 using a given 2D coordinate, which means it
        produces the same random number for the same coordinate.
      </p>
      <p>
        <em>
          Note: This random number generator function was taken from{" "}
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
        </em>
      </p>
      <h3>Summary</h3>
    </Content>
    <PageChange
      previous="/intermediates/color-2/"
      next="/intermediates/texturing-branching/"
    />
  </Layout>
)

export default ImageGenerationPage
