import React from "react";

import Content from "../../components/content";
import Layout from "../../components/layout";
import PageChange from "../../components/page-change";
import SEO from "../../components/seo";
import interaction1 from "../../images/intermediates/interaction-1.png";
import interaction2 from "../../images/intermediates/interaction-2.png";

const ColorPt2Page = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Basics - Color Part 2"
      description="A look into how color interaction works and affects what we see."
      keywords={[
        "color",
        "part",
        "2",
        "two",
        "interaction",
        "limitation",
        "shader",
        "intermediate",
      ]}
    />
    <Content>
      <h2>Shader Intermediates - Color Part 2</h2>
      <p>
        While colors can seem simple to work with, there are subtleties involved
        that can affect the outcome of how colors are seen by people. These can
        be caused due to the limitations of how colors are represented by
        computers, or due to how colors interact with each other, affecting the
        way they appear to us.
      </p>
      <p>Let's look at certain issues and subtleties of color.</p>
      <h3>Limited number of digital colors</h3>
      <p>
        The primary limitation with digital color is that only a limited number
        of colors can be represented by computers. This is due to the fact that
        colors are represented using numbers that are within a certain range.
      </p>
      <p>
        Each color component (RGB) is stored as an 8-bit value, which means that
        each component can have at most 256 possible values. This may not seem
        like much, but when all components are combined, this allows for
        16,777,216 (256 × 256 × 256) possible colors.
      </p>
      <p>
        However, even with these many colors, there are some colors that just
        can't be stored and represented by computers and displays.
      </p>
      <p>
        If you take two colors from the band, there will always be a color
        present between the two selected colors, no matter how close they are.
        As a result, there are an infinite number of colors present within the
        visible spectrum of light.
      </p>
      <p>
        These means if we have take consecutive colors in a computer, there is a
        color between them that cannot be represented and shown, resulting in
        potential loss of detail.
      </p>
      <p>
        Of course, humans are not able to differentiate between all of these
        colors, since we are limited by the sensitivity of the cones in our
        eyes.
      </p>
      <p>
        This allows computers to not require having the ability to represent
        every color, but computers cannot represent all the colors that the
        human eye can see using just 8-bits per channel.
      </p>
      <p>
        This is the reason why the HDR (high dynamic range) color space was
        created. The increase in the range of values that can be represented
        allows for more colors to be shown by computers.
      </p>
      <p>
        Another benefit is that the increase in color space allows for more
        detail to be shown, since previously certain colors within an image
        could not be shown because there was no value for it.
      </p>
      <p>
        The effects of this limitation of digital color will be discussed in a
        later chapter through an example.
      </p>
      <h3>Interaction of color</h3>
      <p>
        Colors are not seen as absolutes by us, but in relation to other colors
        surrounding it. How a color is seen depends not on just the value of
        that color, but also the values of the colors surrounding it, and how
        they interact with each other.
      </p>
      <p>To understand this, let's look an example image.</p>
      <p className="util text-center">
        <img src={interaction1} alt="Color Interaction Greyscale Example" />
      </p>
      <p>
        In this image we see a background of a white to black linear gradient
        starting from the top of the image and going down to the bottom. At the
        center is a gray tile gradient that is slightly dark at the top and
        slightly light at the bottom.
      </p>
      <p>
        Actually, the last statement isn't accurate. At first glance, the inner
        tile may look like a gradient, however, it is a tile of a constant gray
        color.
      </p>
      <p>
        If you wish to confirm, save the image on your desktop and use a color
        picker to compare the above and below colors of the tile.
      </p>
      <p>
        The reason the tile appears as a gradient is due to the background of
        the image. The light color of the background at the top and the darkness
        of the background at the bottom influence how our eyes sees the color of
        the tile at those areas.
      </p>
      <p>
        This interaction makes the tile at the bottom appear brighter due to the
        relative darkness of the background, and the tile at the top look darker
        due to the relative brightness of the background at the top.
      </p>
      <p>
        This example is with grayscale images, but the same issue applies with
        color images, although it may not be as "strong". Here is an example
        image showing an example in color:
      </p>
      <p className="util text-center">
        <img src={interaction2} alt="Color Interaction Color Example" />
      </p>
      <p>
        In the above image, the tiles inside the bottom and top half are the
        same color, but the tile at the bottom may appear to be slightly
        brighter due to the background being darker.
      </p>
      <p>
        This interaction between colors affecting each other can be an issue,
        but also can be exploited for certain benefits. An example of this will
        be shown in a later chapter through an example.
      </p>
      <h3>Colors seen by digital devices</h3>
      <p>
        Another thing that may not be known is how color is actually seen by
        digital devices such as cameras, versus how humans see and interpret
        color.
      </p>
      <p>
        The YouTube channel{" "}
        <a
          href="https://www.youtube.com/channel/UCUHW94eEFW7hkUMVaZz4eDg"
          target="_blank"
          rel="noopener noreferrer"
        >
          minutephysics
        </a>{" "}
        has a{" "}
        <a
          href="https://youtu.be/LKnqECcg6Gw"
          target="_blank"
          rel="noopener noreferrer"
        >
          video
        </a>{" "}
        providing a great explanation about this, and also how it can be
        overcome in software. This is useful to know when performing image
        manipulation.
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Computers are limited in the range of colors they can represent and
          show because there are only a limited set of numbers that can be set
          for colors.
        </li>
        <li>
          Colors interact with each other in ways that affect how colors can
          actually appear, making things appear brighter, darker, or of a
          different shade than they really are.
        </li>
        <li>
          Digital devices see and record color differently than how humans see
          color. This results in artifacts or errors when performing color and
          image manipulation, which can be solved by accounting for these
          differences.
        </li>
      </ul>
    </Content>
    <PageChange next="/intermediates/image-generation/" />
  </Layout>
)

export default ColorPt2Page
