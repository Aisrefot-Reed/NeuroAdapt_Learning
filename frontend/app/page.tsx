"use client"

import { useState, useEffect } from "react"
import * as api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Main component
export default function LearnEasyPlatform() {
  const [activeSection, setActiveSection] = useState("learn")
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [originalText, setOriginalText] = useState("Today we are learning the basics of algebra. Algebra is a branch of mathematics that works with symbols and rules for manipulating these symbols.")
  const [adaptedText, setAdaptedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      // Here you would typically fetch user data based on the token
      // For now, we'll just simulate it
      const userEmail = localStorage.getItem("userEmail") // Assuming email is stored on login
      if(userEmail) setUser({ email: userEmail })
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.login(email, password)
      const new_token = response.access_token
      setToken(new_token)
      setUser({ email })
      localStorage.setItem("token", new_token)
      localStorage.setItem("userEmail", email)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed!")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
  }

  const handleAdaptText = async () => {
    if (!token) {
      alert("Please log in to adapt text.")
      return
    }
    try {
      setIsLoading(true)
      const response = await api.adaptContent(originalText, token)
      setAdaptedText(response.adapted_text)
    } catch (error) {
      console.error("Adaptation failed:", error)
      alert("Adaptation failed!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextToSpeech = async () => {
    if (!token) {
      alert("Please log in to generate audio.")
      return
    }
    try {
      setIsLoading(true)
      const textToRead = adaptedText || originalText
      const blob = await api.textToSpeech(textToRead, token)
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (error) {
      console.error("TTS failed:", error)
      alert("TTS failed!")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSetDyslexiaProfile = async (isDyslexiaMode: boolean) => {
    if (!token) {
        alert("Please log in to change settings.")
        return
    }
    try {
        // Assuming profile ID 1 is for Dyslexia, and we are unsetting it otherwise.
        // In a real app, you would fetch available profiles.
        const profileId = isDyslexiaMode ? 1 : 0; // A placeholder for unsetting or default
        await api.setNeuroProfile(profileId, token);
        alert("Settings updated!")
    } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update settings!");
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />
      <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Learn</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="p-6 border-2">
              <CardHeader>
                <CardTitle>Enter your text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  rows={10}
                  className="w-full p-2 border rounded"
                />
                <Button onClick={handleAdaptText} disabled={isLoading} className="w-full">
                  {isLoading ? "Adapting..." : "Adapt Text"}
                </Button>
              </CardContent>
            </Card>

            {/* Output Card */}
            <Card className="p-6 border-2">
              <CardHeader>
                <CardTitle>Adapted Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border min-h-[220px]">
                  <p>{adaptedText || "Adapted text will appear here."}</p>
                </div>
                <Button onClick={handleTextToSpeech} disabled={isLoading || !adaptedText} className="w-full">
                  {isLoading ? "Generating Audio..." : "Listen to Adapted Text"}
                </Button>
                {audioUrl && <audio controls src={audioUrl} className="w-full mt-4" />}
              </CardContent>
            </Card>
          </div>
           <SettingsCard onSetDyslexiaProfile={handleSetDyslexiaProfile} />
        </div>
      </main>
    </div>
  )
}

// --- Sub-components ---

function Header({ user, onLogout, onLogin }: any) {
  return (
    <header className="bg-card border-b border-border p-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">NeuroAdapt Learning</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span>{user.email}</span>
              <Button variant="outline" onClick={onLogout}>Logout</Button>
            </div>
          ) : (
            <AuthModal onLogin={onLogin} />
          )}
        </div>
      </div>
    </header>
  )
}

function AuthModal({ onLogin }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    const success = await onLogin(email, password)
    if (success) {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login or Register</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full">Login</Button>
          <p className="text-xs text-center text-muted-foreground">Registration will be attempted if login fails.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SettingsCard({ onSetDyslexiaProfile }: any) {
    const [isDyslexiaMode, setIsDyslexiaMode] = useState(false);

    const handleCheckedChange = (checked: boolean) => {
        setIsDyslexiaMode(checked);
        onSetDyslexiaProfile(checked);
    }

    return (
        <Card className="p-6 border-2 mt-6">
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <Label htmlFor="dyslexia-mode">Dyslexia Mode</Label>
                    <Switch id="dyslexia-mode" checked={isDyslexiaMode} onCheckedChange={handleCheckedChange} />
                </div>
            </CardContent>
        </Card>
    );
}