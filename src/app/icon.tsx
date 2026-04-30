import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9c349',
          color: '#1a1a1a',
          fontSize: 34,
          fontWeight: 800,
          fontFamily: 'sans-serif',
          fontStyle: 'italic',
          letterSpacing: '-1px',
          borderRadius: '12px',
        }}
      >
        JL
      </div>
    ),
    { ...size }
  )
}
