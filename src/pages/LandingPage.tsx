import { LandingNavigation } from '../features/landing/components/LandingNavigation'
import { HeroSection } from '../features/landing/components/HeroSection'
import { FeaturesSection } from '../features/landing/components/FeaturesSection'
import { KnativeSection } from '../features/landing/components/KnativeSection'
import { LandingFooter } from '../features/landing/components/LandingFooter'

function LandingPage(): JSX.Element {
  return (
    <div className="min-h-screen h-full bg-background-dark font-display">
      <LandingNavigation />
      <main id="main-content" className="bg-background-dark">
        <HeroSection />
        <FeaturesSection />
        <KnativeSection />
      </main>
      <LandingFooter />
    </div>
  )
}

export default LandingPage
