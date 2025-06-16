import { type NextRequest, NextResponse } from "next/server"
import userData from "../../../../../data/user.json"

export async function GET(
  request: NextRequest,
  context: { params: { username: string } }
) {
  const { username } = context.params

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  const user = userData[username as keyof typeof userData]

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({
    username,
    num_games_owned: user.num_games_owned,
    games: user.games,
  })
}
