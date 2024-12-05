"use client"
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('@/app/_components/home'), { ssr: false })

export default function Home() {
  return (<DynamicComponentWithNoSSR / >);
}
