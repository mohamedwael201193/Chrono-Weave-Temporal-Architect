import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  Clock, 
  Zap, 
  Target, 
  Trophy, 
  Star, 
  Sparkles, 
  Cpu, 
  Network, 
  Layers,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

import GameBoard from './components/GameBoard.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import MonadAuth from './components/MonadAuth.jsx'
import { useMonadGamesID } from './hooks/useMonadGamesID.js'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [currentScore, setCurrentScore] = useState(0)
  const [currentEfficiency, setCurrentEfficiency] = useState(0)
  const [currentLoop, setCurrentLoop] = useState(1)

  const { 
    authenticated, 
    isConnected, 
    isRegistered, 
    address, 
    username,
    loading,
    error 
  } = useMonadGamesID()

  const handleScoreUpdate = (score, efficiency, loop) => {
    setCurrentScore(score)
    setCurrentEfficiency(efficiency)
    setCurrentLoop(loop)
  }

  const features = [
    {
      icon: Clock,
      title: "Temporal Loop Mechanics",
      description: "Experience time differently. Each loop builds upon the last, creating temporal echoes that influence future strategies."
    },
    {
      icon: Zap,
      title: "Quantum Energy Networks",
      description: "Design intricate energy conduits across quantum dimensions. Optimize flow efficiency through temporal space."
    },
    {
      icon: Target,
      title: "Strategic Optimization",
      description: "Balance energy costs, efficiency, and temporal residue. Every decision creates ripples across time loops."
    },
    {
      icon: Trophy,
      title: "Competitive Leaderboards",
      description: "Race against temporal echoes of top players. Achieve the highest energy efficiency and climb the global rankings."
    }
  ]

  const stats = [
    { label: "Unique Mechanics", value: "5+" },
    { label: "Time Loops", value: "∞" },
    { label: "Quantum Dimensions", value: "Multiple" },
    { label: "Monad Integration", value: "Full" }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Navigation */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold temporal-text">Chrono-Weave</h1>
                <Badge variant="secondary">Mission 7</Badge>
              </div>
              
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="game">Game</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="connect">Connect</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* Home Tab */}
        <TabsContent value="home" className="mt-0">
          <div className="relative">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
              <div className="absolute inset-0 bg-[url('/src/assets/hero-bg.png')] bg-cover bg-center opacity-30" />
              
              <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                <div className="mb-8">
                  <Badge variant="outline" className="mb-4 temporal-glow">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Monad Game Jam Mission 7
                  </Badge>
                  <h1 className="text-6xl md:text-8xl font-bold mb-6 temporal-text">
                    Chrono-Weave
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-muted-foreground">
                    Temporal Architect
                  </h2>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Master the art of temporal engineering in this revolutionary strategic puzzle game. 
                    Build quantum energy networks across time loops and compete on the Monad blockchain.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button 
                    size="lg" 
                    className="temporal-glow text-lg px-8 py-6"
                    onClick={() => setActiveTab('game')}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Enter the Temporal Grid
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-6"
                    onClick={() => setActiveTab('leaderboard')}
                  >
                    <Trophy className="h-5 w-5 mr-2" />
                    View Leaderboard
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold temporal-text">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="py-24 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 temporal-text">
                    Revolutionary Game Mechanics
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Experience gaming like never before with our innovative temporal loop system 
                    and quantum energy optimization challenges.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="temporal-glow">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Monad Integration Section */}
            <div className="py-24 px-6 bg-muted/30">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 temporal-text">
                    Powered by Monad
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Experience true blockchain gaming with verified scores, global leaderboards, 
                    and cross-game identity through Monad Games ID.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Network className="h-6 w-6 text-primary" />
                        <CardTitle>Blockchain Verified</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        All scores are cryptographically verified and stored on the Monad Testnet, 
                        ensuring fair competition and permanent records.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Layers className="h-6 w-6 text-primary" />
                        <CardTitle>Cross-Game Identity</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Your Monad Games ID works across all games in the ecosystem, 
                        building a unified gaming reputation and achievements.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Cpu className="h-6 w-6 text-primary" />
                        <CardTitle>High Performance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Built on Monad's high-performance blockchain infrastructure, 
                        enabling real-time gameplay with instant transaction finality.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Game Tab */}
        <TabsContent value="game" className="mt-0">
          <div className="py-8">
            <GameBoard 
              onScoreUpdate={handleScoreUpdate}
              playerAddress={address}
            />
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="mt-0">
          <div className="py-8">
            <Leaderboard 
              currentScore={currentScore}
              currentEfficiency={currentEfficiency}
              currentLoop={currentLoop}
              playerAddress={address}
            />
          </div>
        </TabsContent>

        {/* Connect Tab */}
        <TabsContent value="connect" className="mt-0">
          <div className="py-8">
            <MonadAuth />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App

