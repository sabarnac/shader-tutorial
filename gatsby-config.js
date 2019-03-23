module.exports = {
  siteMetadata: {
    title: `GPU Shader Tutorial`,
    description: `Learn about GPU shaders in a simple, relatively easy-to-digest format.`,
    author: `@disappointin_af`,
  },
  pathPrefix: "/shader-tutorial",
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GPU Shader Tutorial`,
        short_name: `Shader Tutorial`,
        start_url: `/shader-tutorial/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `standalone`,
        icon: `src/images/icon.png`,
      },
    },
    // "gatsby-plugin-offline",
    "gatsby-plugin-remove-serviceworker",
  ],
}
