import { StaticImage } from "gatsby-plugin-image";
import React from "react";

import Content from "../../components/content";
import Heading from "../../components/heading";
import Layout from "../../components/layout";
import PageChange from "../../components/page-change";
import Seo from "../../components/seo";

const ColorPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Basics - Color"
      description="A look into certain concepts and details of digital colors."
      keywords={["color", "shader", "basics"]}
    />
    <Content>
      <h1>Shader Basics - Color</h1>
      <p>
        In order for computers to have the ability to show color, they need a
        way to represent the color values which can be used to show the
        necessary colors as well as store them. This value is then used to color
        the pixels that form the individual blocks of a display.
      </p>
      <Heading type="h2">How are colors represented in computers?</Heading>
      <p>
        Computers represent pixel colors through numbers, and have four color
        values (or channels) they store per pixel - red channel (R), green
        channel (G), and blue channel (B). An alpha (transparency) channel (A)
        can also be used, but is optional.
      </p>
      <p>
        Generally computers represent each channel using an 8-bit number,
        resulting in the color of pixel being represented using upto 32 bits
        total. However, with HDR (high dynamic range) the color of each pixel is
        represented in at least 30 bits (without alpha), making each channel use
        a 10-bit number.
      </p>
      <p>
        The number stored for a particular channel represents the brightness of
        the color that the channel represents. So if the number for the red
        channel is 0, that means there is no red in the final color of the
        pixel. At 255, the red channel is at maximum brightness, showing the
        brightest red possible.
      </p>
      <Heading type="h2">How are colors represented in shaders?</Heading>
      <p>
        Colors can be represented using vectors, like vertices. The size of the
        vector depends on the number of channels that are required to represent
        the color, with size four providing the most information.
      </p>
      <p>
        Current computer displays require colors of pixels to be provided with
        red, green, and blue channels. So colors values that use more or less
        channels have to be converted into this format. Shaders accept colors
        with all four channels (RGBA), and then convert that into RGB.
      </p>
      <p>
        While each channel of a color is represented as an 8-bit number, in
        shaders each channel is represented using a 32-bi floating point number.
        The GPU later converts this to the representation used by computer
        displays.
      </p>
      <Heading type="h2">
        Why are colors represented as a combination of red, green, and blue?
      </Heading>
      <p>
        Our eyes have three types of "cones" that activate when light consists
        of certain wavelengths of colors - L cone, M cone, and S cone.
      </p>
      <p>
        The L cones is most sensitive to light of long wavelengths of visible
        light (hence the name) and, similarly, the M and S cones are sensitive
        to medium and short wavelengths of visible light respectively.
      </p>
      <p>
        In the visible light spectrum, red is a color that has a long
        wavelength, green is a color of medium wavelength, and blue is a color
        of short wavelength.
      </p>
      <p>
        This means that when L cones activate, they make our brains see the
        color red, when M cones activate we see the color green, and when blue
        cones activate we see the color blue.
      </p>
      <p>
        This generally allows us to see a wide range of the visible spectrum of
        light. To understand why, lets look at what the spectrum of visible
        light is.
      </p>
      <div className="util text-center">
        <StaticImage
          src="../../images/basics/color-1.png"
          alt="Visible Light Spectrum"
          style={{ maxWidth: "65%" }}
        />
        <br />
        <a
          href="https://commons.wikimedia.org/wiki/File:EM_spectrum.svg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </div>
      <p>
        If you look at the image, you'll see that the colors red and blue lie
        around the edge of the bisible light spectrum, while the color green is
        somewhat in the middle.
      </p>
      <p>
        If varying amounts of these colors are mixed together, they are able to
        produce colors that lie between them as well. For example, yellow can be
        produced using green and red.
      </p>
      <p>
        The fact that our eyes see all colors using these three "primary" colors
        is why computers do the same, as it allows them to show color that suits
        our vision the best.
      </p>
      <p>
        You can read more about how are eyes see color from{" "}
        <a
          href="https://en.wikipedia.org/wiki/Cone_cell"
          target="_blank"
          rel="noopener noreferrer"
        >
          this Wikipedia article on cone cells
        </a>
        .
      </p>
      <p>
        <em>
          Side-note: Our eyes are also most sensitive to the color green,
          meaning we can notice differences between shades of green more easily
          than with red and blue. This fact is also taken advantage of in
          computer technology.
        </em>
      </p>
      <Heading type="h2">
        Can color only be represented as RGB by computers?
      </Heading>
      <p>
        While colors are generally represented using RGB by computers, and are
        also how humans see colors, it is not the only way colors are
        represented.
      </p>
      <p>
        While RGB is a representation that is easy for computers to understand
        and work with, and also how our eyes generally see color, it isn't very
        intuitive for humans to understand.
      </p>
      <p>
        There are two alternate representations that are also in use - HSL (hue,
        saturation, lightness) and HSV/HSB (hue, saturation, value/brightness).
        These representations are much closer to how we perceive color making.
      </p>
      <div className="util text-center">
        <StaticImage
          src="../../images/basics/color-2.png"
          alt="HSV Color Wheel"
          style={{ maxWidth: "65%" }}
        />
        <br />
        <a
          href="https://commons.wikimedia.org/wiki/File:HSV_color_solid_cylinder_saturation_gray.png"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </div>
      <p>Let's look at what the components of these representations mean:</p>
      <Heading type="h3">Hue</Heading>
      <p>
        Hue is the colors from the visible light spectrum. It is a 360 degree
        circle that starts with red at degree 0, then goes to green at the 120
        degree mark, then to blue at the 240 degree mark, and then wraps back to
        red at 360 degrees.
      </p>
      <p>
        This allows all colors to be represented in their bare form, and places
        complementary colors opposite to each other.
      </p>
      <Heading type="h3">Saturation</Heading>
      <p>
        Let's take up the example of tea and sugar. When there is no sugar in
        the tea, the tea tastes just as it is in its pure form. This means that
        there is 0% concentration of sugar in the tea.
      </p>
      <p>
        As sugar is added to the tea, the concentration of sugar increases,
        which sweetens the tea. Eventually, when the sugar reaches the
        concentration of 100%, there is no more tea present, meaning that what
        remains is just sugar.
      </p>
      <p>
        Saturation is similar in concept, where the tea is the final color, the
        sugar is the selected hue, and the concentration is the saturation of
        the hue.
      </p>
      <p>
        When there is no hue in the color, the color is white, which is its pure
        form. As the saturation of the hue increases, the color of the hue adds
        up more and more to the final color. At 100% saturation, all the remains
        is the actual color value of the hue.
      </p>
      <Heading type="h3">Value/Brightness and Lightness</Heading>
      <p>
        Value is similar to saturation, but starts from black. As the value of
        the hue is increased, the brightness of the color increases, which
        allows a brighter shade of the color to be shown.
      </p>
      <p>
        At full value, the hue is at its highest brightness, which is the raw
        color of the hue.
      </p>
      <p>
        While value/brightness only stops at the final color of the hue, the
        lightness component can go even brighter and brighter, which makes the
        hue transform from its raw color into white.
      </p>
      <p>
        This property allows the color white to be represented in two ways
        through HSL - by zeroing out saturation or maxing out lightness.
      </p>
      <Heading type="h2">Converting between HSV and RGB</Heading>
      <p>
        While colors can be created using the HSL or HSV color model/space, this
        representation needs to be converted into the RGB color model/space,
        which is what computers understand.
      </p>
      <p>
        There are algorithms available online that provide detail on the formula
        used to perform these conversions as well as functional code that can be
        used.
      </p>
      <p>
        <a
          href="https://gamedev.stackexchange.com/a/59808"
          target="_blank"
          rel="noopener noreferrer"
        >
          Here is a Stack Exchange answer
        </a>{" "}
        that provides GLSL implementations of functions that can convert RGB
        color to HSV and back again.{" "}
        <a
          href="https://www.rapidtables.com/convert/color/rgb-to-hsv.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          This page
        </a>{" "}
        and{" "}
        <a
          href="https://www.rapidtables.com/convert/color/hsv-to-rgb.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          this page
        </a>{" "}
        show the formula that is used to convert from RGB to HSV and HSV to RGB
        respectively.
      </p>
      <p>
        HSV can be used over HSL as it is generally simpler to understand and
        use for most people.
      </p>
      <Heading type="h2">Additional Notes</Heading>
      <p>
        In future chapters, we will primarily work with RGB(A) colors and
        textures, but this knowledge is available if you wish to work in HSV
        color-space if it simplifies dealing with color.
      </p>
      <p>
        Many color pickers and wheels generally provide a HSV-type interface,
        but also allow exporting results into RGB. This should alleviate the
        requirement for remembering the conversion.
      </p>
      <p>
        The information about the variety of color spaces in use can still be
        useful in certain cases, such as when you wish to provide to modify
        colors to users, since color models such as HSV and HSL are more
        intuitive, as discussed.
      </p>
      <Heading type="h2">Summary</Heading>
      <ul>
        <li>
          Computers represent colors using numbers. Colors are represented using
          red, green, and blue channels (optionally with an alpha channel).
        </li>
        <li>
          Each channel is generally represented using an 8-bit number, meaning
          the color of a pixel is represented using 24-bits, or 32-bits
          (including the alpha channel).
        </li>
        <li>
          Although numbers are generally represented using integer numbers, in
          shaders they are represented using floating point numbers. The
          conversion from floating point to integer is done by the GPU.
        </li>
        <li>
          Colors are represented using RGB because it is a form of how humans
          see color, and is also easy for computers to understand.
        </li>
        <li>
          However, RGB colors aren't intuitive for humans to work with. Due to
          this, other alternate representations are used - primarily HSV and
          HSL.
        </li>
        <li>
          When working with colors in the HSV or HSL color-space, they need to
          be converted to RGB so that computers can actually display them.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/basics/vertex-shader/"
      next="/basics/fragment-shader/"
    />
  </Layout>
);

export default ColorPage;
