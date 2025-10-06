import React from 'react'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import BrandBanner from '../components/BrandBanner'
import Footer from '../components/Footer'
import BrandsProduct from '../components/BrandProduct'
import BrandsSection from '../components/BrandProduct'

export default function Home() {
  return (
    <div className="p-6">
       <Reveal>
         <BrandBanner />
       </Reveal>
       <Reveal className="mt-8">
         <BrandsProduct/>
       </Reveal>
       <Reveal className="mt-8">
         <ProductCard />
       </Reveal>
       <Reveal className="mt-8">
         <Footer />
       </Reveal>
      </div>
   
  )
}
