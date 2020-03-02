module.exports = {
  siteMetadata: {
    title: `GPU Shader Tutorial`,
    baseUrl: `https://shader-tutorial.dev`,
    siteUrl: `https://shader-tutorial.dev`,
    description: `Learn about GPU shaders in a simple, relatively easy-to-digest format.`,
  },
  pathPrefix: "/",
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GPU Shader Tutorial`,
        short_name: `Shader Tutorial`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `standalone`,
        icon: `src/images/icon.png`,
      },
    },
    "gatsby-plugin-offline",
    // "gatsby-plugin-remove-serviceworker",
  ],
}
