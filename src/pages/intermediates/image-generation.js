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
        blocks, and then each block can have operations performed on it.
      </p>
      <p>
        As the fragment shader can only work on individual fragments, two values
        need to be calculated for each of them:
      </p>
      <ul>
        <li>The tile the fragment belongs to</li>
        <li>
          The position of the fragment within that tile (in the form of
          normalized coordinates).
        </li>
      </ul>
      <p>
        Once these values are known, applying operations on each tile (or block)
        is simple.
      </p>
      <p>
        In order to understand how the math would work, let's look at the
        current image that we have.
      </p>
      <p>
        The current image we have is made up of pixels. The position of these
        pixels can be easily determined. Taking an image of resolution{" "}
        {renderEquation(`(99, 99)`)}, if we consider the screen as a graph and
        the lower-left corner pixel as the origin, then the center pixel would
        be located at {renderEquation(`(49, 49)`)}.
      </p>
      <p>
        Similarly, the coordinates of the top-right corner would{" "}
        {renderEquation(`(98, 98)`)}, the coordinates of the top-left corner
        would be {renderEquation(`(0, 98)`)}, the coordinates of the
        bottom-right corner would be {renderEquation(`(0, 98)`)}, and the
        coordinates of the bottom-left corner would be{" "}
        {renderEquation(`(0, 0)`)} (since that's the origin).
      </p>
      <p>
        We know that pixels contain multiple fragments. For this current
        situation, let's consider each pixel only containing one fragment, with
        its position at the center of the pixel.
      </p>
      <p>
        Our previous explanation assumes that pixels are point sized (they have
        no area). However, in reality, they do occupy a region of space, just
        like tiles.
      </p>
      <p>
        This means that the coordinates of the pixels don't exactly represent
        the position of that pixel, but instead a particular part of that pixel.
        As is with graphs and plotting, the coordinate of the pixel represents
        where the lower-left corner of the pixel is positioned.
      </p>
      <p>
        Since fragments belong to a particular pixel, their position is
        generally determined relative to each pixel. Since the coordinates of
        each pixel in an image is represented as an integer, the coordinates of
        the fragments within the pixel can be represented as decimal values of
        that integer coordinate.
      </p>
      <p>
        For example, with the center pixel in our previous example, the
        coordinate
        {renderEquation(`(49, 49)`)} now represents the lower-left corner of
        that pixel. As the position of the fragment lies at the center of the
        pixel, its coordinates would become:
      </p>
      <p className="util text-center">
        {renderEquation(
          `"fragment coordinates" = (49 + 0.5, 49 + 0.5) = (49.5, 49.5)`
        )}
      </p>
      <p>
        <em>
          Note: Since the coordinates of two consecutive pixels will have a
          difference of 1, a fragment within a pixel has to have a coordinate
          within the range of 0 to 1 (excluding 1, including 0). As the fragment
          in our example is at the centre, its coordinates would be{" "}
          {renderEquation(`50% "of 1" = 0.5`)}.
        </em>
      </p>
      <p>Here we notice two interesting properties:</p>
      <ul>
        <li>
          The integral part of the coordinates represents the pixel position.
        </li>
        <li>
          The decimal part of the coordinates represents the fragment position
          within that pixel. They are also considered as normalized coordinates
          of the fragment w.r.t that pixel (we'll look into that later).
        </li>
      </ul>
      <p>
        An important note about these coordinates is that they are dependent on
        the resolution of the image, which is {renderEquation(`(99, 99)`)}. This
        is evident through a simple check.
      </p>
      <p>
        We saw that the coordinates of the center pixel of the image is{" "}
        {renderEquation(`(49, 49)`)}. However, this coordinate is relative to
        the size of the image itself. If the size of the image changes, the
        coordinates of the center pixel would also change.
      </p>
      <p>
        These coordinates need to be converted into a format such that they are
        no longer dependent on the resolution of the image. By doing so, the
        coordinates become "normalized", and are independent of any resolution.
      </p>
      <p>
        The value of the components of normalized coordinates is always within
        the range of 0 to 1 (excluding 1, including 0).
      </p>
      <p>
        This can be done through a simple division operation of the pixel
        coordinate and the resolution of the image. The calculation is:
      </p>
      <p className="util text-center">
        {renderEquation(
          `text(normalized coordinates) = (text(pixel coordinate)_x / text(image resolution)_x, text(pixel coordinate)_y / text(image resolution)_y)`
        )}
      </p>
      <p>
        Once the normalized coordinates of any pixel are known, the coordinates
        of a pixel relative to any screen resolution can be determined through
        multiplication:
      </p>
      <p className="util text-center">
        {renderEquation(
          `text(new coordinates) = (text(pixel coordinate)_x / text(new resolution)_x, text(pixel coordinate)_y / text(new resolution)_y)`
        )}
      </p>
      <p>
        Now consider the pixels as tiles. Tiles have area as well, similar to
        pixels as we've discussed. So this allows us to map the concepts
        discussed so far into tiles.
      </p>
      <p>
        Tiles also contain a group of points, similar to the concept of pixels,
        where a fragment is be considered a point, and a pixel is considered a
        group of fragments, in this case there being only one fragment in the
        center.
      </p>
      <p>
        By normalizing the coordinates of a fragment, all the fragments from the
        original image are grouped into an image that is one pixel in size.
      </p>
      <p>
        This is evident by looking at the value of the components of the
        normalized coordinates. These coordinates will always have the integral
        component set to 0, which means that they all belong to the same pixel.
        It is the decimal component that determines where they are located
        within that pixel.
      </p>
      <p>
        If we took an image of resolution {renderEquation(`(100, 100)`)} with
        one fragment per pixel, when the fragment coordinates are normalized,
        the fragments are now simply mapped onto an image of resolution{" "}
        {renderEquation(`(1, 1)`)}.
      </p>
      <p>
        This means the pixel in this "new image" will contain all the fragments
        of the original image, which is{" "}
        {renderEquation(`100 times 100 = 10000`)}. The location of all these
        fragments within that pixel are determined from the decimal part of the
        values of the coordinates.
      </p>
      <p>
        By multiplying the normalized coordinates against another resolution,
        these fragments are again spread across all the pixels in that
        resolution. This can result in a change in the number of fragments per
        pixel, depending upon the new resolution.
      </p>
      <p>
        This is also evident from the resultant coordinates. The integral part
        of the coordinates will indicate which pixel the fragment belongs to,
        and the decimal part indicates where they are located within that pixel.
      </p>
      <p>
        If the fragments from the example are now spread across an image of
        resolution {renderEquation(`(10, 10)`)}, then each pixel in the new
        image will contain{" "}
        {renderEquation(`10000 / (10 times 10) = 10000 / 100 = 100`)} fragments.
      </p>
      <p>
        A fragment present within pixel of coordinates{" "}
        {renderEquation(`(5, 5)`)} will have coordinates{" "}
        {renderEquation(`("5.x", "5.y")`)}, where {renderEquation(`"x"`)} and{" "}
        {renderEquation(`"y"`)} are the decimal parts that tell the location of
        the fragment within that pixel.
      </p>
      <p>
        We initially noted that the decimal part of the coordinate is the
        normalized coordinate of the fragment. The reason for this is simple.
      </p>
      <p>
        We've just discussed how with normalized coordinates, the integral part
        is always constant, with the decimal part noting the actual location.
      </p>
      <p>
        Similarly, with the fragment coordinates, since the decimal part
        determines where within a specific pixel the fragment is located, it can
        be considered as the normalized coordinate relative to the pixel the
        fragment belongs to.
      </p>
      <p>
        The concept of tiling uses these principles, with a tile representing a
        pixel. When the coordinate of a fragment is normalized, it is grouped
        into a single tile.
      </p>
      <p>
        By multiplying this normalized coordinate with the "tiling resolution"
        (number of tiles across the screen, similar to screen resolution and
        pixels), the fragment is then placed into the tile that it should belong
        to.
      </p>
      <p>
        Using the final coordinates of the fragment, the tile the fragment it is
        present in can be determined by looking at the integral part of its
        coordinate, and its location within a tile (normalized coordinate w.r.t
        the tile) can be determined by looking at the decimal part of the
        coordinate.
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
        normalized coordinate within the tile it belongs to, so we grab the
        decimal component of the resultant coordinate.
      </p>
      <p>
        In GLSL, this can be done using the built-in function <code>fract</code>
        .
      </p>
      <p>
        <em>
          Note: In the shader code, any values w.r.t a parent tile will be
          prefixed with <code>block</code>. Any values w.r.t the all tiles will
          be prefixed with <code>tile</code>
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
