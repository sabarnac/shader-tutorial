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
        So far, all images generated were of objects or shapes that were passed
        to the GPU. Another way to generate images is to just draw over the
        entire screen, and apply some logic to determine which fragment gets
        colored in what way.
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
      <h3>Pattern Example - A tiled coordinate gradient</h3>
      <RandomImageGenerationSecondExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={secondFragmentShaderSource.trim()}
        type="Fragment"
      />
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
    <PageChange previous="/intermediates/lighting-dithering/" />
  </Layout>
)

export default ImageGenerationPage
