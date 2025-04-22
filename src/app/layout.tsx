import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <html cz-shortcut-listen="true"><body>{children}</body></html>
  )
}
