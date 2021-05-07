import { Link } from "gatsby"
import React from "react"

import Content from "../../components/content"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import Image from "../../components/image"
import RandomImageGenerationEighthExample from "../../components/intermediates/image-generation/eighth-example"
import { eighthFragmentShaderSource } from "../../components/intermediates/image-generation/eighth-example-shaders"
import RandomImageGenerationFifthExample from "../../components/intermediates/image-generation/fifth-example"
import { fifthFragmentShaderSource } from "../../components/intermediates/image-generation/fifth-example-shaders"
import RandomImageGenerationFirstExample from "../../components/intermediates/image-generation/first-example"
import { firstFragmentShaderSource, firstVertexShaderSource } from "../../components/intermediates/image-generation/first-example-shaders"
import RandomImageGenerationFourthExample from "../../components/intermediates/image-generation/fourth-example"
import { fourthFragmentShaderSource } from "../../components/intermediates/image-generation/fourth-example-shaders"
import RandomImageGenerationNinthExample from "../../components/intermediates/image-generation/ninth-example"
import { ninthFragmentShaderSource } from "../../components/intermediates/image-generation/ninth-example-shaders"
import RandomImageGenerationSecondExample from "../../components/intermediates/image-generation/second-example"
import { secondFragmentShaderSource } from "../../components/intermediates/image-generation/second-example-shaders"
import RandomImageGenerationSeventhExample from "../../components/intermediates/image-generation/seventh-example"
import { seventhFragmentShaderSource } from "../../components/intermediates/image-generation/seventh-example-shaders"
import RandomImageGenerationSixthExample from "../../components/intermediates/image-generation/sixth-example"
import { sixthFragmentShaderSource } from "../../components/intermediates/image-generation/sixth-example-shaders"
import RandomImageGenerationThirdExample from "../../components/intermediates/image-generation/third-example"
import { thirdFragmentShaderSource } from "../../components/intermediates/image-generation/third-example-shaders"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"
import { renderEquation } from "../../components/util"

const ImageGenerationPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
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
      <h3>Example - A coordinate gradient</h3>
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
        X and Y coordinates of the fragment, and in grayscale (since R, G, and B
        components are all set to the same value).
      </p>
      <p>
        From this render, we can see that the origin of the X and Y axis is at
        the lower-left corner. The value of X increases as you move right, and
        the value of Y increases as you go up.
      </p>
      <p>Let's now look at the next example, where we tile the image.</p>
      <h3>Example - A tiled coordinate gradient</h3>
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
        As is with graphs and plotting, the coordinates of the pixel represents
        where the lower-left corner of the pixel is positioned.
      </p>
      <p>
        Since fragments belong to a particular pixel, their position is
        generally determined relative to each pixel.
      </p>
      <p>
        Since the coordinates of each pixel in an image is represented as an
        integer, the coordinates of the fragments within the pixel can be
        represented as decimal values of the integer coordinates.
      </p>
      <p>
        For example, with the center pixel in our previous example, the
        coordinates
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
          difference of 1, a fragment within a pixel has to have coordinates
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
        {renderEquation(`(49, 49)`)}. However, the coordinates are relative to
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
        coordinates and the resolution of the image. The calculation is:
      </p>
      <p className="util text-center">
        {renderEquation(
          `text(normalized coordinates) = (text(pixel coordinates)_x / text(image resolution)_x, text(pixel coordinates)_y / text(image resolution)_y)`
        )}
      </p>
      <p>
        Once the normalized coordinates of any pixel are known, the coordinates
        of a pixel relative to any screen resolution can be determined through
        multiplication:
      </p>
      <p className="util text-center">
        {renderEquation(
          `text(new coordinates) = (text(pixel coordinates)_x / text(new resolution)_x, text(pixel coordinates)_y / text(new resolution)_y)`
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
        We initially noted that the decimal part of the coordinates are the
        normalized coordinates of the fragment. The reason for this is simple.
      </p>
      <p>
        We've just discussed how with normalized coordinates, the integral part
        is always constant, with the decimal part noting the actual location.
      </p>
      <p>
        Similarly, with the fragment coordinates, since the decimal part
        determines where within a specific pixel the fragment is located, it can
        be considered as the normalized coordinates relative to the pixel the
        fragment belongs to.
      </p>
      <p>
        The concept of tiling uses these principles, with a tile representing a
        pixel. When the coordinates of a fragment is normalized, it is grouped
        into a single tile.
      </p>
      <p>
        By multiplying this normalized coordinates with the "tiling resolution"
        (number of tiles across the screen, similar to screen resolution and
        pixels), the fragment is then placed into the tile that it should belong
        to.
      </p>
      <p>
        Using the final coordinates of the fragment (which we'll refer to as the
        tiling coordinates), we can:
      </p>
      <ul>
        <li>
          Determine the tile the fragment is present in by looking at the
          integral part of its tiling coordinates (which we'll refer to as tile
          coordinates).
        </li>
        <li>
          Determine its location within a tile (normalized coordinates w.r.t the
          tile) by looking at the decimal part of its tiling coordinates (which
          we'll refer to as tile normalized coordinates).
        </li>
      </ul>
      <GlslCodeHighlight
        code={secondFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        Looking at our code, we can see the application of the discussed
        concepts. We set a tiling resolution of ({renderEquation(`(12.0, 9.0)`)}
        ). The normalized coordinates of the fragment are then calculated.
      </p>
      <p>
        The tiling coordinates of the fragment w.r.t. the tiling resolution is
        then calculated through the multiplication operation.
      </p>
      <p>
        However, for the color of the fragment, we only care about its tile
        normalized coordinates, so we grab the decimal component of the
        resultant coordinates.
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
        The tile normalized coordinates are then used to calculate the color of
        the fragment, just like in the first example.
      </p>
      <p>Next, let's draw something else within the tiles.</p>
      <h3>Pattern Example - A tiled pattern with glowing center</h3>
      <RandomImageGenerationThirdExample />
      <h4>How it works</h4>
      <p>
        Now equipped with the information on how to tile an image, and get the
        necessary values required to work within a tile, we can start drawing
        within tiles.
      </p>
      <p>
        The algorithm for drawing a glowing circle that dims as you move towards
        the edge is simple:
      </p>
      <ul>
        <li>
          Determine the tile normalized coordinates for the center of the
          circle.
        </li>
        <li>
          Calculate the distance of the current fragments' tile normalized
          coordinates from the center.
        </li>
        <li>
          The distance from the center determines the brightness of the
          fragment. The closer a fragment is to the center, the brighter it will
          be.
        </li>
      </ul>
      <GlslCodeHighlight
        code={thirdFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        First, we need to determine the tile normalized coordinates center of a
        tile. In a tile, the tile normalized coordinates of the center would be{" "}
        {renderEquation(`(0.5, 0.5)`)}, since the center would be located at the
        50% width and height mark of a tile.
      </p>
      <p>
        We can then calculate the distance between the fragment and the center
        of the tiles using their normalized coordinates. In GLSL, a built-in
        function exists that can provide this value, called{" "}
        <code>distance</code>.
      </p>
      <p>
        Since we wish for fragments closer to the center of the tile to be
        brighter, we calculate the factor for the brightness as 1.0 (which is
        the maximum possible brightness) minus the distance of the fragment from
        the center.
      </p>
      <p>
        The result of this factor is stored in a variable called{" "}
        <code>centerFactor</code>, since this brightness factor is based around
        the center of the tile.
      </p>
      <p>
        This brightness factor can now be set as the grayscale color of the
        fragment. This will result in fragments further away from the center of
        the tile becoming brighter.
      </p>
      <p>
        One thing to note is that the brightness factor is multiplied to the
        power of 3 (using the GLSL function <code>pow</code>), which is then set
        as the grayscale color of the fragment.
      </p>
      <p>
        There are two reasons this was done, and are also interlinked with each
        other:
      </p>
      <ul>
        <li>
          It increases the range of brightness values that are possible for the
          fragments.
        </li>
        <li>
          It increases the dropoff in brightness exponentially with distance.
        </li>
      </ul>
      <p>
        Without using <code>pow</code>, the possible range for the brightness
        values of fragments would be 1.0 - 0.3.
      </p>
      <ul>
        <li>
          Points at the center would have a distance of 0, their brightness
          would be 1.0.
        </li>
        <li>
          Points at the edges of a tile would have a maximum distance of 0.7
          (the distance of the corners from the center), making their brightness
          factor go down to 0.3.
        </li>
      </ul>
      <p>
        By multiplying the factor by the power of 3, this range increases
        dramatically, to 1.0 - 0.027, since the lowest possible brightness gets
        cubed.
      </p>
      <p>
        This also means that the dropoff in brightness increases exponentially
        with distance from the center. Since the edges are now darker, the
        fragments in between will drop off in brightness a lot more to maintain
        the transition and range.
      </p>
      <p>
        Use this trick to your advantage if you need to exaggerate color values
        of your fragments.
      </p>
      <h3>Pattern Example - A tiled pattern with glowing diagonals</h3>
      <RandomImageGenerationFourthExample />
      <h4>How it works</h4>
      <p>
        Drawing a pattern of diagonal lines across a tile may seem complex but,
        looking at the mathematics, we'll see that it's much more simple than it
        appears to be.
      </p>
      <p>
        In this pattern, we wish for fragments to grow dimmer the further they
        are from a either diagonal line. This requires calculating the distance
        of the fragment from either diagonal.
      </p>
      <p>
        In our image, we are dealing with square tiles, so all our calculations
        will be respective to that particular shape. For non-square tiles, the
        calculations may differ slightly, but the same requirement exists.
      </p>
      <p>
        Let's take the center of the tile as the origin of the graph. The tile
        is a square, and the tile normalized coordinates of the center of the
        tile is {renderEquation(`(0.5, 0.5)`)}. This results in the boundaries
        of the tile in our graph being 0.5 units away from the origin.
      </p>
      <p>The plot for this would be:</p>
      <div className="image util text-center">
        <Image
          src="intermediates/tile-plot.png"
          alt="Tile Graph Plot"
          style={{ maxWidth: "65%" }}
        />
        <br />
        <a
          href="https://www.transum.org/Maths/Activity/Graph/Desmos.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Image Generation Source
        </a>
      </div>
      <p>
        Adding the diagonals of the tile to the graph would result in the plot:
      </p>
      <div className="image util text-center">
        <Image
          src="intermediates/tile-diagonal-plot.png"
          alt="Tile With Diagonals Graph Plot"
          style={{ maxWidth: "65%" }}
        />
        <br />
        <a
          href="https://www.transum.org/Maths/Activity/Graph/Desmos.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Image Generation Source
        </a>
      </div>
      <p>
        Here, we can notice a peculiar property of diagonals - the absolute
        values of the X and Y coordinates of points on the diagonal are always
        equal. This can be easily verified from the plot generated above.
      </p>
      <p>
        So in order to determine if a point is on a diagonal line, we just need
        to find the difference between the absolute values of its X and Y
        coordinates. If it's zero, then we know it is on the diagonal.
      </p>
      <p>
        This subtraction calculation also provides us with another info - an
        approximate distance from the closest diagonal line.
      </p>
      <p>
        Any point that has a difference greater than zero between its X and Y
        coordinates are known to be present outside the line. This difference
        provides us with an approximation of how far away the point is.
      </p>
      <p>
        It will, in many cases, not equal to the closest distance between a
        point and the closest diagonal line, but for our purposes it is a good
        enough approximation.
      </p>
      <p>
        Now that we can calculate the distance of a fragment from the closest
        diagonal line, we can apply the same principles we learnt from the
        previous shader example.
      </p>
      <GlslCodeHighlight
        code={fourthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        The first few lines in the shader are similar to the previous shader
        example. After that, we first determine the tile normalized coordinates
        of the fragment.
      </p>
      <p>
        This is done through simple subtraction of the tile normalized
        coordinates of the center of the tile from the tile normalized
        coordinates of the fragment, thanks to the properties of vector
        mathematics.
      </p>
      <p>
        Since we don't care about the signs of the X and Y coordinates of the
        fragment, just their absolute values, we remove the signs from the
        resulting coordinates calculation. In GLSL, the built-in function{" "}
        <code>abs</code> achieves this operation.
      </p>
      <p>
        Next we determine the distance of the point from the diagonal through
        the subtraction of the X and Y coordinates of the fragment. Only the
        absolute value of this result matters, hence the use of the{" "}
        <code>abs</code> function again.
      </p>
      <p>
        Since the smaller this distance is, the closer the fragment is to the
        diagonal, this value is subtracted from 1.0 so that points closer to the
        diagonal are brighter (similar to the previous shader example).
      </p>
      <p>
        This result is stored in a variable called <code>diagonalFactor</code>,
        since this brightness factor is based on the distance from the diagonal.
      </p>
      <p>
        From this point onwards, it is again similar to the previous shader -
        using the brightness value to set the grayscale color of the fragment,
        and exaggerating the color difference using <code>pow</code>.
      </p>
      <p>
        Any pattern drawing that depends on tiling works on the same basics as
        the two patterns shown - splitting the image into tiles, and then
        operating within a single tile using the tile normalized coordinates.
      </p>
      <p>
        A pattern may not necessarily be created through a completely unique set
        of rules. Multiple patterns can be combined to form new patterns that
        produce interesting effects.
      </p>
      <p>
        Let's look at an example where we combine our previous two patterns into
        one and see the results.
      </p>
      <h3>Pattern Example - A tiled combination pattern</h3>
      <RandomImageGenerationFifthExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={fifthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        In this example, we can see that we perform the calculations for the
        center brightness factor and diagonal brightness factor exactly as shown
        previously.
      </p>
      <p>
        The results of these two factors are combined (or merged) through a
        multiplication operation. This results in the image that you see above.
      </p>
      <p>Looking at the image, you can see the effects of both factors:</p>
      <ul>
        <li>
          The diagonal lines are visible, but are sharpened at the edges due to
          the effect of the center brightness factor.
        </li>
        <li>
          The brightness decreases closer to the edges of the tiles, but it
          produces a more "square-ish" shape than a circular one due to the
          diagonal brightness factor.
        </li>
      </ul>
      <p>
        Here we see the effects of both the diagonal brightness factor and
        center brightness factor, but neither dominating over each other. The
        reason for this is due to the multiplication operation.
      </p>
      <p>
        A question that might be raised is why addition wasn't used instead.
        Addition is an operation that basically stacks such effects, but doesn't
        "combine" them into one.
      </p>
      <p>
        Here's an analogy to explain the effects of addition and multiplication:
      </p>
      <ul>
        <li>
          Addition is like taking a cake, applying a layer of frosting over it,
          and then adding a layer of chocolate sprinkles on top.
          <ul>
            <li>
              The frosting and sprinkles are in visibly separate layers, with
              the texture properties of both present only in their respective
              layers.
            </li>
            <li>The frosting and sprinkles can be separated with ease.</li>
            <li>
              If enough sprinkles are spread evenly enough across the frosting,
              it can obscure a majority of the frosting from the view.
            </li>
          </ul>
        </li>
        <li>
          Multiplication is like taking a bowl, putting in the frosting and
          chocolate sprinkles, and mixing it together into one mixture, and then
          layering this mixture on top of the cake.
          <ul>
            <li>
              The mixture combines the texture of the frosting and the
              sprinkles.
            </li>
            <li>
              The frosting and sprinkles are relatively much harder to separate.
            </li>
            <li>
              A relatively much larger ratio of sprinkles vs frosting is
              required to obscure the frosting.
            </li>
          </ul>
        </li>
      </ul>
      <p>
        By performing an addition operation between the two factors, one factor
        could completely dominate over the other in certain fragments, and
        appear to stack over each other instead.
      </p>
      <p>
        By contrast, performing a multiplication operation "melds" the two
        factors together into a result where being able to separate the
        individual effects is harder to do visually.
      </p>
      <p>
        In these types of cases, an addition operation stacks effects and
        factors, whereas a multiplication operation mixes effects and factors
        into one.
      </p>
      <p>
        The effects of multiplication and addition for combining and stacking
        effects will be more apparent in the{" "}
        <Link to="/intermediates/lighting/">
          lighting and dithering chapter
        </Link>
        .
      </p>
      <p>
        So far, we've looked into images generated through the use of patterns,
        specifically tiling and patterns within tiles. Next, let's look at how
        images can be generated using randomness and noise.
      </p>
      <h3>Randomness Example - Random noise</h3>
      <RandomImageGenerationSixthExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={sixthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        In this example, for each fragment a random number is generated within
        the range of 0 - 1 (excluding 1, including 0). For this, a user-defined{" "}
        <code>random</code> was used to create a number from given 2D
        coordinates.
      </p>
      <p>
        The function is provided with the normalized coordinates of the fragment
        as a parameter, and the random number returned is used as the grayscale
        color value for the fragment.
      </p>
      <p>
        The <code>random</code> function used here will always generate the same
        random number given the same input, which allows for consistency.
      </p>
      <p>
        However, if it is required to always be unique, modifying the passed 2D
        coordinates with the current time can be done to make sure a new random
        value is generated for every render.
      </p>
      <p>
        <em>
          Note: The random function code was taken from{" "}
          <a
            href="https://github.com/PistonDevelopers/shaders/wiki/Some-useful-GLSL-functions"
            target="_blank"
            rel="noopener noreferrer"
          >
            this GitHub Wiki page
          </a>
          .
        </em>
      </p>
      <h3>Randomness Example - A tiled pattern of random (grayscale) colors</h3>
      <RandomImageGenerationSeventhExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={seventhFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        For setting up a tile of random grayscale colors, we first setup the
        tiles as learnt in the previous pattern examples, but make certain
        changes.
      </p>
      <p>
        In the pattern examples, we were only concerned with working within the
        block itself. So, when we generated the tile normalized coordinates of
        the fragment (<code>coordinates * tilingResolution</code>
        ), we ignored the integer component and only kept the decimal component
        using the function <code>fract</code>.
      </p>
      <p>
        However, in the current situation, we will use the tile coordinates of
        the fragment to determine what color the tile will be. This requires the
        integer part of the fragment coordinates to be taken, with the
        fractional part ignored.
      </p>
      <p>
        In GLSL, by using the built-in function <code>floor</code> to floor a
        value (round a number to the nearest integer value at or below it), we
        remove the decimal component of the coordinates.
      </p>
      <p>
        The resultant coordinates are the tile coordinates of the fragment.
        Next, this tiling coordinates needs to be converted into normalized
        coordinates, since its value is currently dependent on the tiling
        resolution.
      </p>
      <p>
        By dividing the tile coordinates by the tiling resolution, we get back
        the normalized coordinates of the tile itself (to be specific, the
        lower-left corner of the tile).
      </p>
      <p>
        These normalized coordinates are then passed to the <code>random</code>{" "}
        function, whose returned value is then used as the grayscale color value
        of the tile.
      </p>
      <p>
        All fragments within a tile will have the same tile coordinates as they
        all belong to the same tile. This means that they will generate the same
        random number, ensuring that the entire tile is the same color.
      </p>
      <h3>Combined Example - A tiled pattern with random centers</h3>
      <RandomImageGenerationEighthExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={eighthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        In this example, the concepts of the pattern example of glowing circles
        is combined with the concepts of the random tile example to randomize
        the position of the center of the circles.
      </p>
      <p>
        In this example, instead of taking the standard tile normalized
        coordinates of the center of the block {renderEquation(`(0.5, 0.5)`)},
        we generate the tile normalized coordinate of the center randomly
        instead.
      </p>
      <p>
        We've seen in the previous example on how to generate a random number
        for each tile. We then use this number to select a value within a range
        of numbers.
      </p>
      <p>
        In this example, the center will only be placed on the diagonal of the
        tile that goes from the lower-left corner to the top-right corner, with
        the range of its X and Y coordinates limited to 0.1 to 0.9. A value is
        then selected within this range using the random number for the tile.
      </p>
      <p>
        To select a value within the set range using the random number as a
        factor, we can use a method called linear interpolation. But first,
        let's see what linear interpolation is.
      </p>
      <p>
        Let's consider a range 0.0 to 1.0. We need to get a number within this
        range using a certain factor provided to us. From this factor, we figure
        out how far into this range the number will be present, and return the
        number at that point.
      </p>
      <p>
        So if this value of this factor provided is 0.3, which is 30% in terms
        of percentages. So, this factor tells us that we should move 30% across
        the range of 0.0 - 1.0, starting at 0.0, and the number that is at this
        30% mark should be returned.
      </p>
      <p>
        The number that is present 30% away from 0.0 and 70% away from 1.0 would
        be 0.3. Hence, the result of this calculation will be 0.3.
      </p>
      <p>
        This method of generating a value by travelling through a certain range
        of numbers by a certain factor, and returning the value at that point in
        the range, is called linear interpolation.
      </p>
      <p>
        The formula for this calculation is simple - given a range{" "}
        {renderEquation(`X - Y`)} and a factor {renderEquation(`F`)} that is
        within the range {renderEquation(`0.0 - 1.0`)}, the formula is:
      </p>
      <p className="util text-center">
        {renderEquation(`(X times (1 - F)) + (Y times F)`)}
      </p>
      <p>
        In GLSL, a built-in function <code>mix</code> can perform this
        calculation, which we use to calculate the value of the tile normalized
        coordinates for our random center, with the X and Y components being the
        same.
      </p>
      <p>
        Once the random center is calculated, the rest of the process is similar
        to the original glowing circle pattern example.
      </p>
      <p>
        In this example, we modified the position of the center of the circle,
        thereby displacing it from the center within the tile.
      </p>
      <p>
        In the next example, let's look at how the random factor can be used to
        make "decisions" on what should and should not be shown.
      </p>
      <h3>Combined Example - A tiled pattern with random diagonals</h3>
      <RandomImageGenerationNinthExample />
      <h4>How it works</h4>
      <p>
        In this example, either diagonal needs to be shown based upon the random
        factor of the tile. First, let's take a look of the tile with diagonals
        plot again.
      </p>
      <div className="image util text-center">
        <Image
          src="intermediates/tile-diagonal-plot.png"
          alt="Tile With Diagonals Graph Plot"
          style={{ maxWidth: "65%" }}
        />
        <br />
        <a
          href="https://www.transum.org/Maths/Activity/Graph/Desmos.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Image Generation Source
        </a>
      </div>
      <p>
        Let's name the diagonal starting from the lower-left corner and ending
        at the upper-right corner <code>diagonal 1</code>, and name the other
        diagonal <code>diagonal 2</code>.
      </p>
      <p>
        For the initial diagonal example, we were ignoring the sign of the
        values of the coordinates of the diagonal points, which simplified
        calculations to see if a point was on either diagonal, or how far away
        it was from either diagonal.
      </p>
      <p>
        However, in the current example, we need to separately calculate the
        distance from <code>diagonal 1</code> and <code>diagonal 2</code> and,
        depending on which diagonal is to be shown, use either result.
      </p>
      <p>
        For <code>diagonal 1</code>, both X and Y components of points on the
        diagonal increase together. By finding the difference between the X and
        Y components, we find the distance from <code>diagonal 1</code>, which
        is similar to the original diagonal pattern example.
      </p>
      <p>
        For <code>diagonal 2</code>, the X and Y components of points on the
        diagonal progress in opposite directions. The X components increases and
        the Y component decreases as you go from left to right, with the X
        component starting at the lowest value, and the Y component starting at
        the highest value.
      </p>
      <p>
        This also means that the signs of the X and Y components of the points
        on the diagonal are also always opposite to each other. Looking at the
        points on <code>diagonal 2</code>, this becomes apparent.
      </p>
      <p>
        The coordinates of the top-left corner the square, which is the one of
        the ends of <code>diagonal 2</code>, has coordinates{" "}
        {renderEquation(`(-0.5, 0.5)`)}. Similarly, the coordinates of the other
        end of the diagonal at the bottom-right corner are{" "}
        {renderEquation(`(0.5, -0.5)`)}.
      </p>
      <p>
        This difference compared to <code>diagonal 1</code> means that the
        calculation of the distance from <code>diagonal 2</code> has to be done
        as an addition operation instead of a subtraction operation.
      </p>
      <p>
        This change accounts for these differences and ensures that the result
        of the calculation doesn't differ from what's expected.
      </p>
      <p>
        Once the distance of the fragment from both diagonals are calculated, we
        can use a decision factor to determine which one gets applied.
      </p>
      <GlslCodeHighlight
        code={ninthFragmentShaderSource.trim()}
        type="Fragment"
      />
      <p>
        Looking at the code, you can see the principles we've discussed so far
        applied. For calculating the distance from <code>diagonal 1</code>, we
        subtract the X and Y components of the fragment coordinates, same as our
        initial diagonal pattern example.
      </p>
      <p>
        For <code>diagonal 2</code>, instead of performing a subtraction
        operation, we perform the addition operation instead, due to the nature
        of the X and Y components having opposite signs in{" "}
        <code>diagonal 2</code>.
      </p>
      <p>
        Once these two are calculated, we then calculate what the color of the
        fragment would be respective to each diagonal, which is similar to the
        original diagonal pattern example. After this, we calculate the random
        factor for the tile, and then decide which diagonal to show.
      </p>
      <p>
        Let's define a threshold of 0.5 on the random factor. If the random
        factor is below this threshold, then we'll show only{" "}
        <code>diagonal 2</code>. However, if this is not the case, then{" "}
        <code>diagonal 1</code> will be shown instead.
      </p>
      <p>
        In GLSL, a built-in function called <code>step</code> allows us to
        achieve this objective. It is provided with the threshold and the value
        to check as parameters. If the value is below the threshold, it returns
        0, or else it returns 1.
      </p>
      <p>
        By multiplying this result with the appropriate diagonal color, we
        cancel out the color value w.r.t diagonal that shouldn't be shown, and
        only maintain the color value w.r.t the diagonal which should be shown.
      </p>
      <p>
        For <code>diagonal 1</code>, it should only be shown if the random
        factor exceeds the threshold of 0.5. So for this, the final factor for{" "}
        <code>diagonal 1</code> was calculated by checking whether the random
        factor was exceeding the threshold using <code>step</code>, and
        multiplying that result with the color value w.r.t.{" "}
        <code>diagonal 1</code>.
      </p>
      <p>
        If the random factor is less than 0.5, <code>step</code> will return 0,
        meaning that the effective color factor of <code>diagonal 1</code> is 0.
      </p>
      <p>
        If the factor is above 0.5, <code>step</code> will return 1, which means
        the effective color factor for <code>diagonal 1</code> will be the
        calculated color value for it.
      </p>
      <p>
        Similar steps are followed for calculating the effective color factor
        for <code>diagonal 2</code>, except we use the inverse of the value
        returned by <code>step</code> (<code>1.0 - step(...)</code>) with the
        same threshold, using the user-defined function <code>invert_step</code>
        .
      </p>
      <p>
        Since the factors for both diagonals use the same threshold value, only
        either one of the diagonals will have a non-zero value, since if{" "}
        <code>step</code> returns 1, then <code>invert_step</code> will return
        0, and vice-versa.
      </p>
      <p>
        The final diagonal factor of the fragment is chosen as the maximum value
        between the effective factor of <code>diagonal 1</code> and{" "}
        <code>diagonal 2</code>, since one of them will be 0, and the other will
        be greater than 0. In GLSL, this can be done using the built-in function{" "}
        <code>max</code>.
      </p>
      <p>
        The final color value of the fragment is set using this final chosen
        diagonal factor.
      </p>
      <p>
        An additional case can be added where both diagonals can be shown. This
        can be done by commenting lines 28 and 29, and uncommenting lines 30 and
        31.
      </p>
      <p>
        The threshold for showing <code>diagonal 1</code> becomes 0.4. If the
        random factor is more than 0.4, then the diagonal will be shown.
      </p>
      <p>
        Similaryly, the threshold for showing <code>diagonal 2</code> becomes
        0.6. If the random factor is less than 0.6, then the diagonal will be
        shown.
      </p>
      <p>
        This results in a range 0.4 to 0.6, where if the random factor of the
        tile lies within this range, then both diagonals will be shown on the
        tile.
      </p>
      <p>
        Since now there is a case where the effective color factor of both
        diagonals can be non-zero at the same time, the final diagonal color
        factor becomes whichever diagonal color factor is greater.
      </p>
      <p>
        If the color factor of the <code>diagonal 1</code> is greater, this
        means that the fragment is closer to <code>diagonal 1</code> than{" "}
        <code>diagonal 2</code>, so the fragment should be colored w.r.t.{" "}
        <code>diagonal 1</code>.
      </p>
      <p>
        Similarly, if the color factor of the <code>diagonal 2</code> is
        greater, this means that the fragment is closer to{" "}
        <code>diagonal 2</code> than <code>diagonal 1</code>, so the fragment
        should be colored w.r.t. <code>diagonal 2</code>.
      </p>
      <p>
        Since we're already selecting the maximum color value w.r.t.{" "}
        <code>diagonal 1</code> and <code>diagonal 2</code>, this case is
        already accounted for.
      </p>
      <p>
        The only change required is to change thresholds for either diagonal
        such that there will be an overlapping range where both diagonals can be
        shown for a tile.
      </p>
      <h3>Additional Notes</h3>
      <p>
        The concepts taught so far show the basics of pattern image generation,
        random noise image generation, and a combination of both.
      </p>
      <p>
        These concepts can be further built upon to generate sub-patterns within
        patterns, or multiple layers of randomness and patterns combined
        together.
      </p>
      <p>
        These patterns and randomness can also be animated by including time as
        a factor as well, which opens up options for dynamic and animated image
        generation. Time can be used to influence the randomness of an image, or
        the patterns of an image.
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Images can be generated without using external data, but just using
          some algorithmic logic within shaders.
        </li>
        <li>
          Images can be generated using patterns and procedural code, or with
          random values and noise.
        </li>
        <li>
          Logic from pattern/procedural images and random images can be stacked
          or combined with each other to create many more types of images.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/intermediates/color-2/"
      next="/intermediates/mapping/"
    />
  </Layout>
)

export default ImageGenerationPage
