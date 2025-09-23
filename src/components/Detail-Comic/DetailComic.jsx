import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'

const DetailComic = () => {
    const navigate = useNavigate()
    const { slug } = useParams()
    const location = useLocation()
    const { comic, processedLink } = location.state || {}
    const [comicDetail, setComicDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchComicDetail = async () => {
            try {
                // Pastikan processedLink tidak memiliki slash di awal
                const cleanProcessedLink = processedLink?.startsWith('/') ? processedLink.substring(1) : processedLink
                
                const response = await axios.get(`https://www.sankavollerei.com/comic/comic/${cleanProcessedLink}`)
                console.log("Fetched comic detail:", response.data)

                // Jika tidak ada data, gunakan fallback
                if (!response.data) {
                    throw new Error('Tidak ada data komik yang ditemukan')
                }

                setComicDetail(response.data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching comic detail:", err)
                // Tampilkan pesan error yang lebih informatif
                setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil detail komik')
                setLoading(false)
                
                // Set default comic detail jika diperlukan
                setComicDetail({
                    synopsis: "Synopsis tidak tersedia.",
                    chapters: [],
                    creator: "Unknown"
                })
            }
        }

        if (processedLink) {
            fetchComicDetail()
        } else {
            setError('Link komik tidak valid')
            setLoading(false)
        }
    }, [processedLink])

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <h2>Terjadi Kesalahan</h2>
                <p>{error.message}</p>
            </div>
        )
    }

    // Jika tidak ada komik
    if (!comic) {
        return <div>Komik tidak ditemukan</div>
    }

    // New function to handle reading the comic
    const handleReadComic = () => {
    if (comicDetail?.chapters && comicDetail.chapters.length > 0) {
        const firstChapter = comicDetail.chapters[0]
        
        navigate(`/read-comic/${slug}/chapter-${firstChapter.chapter}`, { 
            state: { 
                chapterLink: firstChapter.link,
                comicTitle: comic.title,
                chapterNumber: firstChapter.chapter,
            } 
        })
    } else {
        alert('No chapters available')
    }
}

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mr-6">
                    <img
                        src={comic.image}
                        alt={comic.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-2/3">
                    <h1 className="text-3xl font-bold mb-4">{comic.title}</h1>

                    <div className="mb-4">
                        <strong>Chapter:</strong> {comic.chapter}
                    </div>

                    <div className="mb-4">
                        <strong className="block mb-2">Synopsis:</strong>
                        <p className="text-gray-700 leading-relaxed">
                            {comicDetail?.synopsis || "Synopsis tidak tersedia."}
                        </p>
                    </div>

                    {/* Daftar Chapter */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">Daftar Chapter</h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                           {comicDetail?.chapters?.map((chapter, index) => (
    <button
        key={index}
        onClick={() => navigate(`/read-comic/${slug}/chapter-${chapter.chapter}`, { 
            state: { 
                chapterLink: chapter.link,
                comicTitle: comic.title,
                chapterNumber: chapter.chapter,
            } 
        })}
        className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-center text-sm"
    >
        {chapter.chapter}
    </button>
))}
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={handleReadComic}
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
                        >
                            Baca
                        </button>

                        <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Sumber:</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {comicDetail?.creator || "Unknown"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailComic