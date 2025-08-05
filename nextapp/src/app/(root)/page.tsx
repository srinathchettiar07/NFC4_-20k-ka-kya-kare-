"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Verified, Building, TrendingUp, Eye, Shield, Clock, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const properties = [
  {
    id: 1,
    title: "Modern Downtown Penthouse",
    location: "Manhattan, NY",
    price: "2.5 ETH",
    usdPrice: "$4,250,000",
    image: "/modern-penthouse-interior.png",
    verified: true,
    tokenId: "#7834",
    lastSale: "2.1 ETH",
    owner: "0x742d...35Bd",
    type: "Residential",
    sqft: "2,400",
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2020,
    views: 1247,
  },
  {
    id: 2,
    title: "Luxury Beachfront Villa",
    location: "Malibu, CA",
    price: "5.8 ETH",
    usdPrice: "$9,860,000",
    image: "/luxury-beachfront-villa.png",
    verified: true,
    tokenId: "#9421",
    lastSale: "5.2 ETH",
    owner: "0x8f3a...92Cd",
    type: "Residential",
    sqft: "4,800",
    bedrooms: 5,
    bathrooms: 4,
    yearBuilt: 2018,
    views: 2156,
  },
  {
    id: 3,
    title: "Commercial Office Complex",
    location: "Austin, TX",
    price: "12.3 ETH",
    usdPrice: "$20,910,000",
    image: "/modern-office-building.png",
    verified: true,
    tokenId: "#5672",
    lastSale: "11.8 ETH",
    owner: "0x1b4c...78Ef",
    type: "Commercial",
    sqft: "15,000",
    bedrooms: 0,
    bathrooms: 8,
    yearBuilt: 2019,
    views: 892,
  },
  {
    id: 4,
    title: "Historic Brownstone",
    location: "Boston, MA",
    price: "1.8 ETH",
    usdPrice: "$3,060,000",
    image: "/historic-brownstone.png",
    verified: true,
    tokenId: "#3456",
    lastSale: "1.6 ETH",
    owner: "0x9e2f...45Gh",
    type: "Residential",
    sqft: "3,200",
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 1895,
    views: 743,
  },
  {
    id: 5,
    title: "Industrial Warehouse",
    location: "Detroit, MI",
    price: "0.9 ETH",
    usdPrice: "$1,530,000",
    image: "/industrial-warehouse.png",
    verified: true,
    tokenId: "#8901",
    lastSale: "0.8 ETH",
    owner: "0x6d7a...23Hi",
    type: "Industrial",
    sqft: "25,000",
    bedrooms: 0,
    bathrooms: 2,
    yearBuilt: 1985,
    views: 456,
  },
  {
    id: 6,
    title: "Mountain Retreat Cabin",
    location: "Aspen, CO",
    price: "3.2 ETH",
    usdPrice: "$5,440,000",
    image: "/luxury-mountain-cabin.png",
    verified: true,
    tokenId: "#2134",
    lastSale: "2.9 ETH",
    owner: "0x4a8b...67Jk",
    type: "Residential",
    sqft: "3,600",
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 2021,
    views: 1834,
  },
]

const marketData = [
  { period: "24h", volume: "$2.4M", change: "+12.5%" },
  { period: "7d", volume: "$18.7M", change: "+8.2%" },
  { period: "30d", volume: "$89.3M", change: "+15.7%" },
]

const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
}: { children: React.ReactNode; delay?: number; duration?: number }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current) {
      gsap.to(elementRef.current, {
        y: -20,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: delay,
      })
    }
  }, [delay, duration])

  return (
    <div ref={elementRef} className="will-change-transform">
      {children}
    </div>
  )
}

