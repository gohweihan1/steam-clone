"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Gamepad2, Users, Trophy, Zap } from "lucide-react"

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get("username") as string

    // Store username in cookies for later use
    document.cookie = `username=${username}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

    setShowSignUp(false)
    // You can add success feedback here
    alert(`Welcome ${username}! Account created successfully.`)

    // Redirect to home page
    window.location.href = "/home"
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get("username") as string

    // Store username in cookies
    document.cookie = `username=${username}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

    setShowSignIn(false)
    // You can add success feedback here
    alert(`Welcome back ${username}!`)

    // Redirect to home page
    window.location.href = "/home"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">SteamClone</span>
        </div>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowSignIn(true)}
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
          >
            Sign In
          </Button>
          <Button onClick={() => setShowSignUp(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
            Your Ultimate
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Gaming Hub
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover, play, and connect with millions of games and gamers worldwide. Get personalized recommendations
            powered by advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button
              size="lg"
              onClick={() => setShowSignUp(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              Join Now - It's Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowSignIn(true)}
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
            >
              Already a Member?
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Users className="h-12 w-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect & Play</h3>
            <p className="text-gray-300">Join millions of players and discover your next favorite game together.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Zap className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Recommendations</h3>
            <p className="text-gray-300">Get personalized game suggestions powered by advanced machine learning.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Trophy className="h-12 w-12 text-yellow-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Achievements</h3>
            <p className="text-gray-300">Track your progress and unlock achievements across all your games.</p>
          </div>
        </div>
      </main>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSignIn(false)} />
          <div className="relative bg-slate-800 rounded-lg p-8 w-full max-w-md mx-4 border border-slate-700">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your account</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-username" className="text-white">
                  Username
                </Label>
                <Input
                  id="signin-username"
                  name="username"
                  type="text"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <Label htmlFor="signin-password" className="text-white">
                  Password
                </Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setShowSignIn(false)
                    setShowSignUp(true)
                  }}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSignUp(false)} />
          <div className="relative bg-slate-800 rounded-lg p-8 w-full max-w-md mx-4 border border-slate-700">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Join SteamClone</h2>
              <p className="text-gray-400">Create your gaming account</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-username" className="text-white">
                  Username
                </Label>
                <Input
                  id="signup-username"
                  name="username"
                  type="text"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-white">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  placeholder="Create a password"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setShowSignUp(false)
                    setShowSignIn(true)
                  }}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
