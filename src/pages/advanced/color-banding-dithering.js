import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import DitheringExample from "../../components/advanced/color-banding-dithering/dithering-example"
import BandingExample from "../../components/advanced/color-banding-dithering/banding-example"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import { Link } from "gatsby"
import { bandingFragmentShaderSource } from "../../components/advanced/color-banding-dithering/banding-example-shaders"
import { ditheringFragmentShaderSource } from "../../components/advanced/color-banding-dithering/dithering-example-shaders"
import banding from "../../images/advanced/banded.png"
import bandingExaggerated from "../../images/advanced/banded-exaggerated.png"
import noised from "../../images/advanced/noised.png"
import noisedExaggerated from "../../images/advanced/noised-exaggerated.png"
import actualGradient from "../../images/advanced/actual-gradient.png"
import bandedGradient from "../../images/advanced/banded-gradient.png"
import PageChange from "../../components/page-change"

const ColorBandingDitheringPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Advanced - Color Banding and Dithering"
      description="A look into what color banding is and how to mitigate it using dithering."
      keywords={["shader", "advanced", "banding", "dithering"]}
    />
    <Content>
      <h2>Shader Advanced - Color Banding and Dithering</h2>
      <p>
        An issue that can occur when drawing gradients is something called color
        banding. Let us look at a flat grayscale gradient going from black to
        white.
      </p>
      <h4>Example - Color Banded Gradient</h4>
      <BandingExample />
      <GlslCodeHighlight code={bandingFragmentShaderSource} type="Fragment" />
      <p>
        The issue may not be very obvious at first, so here's a screenshot of a
        portion of the image.
      </p>
      <p className="util text-center">
        <img src={banding} alt="Color Banding Screenshot Normal" />
      </p>
      <p>We can modify the light levels to make the issue more obvious.</p>
      <p className="util text-center">
        <img
          src={bandingExaggerated}
          alt="Color Banding Screenshot Exaggerated"
        />
      </p>
      <p>
        It appears that the image has bands of colors going across it. This
        shouldn't occur since the decrease of light from the bottom to the top
        should be gradual and smooth.
      </p>
      <p>
        This issue is called color banding, and it is a problem because it makes
        a gradient of colors appear to be "chunky" rather than smooth, which is
        generally an undesirable effect.
      </p>
      <p>
        We've previously discussed in the{" "}
        <Link to="/advanced/color-2/">color part 2 chapter</Link> that computers
        are limited in what colors they have the ability to represent and show.
      </p>
      <p>
        This issue occurs mainly because the colors that are required to show
        the colors transitioning smoothly just do not exist among the range of
        colors that can form an image and a monitor can show.
      </p>
      <p>
        This means that if a computer wished to show a gradient of colors, there
        will be bands of colors forming instead of a smooth transition, since a
        computer cannot show the colors in between the two bands.
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
        Now, suppose the computer had to render a gradient of colors, going from
        white to black, as shown in the image above. Since the computer can only
        show black and white, all the shades of gray in between cannot be
        displayed by the computer.
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
        limitations of the detail that can be shown by the computer and screen.
      </p>
      <p>
        Below is an example showing how introducing noise can improve the detail
        of an image:
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
        introduction of noise into the image, shades of gray can be seen within
        the image, although there is no actual gray present.
      </p>
      <p>
        This is due to how colors interact with each other and affect how they
        appear to us, as discussed in the{" "}
        <Link to="/advanced/color-2/">color part 2 chapter</Link>. This
        interactions blends the noise of the colors together to appear as one
        smooth band.
      </p>
      <p>
        The noise does introduce a grainy effect, but the added detail in color
        is a high benefit, and in multiple cases this added detail offsets the
        issue of grain in the image.
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
        Since the colors forming the bands are already pretty close in the color
        spectrum, the grainy effect introduced by dithering should be very hard
        to spot, making it ideal to fix the banding issue.
      </p>
      <h4>Example - Dithered Gradient</h4>
      <DitheringExample />
      <p>Below is a zoomed in part of the new dithered image.</p>
      <p className="util text-center">
        <img src={noised} alt="Dithering Screenshot Normal" />
      </p>
      <p>We can modify the light levels to see the introduced noise.</p>
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
        The noise is only visible when modifying the light levels, but since the
        randomness spreads the colors of the bands, they easily blend together
        and look smooth to your eyes.
      </p>
      <GlslCodeHighlight code={ditheringFragmentShaderSource} type="Fragment" />
      <p>
        A random number is generated for the fragment which needs to be noised.
        The granularity for the noise (stored in the constant{" "}
        <code>NOISE_GRANULARITY</code>) is set to a very small number (
        <code>0.5/255.0</code>) to ensure that any shift in color due to the
        noise would be minimal.
      </p>
      <p>
        A random value was linearly interpolated using the GLSL function{" "}
        <code>mix</code> within this noise granularity range using the generated
        random number for the fragment and added to the fragment color,
        resulting in the color of the fragment being slightly modified.
      </p>
      <p>
        Since the shift in color is random for every fragment, it results in in
        unordered/random dithering due to the randomness of the generated noise.
      </p>
      <p>
        This process removes the appearence of color banding, as seen in the
        dithering screenshots, and allows for color gradients to appear much
        smoother than they really are.
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Color banding is an issue that can occur when the computer cannot
          simulate a transition between two colors since it cannot represent the
          intermediate colors between the two.
        </li>
        <li>
          Dithering is a process of adding noise to an image to remove color
          pattern issues such as color banding. Dithering is of two types -
          ordered dithering, and unordered dithering.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/advanced/branching/"
      next="/advanced/transparency/"
    />
  </Layout>
)

export default ColorBandingDitheringPage
