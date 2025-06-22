"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface QuestionnaireProps {
  isOpen: boolean
  onClose: () => void
  username: string
}

interface TagQuestion {
  id: number
  title: string
  options: string[]
}

interface ImageQuestion {
  id: number
  title: string
  images: string[]
}

const tagQuestions: TagQuestion[] = [
  {
    id: 1,
    title: "What are your core gaming preferences?",
    options: ["Cooperative Play", "Indie", "Adventure", "Strategic Thinking", "Horror"],
  },
  {
    id: 2,
    title: "What gameplay style do you prefer?",
    options: ["Shooter", "Strategic Combat", "Clicker", "Simulation"],
  },
  {
    id: 3,
    title: "What aesthetic preferences appeal to you?",
    options: ["Visual Style", "Family Fun", "Dark Themes", "2D"],
  },
  {
    id: 4,
    title: "Which special features interest you most?",
    options: ["Singleplayer", "Mystery", "Replayability", "Random Generation", "Roguelike Adventures"],
  },
]

const allImageTags = [
  "Cooperative Play",
  "Visual Style",
  "Family Fun",
  "Indie",
  "Mystery",
  "2D",
  "Singleplayer",
  "Adventure",
  "Shooter",
  "Strategic Combat",
  "Replayability",
  "Strategic Thinking",
  "Horror",
  "Clicker",
  "Dark Themes",
  "Simulation",
  "Random Generation",
  "Rougelike Adventures",
]

export default function PreferenceQuestionnaire({ isOpen, onClose, username }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tagAnswers, setTagAnswers] = useState<string[]>([])
  const [imageAnswers, setImageAnswers] = useState<string[]>([])
  const [imageQuestions, setImageQuestions] = useState<ImageQuestion[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize image questions when component opens
  useEffect(() => {
    console.log("Image question length: ", imageQuestions.length)
    console.log("Is open?: ", isOpen)
    if (isOpen && imageQuestions.length === 0) {
      console.log("Generate image questions")
      generateImageQuestions()
    }
  }, [isOpen, imageQuestions.length])

  const generateImageQuestions = () => {
    console.log("Generating info questions")
    // Shuffle all image tags
    const shuffled = [...allImageTags].sort(() => Math.random() - 0.5)

    // Create 4 image questions with distribution 5-5-4-4 (total 18)
    const distributions = [5, 5, 4, 4]
    let currentIndex = 0

    const questions: ImageQuestion[] = distributions.map((count, index) => {
      const question = {
        id: index + 1,
        title: `Which of these visual themes appeals to you most?`,
        images: shuffled.slice(currentIndex, currentIndex + count),
      }

      // Update currentIndex for next slice
      currentIndex += count

      return question
    })

    console.log("Generated info questions")
    setImageQuestions(questions)
  }

  const handleTagAnswer = (answer: string) => {
    console.log("Handling tag answer")
    const newAnswers = [...tagAnswers]
    newAnswers[currentStep] = answer
    setTagAnswers(newAnswers)

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    } else {
      // This is the last question, auto-submit
      handleSubmitWithAnswer(newAnswers, imageAnswers)
    }
  }

  const handleImageAnswer = (answer: string) => {
    const imageQuestionIndex = currentStep - 4
    const newAnswers = [...imageAnswers]
    newAnswers[imageQuestionIndex] = answer
    setImageAnswers(newAnswers)

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    } else {
      // This is the last question, auto-submit
      handleSubmitWithAnswer(tagAnswers, newAnswers)
    }
  }

  const handleSubmitWithAnswer = async (finalTagAnswers: string[], finalImageAnswers: string[]) => {
    setIsSubmitting(true)

    const preferences = {
      username,
      timestamp: new Date().toISOString(),
      tag_preferences: {
        core_preferences: finalTagAnswers[0],
        gameplay_style: finalTagAnswers[1],
        aesthetic_preferences: finalTagAnswers[2],
        special_features: finalTagAnswers[3],
      },
      image_preferences: finalImageAnswers,
      all_selected_tags: [...finalTagAnswers, ...finalImageAnswers],
    }

    try {
      // Send to your REST API
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        console.log("Preferences saved successfully:", preferences)
        onClose()
        // Redirect to home page
        window.location.href = "/home"
      } else {
        throw new Error("Failed to save preferences")
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      alert("Failed to save preferences. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    handleSubmitWithAnswer(tagAnswers, imageAnswers)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getImageUrl = (tagName: string) => {
    // Convert tag name to filename (you can adjust this based on your actual file naming)
    const filename = tagName.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "and")
    const url = `/pics/${filename}.jpeg`

    // DEBUG: Log the generated URL
    console.log(`Tag: "${tagName}" -> Filename: "${filename}" -> URL: "${url}"`)

    return url
  }

  if (!isOpen) return null

  const isTagQuestion = currentStep < 4
  const currentTagQuestion = isTagQuestion ? tagQuestions[currentStep] : null
  const currentImageQuestion = !isTagQuestion ? imageQuestions[currentStep - 4] : null
  const progress = ((currentStep + 1) / 8) * 100
  const isLastQuestion = currentStep === 7

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-slate-800 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border border-slate-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Tell Us About Your Gaming Preferences</h2>
            <p className="text-gray-400">Help us recommend the perfect games for you</p>

            {/* Progress Bar */}
            <div className="mt-6 w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Question {currentStep + 1} of 8
              {isLastQuestion && (
                <span className="block text-blue-400 mt-1">
                  Final question - selecting an option will complete setup!
                </span>
              )}
            </p>
          </div>

          {/* Tag Questions */}
          {isTagQuestion && currentTagQuestion && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white text-center mb-8">{currentTagQuestion.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTagQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleTagAnswer(option)}
                    disabled={isSubmitting}
                    className="p-6 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-400 rounded-lg text-white text-left transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-medium text-lg">{option}</div>
                    {isLastQuestion && <div className="text-sm text-blue-400 mt-2">Click to complete setup</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Questions */}
          {!isTagQuestion && currentImageQuestion && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white text-center mb-8">{currentImageQuestion.title}</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentImageQuestion.images.map((imageName) => (
                  <button
                    key={imageName}
                    onClick={() => handleImageAnswer(imageName)}
                    disabled={isSubmitting}
                    className="group relative overflow-hidden rounded-lg border-2 border-slate-600 hover:border-blue-400 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img
                      src={getImageUrl(imageName) || "/placeholder.svg"}
                      alt={imageName}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=128&width=200"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-white font-medium text-center px-2">{imageName}</span>
                      {isLastQuestion && (
                        <span className="absolute bottom-2 left-2 right-2 text-xs text-blue-400 bg-black/80 rounded px-1">
                          Click to complete!
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span className="text-white text-sm font-medium">{imageName}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Back
            </button>

            {isSubmitting ? (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span>Saving preferences...</span>
              </div>
            ) : isLastQuestion ? (
              <div className="text-green-400 text-sm font-medium">
                🎉 Select your final preference to complete setup!
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Select an option to continue</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
