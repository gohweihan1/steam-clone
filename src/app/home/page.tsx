"use client"

import { useState, useEffect } from "react"

interface Game {
  id: string
  name: string
  price?: string
  originalPrice?: string
  discount?: string
}

interface UserData {
  username: string
  num_games_owned: number
  games: string[]
}

export default function HomePage() {
  const [username, setUsername] = useState<string>("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [ownedGames, setOwnedGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([])

  // Mock data for recommended games (this could also come from an API)
  // const recommendedGames: Game[] = [
  //   { id: "413150", name: "Stardew Valley", price: "$14.99", originalPrice: "$14.99" },
  //   { id: "1091500", name: "Cyberpunk 2077", price: "$29.99", originalPrice: "$59.99", discount: "-50%" },
  //   { id: "292030", name: "The Witcher 3: Wild Hunt", price: "$9.99", originalPrice: "$39.99", discount: "-75%" },
  //   { id: "271590", name: "Grand Theft Auto V", price: "$14.99", originalPrice: "$29.99", discount: "-50%" },
  //   { id: "1174180", name: "Red Dead Redemption 2", price: "$23.99", originalPrice: "$59.99", discount: "-60%" },
  //   { id: "1245620", name: "ELDEN RING", price: "$47.99", originalPrice: "$59.99", discount: "-20%" },
  // ]

  useEffect(() => {
    // Get username from cookies
    console.log("Getting username from cookies")
    const cookies = document.cookie.split(";")
    const usernameCookie = cookies.find((cookie) => cookie.trim().startsWith("username="))
    if (usernameCookie) {
      const extractedUsername = usernameCookie.split("=")[1]
      console.log("Logging in to: ", extractedUsername)
      setUsername(extractedUsername)
      fetchUserData(extractedUsername)
    } else {
      setError("No user logged in")
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (username: string) => {
    try {
      setLoading(true)

      // Fetch user data
      const userResponse = await fetch(`/api/user/${username}`)
      if (!userResponse.ok) {
        throw new Error("User not found")
      }

      const userData: UserData = await userResponse.json()
      setUserData(userData)
      console.log("User Data: ", userData)

      // Fetch game details
      const gamesResponse = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameIds: userData.games }),
      })

      if (!gamesResponse.ok) {
        throw new Error("Failed to fetch games")
      }

      const gamesData = await gamesResponse.json()
      setOwnedGames(gamesData.games)

      //Fetch Recommended Games
      const request_data = { "username": username }

      const response = await fetch("http://127.0.0.1:5000/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request_data),
        })

      if (!response.ok) throw new Error("Failed to get recommendations")

      const game_ids: string[] = await response.json()

      const recommendedgamesResponse = await fetch("/api/games", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameIds: game_ids }),
        })

      if (!recommendedgamesResponse.ok) throw new Error("Failed to fetch game details")

        const recommendedGamesData = await recommendedgamesResponse.json()
        setRecommendedGames(recommendedGamesData.games)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    document.cookie = "username=; path=/; max-age=0"
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading your games...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                <span className="text-white font-bold">🎮</span>
              </div>
              <span className="text-2xl font-bold text-white">SteamClone</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-blue-400 font-medium">
                Home
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Store
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Library
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Community
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              Welcome, <span className="text-blue-400 font-medium">{username}</span>
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {username}!</h1>
          <p className="text-gray-400">Ready to discover your next favorite game?</p>
        </div>

        {/* Owned Games Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Library</h2>
            <span className="text-gray-400">{userData?.num_games_owned || 0} games</span>
          </div>

          {ownedGames.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {ownedGames.map((game) => (
                <div key={game.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-400 transition-all duration-300 transform hover:scale-105">
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.id}/header.jpg`}
                      alt={game.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=215&width=460"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium">
                        Play
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                    {game.name}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No games found in your library</p>
            </div>
          )}
        </section>

        {/* Recommended Games Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>🤖</span>
              <span>Powered by AI</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedGames.map((game) => (
              <div key={game.id} className="group cursor-pointer">
                <div className="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-400 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.id}/header.jpg`}
                      alt={game.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=215&width=460"
                      }}
                    />
                    {game.discount && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                        {game.discount}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {game.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {game.originalPrice && game.originalPrice !== game.price && (
                          <span className="text-gray-400 line-through text-sm">{game.originalPrice}</span>
                        )}
                        <span className="text-green-400 font-bold">{game.price}</span>
                      </div>

                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Games Owned</h3>
                <p className="text-2xl font-bold text-blue-400">{userData?.num_games_owned || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⭐</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Recommendations</h3>
                <p className="text-2xl font-bold text-purple-400">{recommendedGames.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Potential Savings</h3>
                <p className="text-2xl font-bold text-green-400">$127.96</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
