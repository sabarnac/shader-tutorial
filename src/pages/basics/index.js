import { Link } from "gatsby";
import React from "react";

import Content from "../../components/content";
import Layout from "../../components/layout";
import Seo from "../../components/seo";

const BasicsIndexPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Basics - Content"
      description="Table of Contents for the Shader Basics section."
      keywords={["shader", "basics", "content", "toc"]}
    />
    <Content>
      <h1>Table of Contents - Basics</h1>
      <ul className="toc">
        <li>
          <Link to="/basics/introduction/">Shader Basics - Introduction</Link>
        </li>
        <li>
          <Link to="/basics/render-pipeline/">
            Shader Basics - The GPU Render Pipeline
          </Link>
        </li>
        <li>
          <Link to="/basics/mathematics/">
            Shader Basics - A Primer On Necessary Mathematics
          </Link>
        </li>
        <li>
          <Link to="/basics/vertex-shader/">Shader Basics - Vertex Shader</Link>
        </li>
        <li>
          <Link to="/basics/color/">Shader Basics - Color</Link>
        </li>
        <li>
          <Link to="/basics/fragment-shader/">
            Shader Basics - Fragment Shader
          </Link>
        </li>
      </ul>
    </Content>
  </Layout>
);

export default BasicsIndexPage;
