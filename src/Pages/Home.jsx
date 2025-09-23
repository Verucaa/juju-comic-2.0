import React from 'react'
import CardNewComic from '../components/Home/CardNewComic'
import SearchComic from '../components/Home/SearchComic'

const Home = () => {
  return (
    <div className="bg-[#121212] min-h-screen text-gray-100 py-8">
      <SearchComic />
      <CardNewComic />
    </div>
  )
}

export default Home
