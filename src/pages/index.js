import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import WpmGame from "../components/wpm-game"

const IndexPage = () => (
  <Layout>
    <SEO title="Practice typing to lyrics of popular songs" />
    <WpmGame />
  </Layout>
)

export default IndexPage
