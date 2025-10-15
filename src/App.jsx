import React from 'react'
import RootLayout from './routes/RootLayout'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <>
    <Toaster
  position="top-right"
  reverseOrder={false}
/>
    <RootLayout/>
    </>
  )
}
