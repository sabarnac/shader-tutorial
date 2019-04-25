import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import example1 from "!raw-loader!../../components/advanced/branching/example-1.glsl"
import example2 from "!raw-loader!../../components/advanced/branching/example-2.glsl"

const BranchingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Advanced - Branching"
      description="A look into performing branch operations in shaders."
      keywords={["branching", "branch", "shader", "advanced"]}
    />
    <Content>
      <h2>Shader Advanced - Branching</h2>
      <p>
        A question that might have come up often in past chapters is why simple
        conditional logic not used to execute different bits of code, instead of
        relying on transforming the conditional logic into mathematical logic.
      </p>
      <h5>
        <strong>Examples:</strong>
      </h5>
      <hr />
      <GlslCodeHighlight showHeader={false} type={""} code={example1} />
      <hr />
      <GlslCodeHighlight showHeader={false} type={""} code={example2} />
      <hr />
      <p>
        The reasons for this is when a GPU hits a branch, the common behavior of
        GPUs is to run the code for all resulting possibility, and then discard
        the results of the possibilities that wasn't the determined outcome.
      </p>
      <p>
        Since the GPU relies on many parallel calculations being executable at
        once, having branches forces the GPU to waste time running multiple
        possible operations for the same vertex/fragment, instead of using those
        resources performing calculations for other vertices/fragments.
      </p>
      <p>
        This means that if there is a significant amount of code that is only
        run based upon a condition, then a lot of time is wasted by the GPU
        executing a lot of code that may not be required.
      </p>
      <p>
        However, using branches is not always discouraged. Some examples are:
      </p>
      <ul>
        <li>
          If you're branching based on the value of a uniform, since such a
          branch will always have the same result irrespective of which vertex
          or fragment you're operating on, this shouldn't lead to a performance
          bottleneck.
        </li>
        <li>
          Similar to the last point, if you're branches are consistent (always
          have the same outcome), there shouldn't be a performance bottleneck.
        </li>
        <li>
          Branches that are used to set the value for a variable (ex:{" "}
          <code>variable = condition ? value1 : value2</code>) can be performed
          efficiently by GPUs.
        </li>
        <li>
          If you're branches are consistent over a group of pixels (ex: 8x8
          group), there should not be a major performance penalty
          <strong>*</strong>.
        </li>
        <li>
          For certain other cases of branching, they may be optimized to not
          have a big impact on performance<strong>*</strong>.
        </li>
      </ul>
      <p>
        <strong>
          * - This is GPU and driver dependent, so such code would require
          extensive testing to verify.
        </strong>
      </p>
      <p style={{ paddingLeft: "5rem" }}>
        <em>
          Note: Certain GLSL functions used so far (ex: <code>clamp</code>)don't
          have a performance impact although they are expected to cause
          branching.
        </em>
      </p>
      <p style={{ paddingLeft: "5rem" }}>
        <em>
          This is because either OpenGL optimizes such functions, or the GPU has
          special hardware or driver code optimizations to ensure that such code
          will not have any performance impact.
        </em>
      </p>
      <p style={{ paddingLeft: "5rem" }}>
        <em>
          Some of these functions and operations have been supported by GPUs
          before they supported branching operations (ex: <code>clamp</code>).
        </em>
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Branching is generally discouraged to be performed in shaders and can
          negatively impact performance except for certain scenarios.
        </li>
        <li>
          Test to see if a branch in the code does affect performance, but
          remember that it can be GPU and driver dependent. Preferrably use
          branches only when you have to.
        </li>
      </ul>
    </Content>
    <PageChange next="/advanced/color-banding-dithering/" />
  </Layout>
)

export default BranchingPage