const AnimatedCounter = ({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
}: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const counter = { value: 0 }
    gsap.to(counter, {
      value: end,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.floor(counter.value))
      },
    })
  }, [end, duration])

  return (
    <span ref={countRef}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function RealEstateChain() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [ethPrice, setEthPrice] = useState(3420.5)

  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ethBoxRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate ETH price changes
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 50
      setEthPrice((prev) => Math.max(3000, prev + change))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero background animation
      gsap.set(heroRef.current, { opacity: 0 })
      gsap.to(heroRef.current, { opacity: 1, duration: 1 })

      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.3 },
        )
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.8 },
        )
      }

      // Buttons animation
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 1.2 },
        )
      }

      // Features animation
      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.children,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 1.5 },
        )
      }

      // ETH box animation
      if (ethBoxRef.current) {
        gsap.fromTo(
          ethBoxRef.current,
          { x: 100, opacity: 0, rotateY: 15 },
          { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: "power3.out", delay: 0.5 },
        )
      }

      // Floating elements
      if (floatingElementsRef.current) {
        const elements = floatingElementsRef.current.children
        Array.from(elements).forEach((element, index) => {
          gsap.fromTo(
            element,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 0.1, duration: 1, delay: 2 + index * 0.2, ease: "power2.out" },
          )
        })
      }

      // Scroll-triggered animations
      gsap.fromTo(
        ".property-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".properties-section",
            start: "top 80%",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || property.type.toLowerCase() === selectedType.toLowerCase()
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RealEstateChain</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Properties
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Portfolio
              </a>
            </nav>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with Animations */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-10"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-indigo-200 rounded-full opacity-10"></div>
          <div className="absolute bottom-20 right-40 w-28 h-28 bg-blue-300 rounded-full opacity-10"></div>
          <div className="absolute top-60 left-1/3 w-20 h-20 bg-purple-300 rounded-full opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center min-h-[80vh]">
            {/* Hero Content - Left Side */}
            <div className="lg:col-span-2 relative z-10">
              <div className="space-y-8">
                <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                  <span className="block">Revolutionizing</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Real Estate
                  </span>
                  <span className="block">with Blockchain</span>
                </h1>

                <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl">
                  Transform property transactions through decentralized systems, smart contracts, and immutable ledgers.
                  Experience secure, transparent, and efficient real estate ownership with AI-powered validation.
                </p>

                <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Explore Properties
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Learn Blockchain Real Estate
                  </Button>
                </div>

                {/* Animated Key Features */}
                <div ref={featuresRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                  <FloatingElement delay={0}>
                    <div className="text-center group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Fraud Prevention</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <AnimatedCounter end={99} suffix="%" /> Success Rate
                      </p>
                    </div>
                  </FloatingElement>

                  <FloatingElement delay={0.2}>
                    <div className="text-center group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Instant Settlement</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <AnimatedCounter end={24} suffix="/7" /> Availability
                      </p>
                    </div>
                  </FloatingElement>

                  <FloatingElement delay={0.4}>
                    <div className="text-center group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Lower Costs</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <AnimatedCounter end={80} suffix="%" /> Reduction
                      </p>
                    </div>
                  </FloatingElement>

                  <FloatingElement delay={0.6}>
                    <div className="text-center group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Full Transparency</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <AnimatedCounter end={100} suffix="%" /> Visibility
                      </p>
                    </div>
                  </FloatingElement>
                </div>
              </div>
            </div>

            {/* Enhanced ETH Price Box - Right Side */}
            <div ref={ethBoxRef} className="lg:col-span-1 relative z-10">
              <div className="space-y-6">
                <FloatingElement duration={4}>
                  <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md transform hover:scale-105 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
                          <span className="text-white font-bold text-lg">Ξ</span>
                        </div>
                        Ethereum Price
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="text-4xl font-bold text-gray-900">
                          $<AnimatedCounter end={ethPrice} />
                        </div>
                        <div className="text-sm text-green-600 font-medium flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +2.4% (24h)
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">24h High</span>
                          <span className="font-medium text-gray-900">$3,485.20</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">24h Low</span>
                          <span className="font-medium text-gray-900">$3,380.15</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Market Cap</span>
                          <span className="font-medium text-gray-900">$411.2B</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Property Transaction Volume (24h)</p>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={847} suffix=".3 ETH" />
                        </div>
                        <div className="text-xs text-gray-600">≈ $2.9M USD</div>
                      </div>
                    </CardContent>
                  </Card>
                </FloatingElement>

                {/* Enhanced AI Validation Status */}
                <FloatingElement delay={1} duration={5}>
                  <Card className="border-0 shadow-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-bold">AI Validation System</p>
                          <p className="text-green-100 text-sm">Automated fraud detection active</p>
                        </div>
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg"></div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-100">Transactions Validated Today</span>
                          <span className="font-bold">
                            <AnimatedCounter end={1247} />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-100">Success Rate</span>
                          <span className="font-bold">
                            <AnimatedCounter end={99} suffix=".9%" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FloatingElement>

                {/* Live Activity Feed */}
                <FloatingElement delay={1.5} duration={6}>
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-gray-900 flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        Live Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                          <span className="text-blue-700">Property #7834 sold</span>
                          <span className="text-blue-600 font-medium">2.5 ETH</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="text-green-700">New listing verified</span>
                          <span className="text-green-600 font-medium">AI ✓</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                          <span className="text-purple-700">Smart contract executed</span>
                          <span className="text-purple-600 font-medium">Auto</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FloatingElement>
              </div>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-8 border-b border-gray-200 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by location or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-2">0-2 ETH</SelectItem>
                  <SelectItem value="2-5">2-5 ETH</SelectItem>
                  <SelectItem value="5+">5+ ETH</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 properties-section">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tokenized Real Estate Properties</h2>
              <p className="text-gray-600">Secure, transparent property ownership through blockchain technology</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{filteredProperties.length} verified properties</p>
              <p className="text-xs text-green-600">✓ AI-validated transactions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <Card
                key={property.id}
                className="property-card border-gray-200 hover:shadow-xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {property.verified && (
                    <Badge className="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-white animate-pulse">
                      <Verified className="w-3 h-3 mr-1" />
                      AI Verified
                    </Badge>
                  )}
                  <Badge className="absolute top-3 left-3 bg-white/95 text-gray-700 hover:bg-white">
                    {property.tokenId}
                  </Badge>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {property.views}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded text-xs">
                    Smart Contract Active
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>
                    <Badge variant="outline" className="border-gray-300 text-gray-700 text-xs">
                      {property.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {property.price}
                        </div>
                        <div className="text-sm text-gray-500">{property.usdPrice}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Last Sale</div>
                        <div className="text-sm font-medium text-gray-900">{property.lastSale}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg">
                      <div className="text-center">
                        <span className="font-medium text-gray-900 block">{property.sqft}</span>
                        <div className="text-xs">Sq Ft</div>
                      </div>
                      {property.bedrooms > 0 && (
                        <div className="text-center">
                          <span className="font-medium text-gray-900 block">{property.bedrooms}</span>
                          <div className="text-xs">Beds</div>
                        </div>
                      )}
                      <div className="text-center">
                        <span className="font-medium text-gray-900 block">{property.bathrooms}</span>
                        <div className="text-xs">Baths</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-blue-700">Ownership Transfer</span>
                        <span className="text-blue-600 font-medium">Automated</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-green-700">Fraud Protection</span>
                        <span className="text-green-600 font-medium">AI Validated</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>Owner: {property.owner}</span>
                      <span>Built: {property.yearBuilt}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300">
                        View Smart Contract
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent transform hover:scale-105 transition-all duration-300"
                      >
                        Compare
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">RealEstateChain</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
