import Header from '../ui/Header'
 
export default function Defaultlayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}