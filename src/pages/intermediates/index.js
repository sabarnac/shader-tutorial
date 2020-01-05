import { Link } from "gatsby";
import React from "react";

import Content from "../../components/content";
import Layout from "../../components/layout";
import SEO from "../../components/seo";

const IntermediatesIndexPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Content"
      description="Table of Contents for the Shader Intermediates section."
      keywords={["shader", "intermediates", "content", "toc"]}
    />
    <Content>
      <h2>Table of Contents</h2>
      <ul className="toc">
        <li>
          <Link to="/intermediates/color-2/">
            Shader Intermediates - Color Part 2
          </Link>
        </li>
        <li>
          <Link to="/intermediates/image-generation/">
            Shader Intermediates - Image Generation
          </Link>
        </li>
        <li>
          <Link to="/intermediates/mapping/">
            Shader Intermediates - Mapping
          </Link>
        </li>
        <li>
          <Link to="/intermediates/color-mapping/">
            Shader Intermediates - Color Mapping
          </Link>
        </li>
        <li>
          <Link to="/intermediates/lighting/">
            Shader Intermediates - Lighting
          </Link>
        </li>
        <li>
          <Link to="/intermediates/normal-mapping/">
            Shader Intermediates - Normal Mapping
          </Link>
        </li>
        <li>
          <Link to="/intermediates/specular-mapping/">
            Shader Intermediates - Specular Mapping
          </Link>
        </li>
        <li>More Coming Soon...</li>
      </ul>
    </Content>
  </Layout>
)

export default IntermediatesIndexPage
