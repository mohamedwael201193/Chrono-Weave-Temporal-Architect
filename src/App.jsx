import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Clock, Zap, Network, Trophy, Github, ExternalLink, Play, Star, Users, Target, GamepadIcon } from 'lucide-react'
import './App.css'
import heroBg from './assets/hero-bg.png'
import gameMechanics from './assets/game-mechanics.png'
import monadIntegration from './assets/monad-integration.png'
import GameBoard from './components/GameBoard.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import MonadAuth, { useMonadGamesID } from './components/MonadAuth.jsx'

function App() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentEfficiency, setCurrentEfficiency] = useState(0)
  const [currentLoop, setCurrentLoop] = useState(1)
  const [userInfo, setUserInfo] = useState(null)
  const [activeTab, setActiveTab] = useState('home')

  const { isConnected, submitScore } = useMonadGamesID()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleScoreUpdate = async (score, efficiency, loops) => {
    setCurrentScore(score)
    setCurrentEfficiency(efficiency)
    setCurrentLoop(loops)

    // Submit score to Monad Games ID if connected
    if (isConnected && userInfo) {
      try {
        const result = await submitScore(score, efficiency, loops)
        console.log('Score submitted successfully:', result)
      } catch (error) {
        console.error('Failed to submit score:', error)
      }
    }
  }

  const handleAuthSuccess = (userData) => {
    setUserInfo(userData)
  }

  const features = [
    {
      icon: Clock,
      title: "Iterative Time Loops",
      description: "Each level consists of short time loops where energy flows through your conduits. Past decisions impact future possibilities through temporal residue."
    },
    {
      icon: Zap,
      title: "Quantum Entanglement",
      description: "Link distant points instantly with quantum nodes. Manage temporal energy carefully to maintain these powerful connections."
    },
    {
      icon: Network,
      title: "Adaptive Obstacles",
      description: "The environment responds to your actions. Overload areas create temporal anomalies that alter future gameplay."
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
                <TabsTrigger value="auth">Connect</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://github.com/mohamedwael201193/Chrono-Weave-Temporal-Architect" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Home Tab */}
        <TabsContent value="home" className="mt-0">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 quantum-grid opacity-20" />
            
            <div className={`relative z-10 text-center max-w-6xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-6 temporal-glow energy-pulse" variant="secondary">
                Monad Game Jam Mission 7
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-6 temporal-text">
                Chrono-Weave
              </h1>
              <h2 className="text-3xl md:text-4xl font-light mb-8 text-muted-foreground">
                Temporal Architect
              </h2>
              
              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed">
                Master the art of temporal engineering. Build energy conduits across fractured timelines, 
                optimize quantum networks, and compete for the highest efficiency in this revolutionary 
                strategic puzzle experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button size="lg" className="temporal-glow energy-pulse text-lg px-8 py-6" onClick={() => setActiveTab('game')}>
                  <Play className="mr-2 h-5 w-5" />
                  Play Now
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => setActiveTab('leaderboard')}>
                  <Trophy className="mr-2 h-5 w-5" />
                  View Leaderboard
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold temporal-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Game Concept Section */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 temporal-text">
                  Revolutionary Gameplay
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Experience a unique blend of strategic puzzle-solving and time manipulation 
                  that challenges conventional gaming paradigms.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
                <div>
                  <img 
                    src={gameMechanics} 
                    alt="Game Mechanics Visualization" 
                    className="w-full rounded-lg temporal-glow"
                  />
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <Clock className="mr-3 h-6 w-6 text-primary" />
                      Temporal Architecture
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Design and optimize complex energy networks across multiple quantum dimensions. 
                      Each placement affects not just the current loop, but creates ripple effects 
                      through time that influence future iterations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <Zap className="mr-3 h-6 w-6 text-accent" />
                      Quantum Mechanics
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Harness quantum entanglement to create instant connections across vast distances. 
                      Balance energy consumption with strategic advantage as you build increasingly 
                      sophisticated temporal networks.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="temporal-glow hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <feature.icon className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Monad Integration Section */}
          <section className="py-24 px-6 bg-card">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div>
                    <Badge className="mb-4" variant="secondary">Blockchain Integration</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 temporal-text">
                      Powered by Monad
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                      Experience true competitive gaming with transparent, immutable leaderboards 
                      and verifiable achievements on the Monad Testnet.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Verifiable Leaderboards</h3>
                        <p className="text-muted-foreground">
                          All scores are recorded on-chain using Monad Games ID, ensuring 
                          complete transparency and preventing cheating.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Community Challenges</h3>
                        <p className="text-muted-foreground">
                          Share level seeds and compete on identical temporal landscapes. 
                          Discover and master the most challenging configurations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-chart-3 flex items-center justify-center flex-shrink-0">
                        <Target className="h-4 w-4 text-background" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Future Expansion</h3>
                        <p className="text-muted-foreground">
                          Planned NFT-based conduit blueprints will allow players to create 
                          and trade unique gameplay elements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <img 
                    src={monadIntegration} 
                    alt="Monad Integration" 
                    className="w-full rounded-lg temporal-glow"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 temporal-text">
                Ready to Master Time?
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Join the Monad Game Jam Mission 7 and experience the future of strategic gaming. 
                Build, optimize, and compete in the ultimate temporal challenge.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="temporal-glow energy-pulse text-lg px-8 py-6" onClick={() => setActiveTab('game')}>
                  <GamepadIcon className="mr-2 h-5 w-5" />
                  Start Playing
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => setActiveTab('auth')}>
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 px-6 border-t border-border">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold temporal-text">Chrono-Weave</h3>
                  <p className="text-muted-foreground">Temporal Architect</p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="https://github.com/mohamedwael201193/Chrono-Weave-Temporal-Architect" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="https://monad.xyz" target="_blank" rel="noopener noreferrer">
                      <Star className="h-4 w-4 mr-2" />
                      Monad
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
                <p>&copy; 2024 Chrono-Weave: Temporal Architect. Built for Monad Game Jam Mission 7.</p>
              </div>
            </div>
          </footer>
        </TabsContent>

        {/* Game Tab */}
        <TabsContent value="game" className="mt-0">
          <div className="min-h-screen py-8">
            <GameBoard 
              onScoreUpdate={handleScoreUpdate}
              playerAddress={userInfo?.address}
            />
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="mt-0">
          <div className="min-h-screen py-8 px-6">
            <Leaderboard 
              currentScore={currentScore}
              currentEfficiency={currentEfficiency}
              currentLoop={currentLoop}
              playerAddress={userInfo?.address}
            />
          </div>
        </TabsContent>

        {/* Auth Tab */}
        <TabsContent value="auth" className="mt-0">
          <div className="min-h-screen py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <MonadAuth 
                onAuthSuccess={handleAuthSuccess}
                onAuthError={(error) => console.error('Auth error:', error)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App

