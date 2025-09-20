import React from 'react'

const logo = () => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 520 120"
    width={150}
    height={(150 / 520) * 120}
    role="img"
    aria-label="MegaBasket logo"
  >
    <title>MegaBasket</title>
    <desc>
      Logo: stylized shopping basket icon with "Mega" in dark and "Basket" in
      primary color.
    </desc>

    {/* ICON (left) */}
    <g transform="translate(12,10)">
      {/* soft basket fill */}
      <rect
        x="8"
        y="44"
        rx="10"
        ry="10"
        width="84"
        height="48"
        fill="#0ea5e9"
        opacity="0.12"
      />
      {/* basket outline */}
      <path
        d="M18 92h64c6 0 10-4 10-10V58c0-6-4-10-10-10H18c-6 0-10 4-10 10v24c0 6 4 10 10 10z"
        stroke="#0ea5e9"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* handle shaped like abstract 'M' */}
      <path
        d="M14 52l22-28m52 28L66 24"
        stroke="#0ea5e9"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* decorative inner 'M' */}
      <path
        d="M30 76l10-16 10 16 10-16 10 16"
        stroke="#0ea5e9"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* WORDMARK (right) */}
    <g transform="translate(120,84)">
      <text
        x="0"
        y="0"
        fontSize="56"
        fontWeight="700"
        fill="#0ea5e9"
        fontFamily="Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      >
        Mega
      </text>
      <text
        x="178"
        y="0"
        fontSize="56"
        fontWeight="700"
        fill="#0ea5e9"
        fontFamily="Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      >
        Basket
      </text>
    </g>
  </svg>
  )
}

export default logo