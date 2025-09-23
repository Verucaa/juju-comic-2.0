import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SearchComic = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await axios.get(`https://www.sankavollerei.com/comic/search?q=${encodeURIComponent(searchQuery)}`)
            console.log("Search results:", response.data)
            
            // Process the search results similar to CardNewComic
            const processedResults = response.data.data.map(comic => {
                const slug = comic.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')

                return {
                    ...comic,
                    processedLink: comic.href,
                    slug: slug
                }
            })

            setSearchResults(processedResults)
        } catch (err) {
            setError('Terjadi kesalahan saat mencari komik')
            console.error("Search error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleComicDetail = (comic) => {
        // Format processedLink dengan benar
        const processedLink = comic.href.replace('/detail-komik/', '')
        
        navigate(`/detail-comic/${comic.slug}`, {
            state: {
                comic: {
                    title: comic.title,
                    image: comic.thumbnail,
                    chapter: comic.description || 'Chapter Terbaru',
                    source: comic.type,
                    link: comic.href, // Tambahkan link original
                    popularity: comic.genre || '-' // Gunakan genre sebagai popularity jika ada
                },
                processedLink: processedLink
            }
        })
    }

    return (
           <div className="w-full max-w-4xl mx-auto px-4 mb-8">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari komik..."
                    className="flex-1 p-2 bg-[#1E1E1E] border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600 transition"
                    disabled={loading}
                >
                    {loading ? 'Mencari...' : 'Cari'}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <div className="text-red-400 text-center mb-4">
                    {error}
                </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((comic) => (
                        <div
                            key={comic.title}
                            className="bg-[#1E1E1E] shadow-2xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                        >
                            <div className="relative">
                                <img
                                    src={comic.thumbnail}
                                    alt={comic.title}
                                    className="w-full h-64 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x450?text=Comic+Cover'
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded">
                                    {comic.type}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg truncate mb-2 text-gray-100">{comic.title}</h3>
                                <p className="text-sm text-gray-400 mb-2">{comic.genre}</p>
                                <button
                                    onClick={() => handleComicDetail(comic)}
                                    className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-600 transition"
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchComic