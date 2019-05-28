import { Link } from "gatsby"
import React from "react"

const Navigation = () => (
  <nav>
    <ul>
      <li className="skip-nav">
        <a href="#main">
          <small>Skip Navigation</small>
        </a>
      </li>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <hr />
      </li>
      <li>
        <Link to="/basics/">Basics</Link>
        <ul>
          <li>
            <Link to="/basics/introduction/">Introduction</Link>
          </li>
          <li>
            <Link to="/basics/render-pipeline/">Render Pipeline</Link>
          </li>
          <li>
            <Link to="/basics/mathematics/">Mathematics</Link>
          </li>
          <li>
            <Link to="/basics/vertex-shader/">Vertex Shader</Link>
          </li>
          <li>
            <Link to="/basics/color/">Color</Link>
          </li>
          <li>
            <Link to="/basics/fragment-shader/">Fragment Shader</Link>
          </li>
        </ul>
      </li>
      <li>
        <hr />
      </li>
      <li>
        <Link to="/intermediates/">Intermediates</Link>
        <ul>
          <li>
            <Link to="/intermediates/color-2/">Color Part 2</Link>
          </li>
          <li>
            <Link to="/intermediates/image-generation/">Image Generation</Link>
          </li>
          <li>
            <Link to="/intermediates/mapping/">Mapping</Link>
          </li>
          <li>
            <Link to="/intermediates/color-mapping/">Color Mapping</Link>
          </li>
          <li>
            <Link to="/intermediates/lighting/">Lighting</Link>
          </li>
          <li>More Coming Soon...</li>
        </ul>
      </li>
      <li>
        <hr />
      </li>
      <li>
        <Link to="/advanced/">Advanced</Link>
        <ul>
          <li>
            <Link to="/advanced/branching/">Branching</Link>
          </li>
          <li>
            <Link to="/advanced/color-banding-dithering/">
              Color Banding and Dithering
            </Link>
          </li>
          <li>
            <Link to="/advanced/transparency/">Transparency</Link>
          </li>
          <li>More Coming Soon...</li>
        </ul>
      </li>
      <li>
        <hr />
      </li>
      <li>
        <Link to="/faq/">FAQ</Link>
      </li>
    </ul>
  </nav>
)

export default Navigation
