import { type NextRequest, NextResponse } from "next/server"
import gamesData from "../../../../data/games.json"

export async function POST(request: NextRequest) {
  try {
    const { gameIds } = await request.json()
    console.log("Game IDs: ", gameIds)

    if (!gameIds || !Array.isArray(gameIds)) {
      return NextResponse.json({ error: "Game IDs array is required" }, { status: 400 })
    }

    const games = gameIds.map((id) => {
      const game = gamesData[id as keyof typeof gamesData]
      if (game) {
        return {
          id,
          ...game, // includes name, price, originalPrice, discount (if any)
        }
      } else {
        return {
          id,
          name: `Game ${id}`,
          price: "$0.00",
          originalPrice: "$0.00",
        }
      }
    })

    return NextResponse.json({ games })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
