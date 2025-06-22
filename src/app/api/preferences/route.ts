import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const preferences = await request.json()

    // Log the preferences (in a real app, you'd save to database)
    console.log("User preferences received:", preferences)

    // Here you would typically:
    // 1. Save to your database
    // 2. Send to your recommendation system API
    // 3. Update user profile

    // For now, we'll just simulate a successful save
    // You can replace this with your actual API call

    // Example of what you might send to your recommendation system:
    const recommendationPayload = {
      user_id: preferences.username,
      tag_preferences: preferences.tag_preferences,
      image_preferences: preferences.image_preferences,
      all_selected_tags: preferences.all_selected_tags,
      timestamp: preferences.timestamp,
    }

    // Simulate API call to your recommendation system
    // const response = await fetch('YOUR_RECOMMENDATION_API_URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(recommendationPayload)
    // })

    return NextResponse.json({
      success: true,
      message: "Preferences saved successfully",
      data: recommendationPayload,
    })
  } catch (error) {
    console.error("Error saving preferences:", error)
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 })
  }
}
