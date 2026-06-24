import { useState } from 'react'
import { Hero } from '../components/home/Hero'
import { Services } from '../components/home/Services'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { About } from '../components/home/About'
import { BookingSection } from '../components/booking/BookingSection'

export function HomePage() {
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null)
  const [selectionToken, setSelectionToken] = useState(0)

  function handleSelectService(serviceId: string) {
    setPreselectedServiceId(serviceId)
    setSelectionToken((prev) => prev + 1)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Hero />
      <Services onSelectService={handleSelectService} />
      <WhyChooseUs />
      <About />
      <BookingSection preselectedServiceId={preselectedServiceId} selectionToken={selectionToken} />
    </>
  )
}
