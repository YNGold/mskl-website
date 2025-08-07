import Link from 'next/link'
import { HeroSection } from '@/components/HeroSection'
import { HowItWorks } from '@/components/HowItWorks'
import { UpcomingChallenges } from '@/components/UpcomingChallenges'
import { PrizesSection } from '@/components/PrizesSection'
import { CommunitySection } from '@/components/CommunitySection'
import { LeaderboardPreview } from '@/components/LeaderboardPreview'
import { AdvisoryBoard } from '@/components/AdvisoryBoard'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <UpcomingChallenges />
      <PrizesSection />
      <AdvisoryBoard />
      <LeaderboardPreview />
      <CommunitySection />
    </div>
  )
}
