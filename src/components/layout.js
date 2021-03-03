/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import "./layout.css"
import "@fontsource/pt-mono"

const Layout = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: "#3d405b",
        color: "#f4f1de",
        fontFamily: "PT Mono",
      }}
    >
      {/* <div
        style={{
          paddingTop: "16px",
          paddingLeft: "16px",
          opacity: ".70",
        }}
      >
        <h1 style={{ marginBottom: "7px" }}>
          <span style={{ color: "#f2cc8f" }}>Lyrics Pe</span>
          <span style={{ color: "#e07a5f" }}>r</span> Minute
        </h1>
        <h2 style={{ fontSize: "16px" }}>
          Practice typing to lyrics of popular songs
        </h2>
      </div> */}
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
          height: "100vh",
        }}
      >
        {children}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            display: "flex",
            width: "100%",
            paddingRight: "16px",
            paddingBottom: "16px",
          }}
        >
          <a
            href="https://gage-langdon.com"
            style={{
              marginLeft: "auto",

              color: "white",
              opacity: ".40",
              textDecoration: "none",
            }}
          >
            @gage-langdon
          </a>
        </div>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
