import React from "react"

const BtnLink: React.FC<{ onClick: Function; label: string }> = ({
  onClick,
  label,
}) => (
  <button
    type="button"
    style={{
      cursor: "pointer",
      border: "none",
      background: "none",
      color: "inherit",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
    }}
    onClick={onClick}
  >
    {label}
  </button>
)

export default BtnLink
