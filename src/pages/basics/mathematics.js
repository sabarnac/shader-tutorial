import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const MathematicsPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Basics - A Primer On Needed Mathematics"
      description="A look into the mathematics that is required and extremely useful for shading."
      keywords={["shader", "basics", "gpu", "mathematics", "maths"]}
    />
    <Content>
      <h2>Shader Basics - A Primer On Necessary Mathematics</h2>
      <p>
        A lot of the functionality of shaders is dependent on mathematical
        functions and calculations. Knowing what mathematical functions are
        useful for various operations is useful for creating visual effects.
      </p>
    </Content>
    <PageChange
      previous="/basics/render-pipeline/"
      next="/basics/vertex-shader/"
    />
  </Layout>
)

export default MathematicsPage
