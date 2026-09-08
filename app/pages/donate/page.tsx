import React from 'react'
import DonationHero from '@/app/components/donate/overlayCard'
import AdoptYourCause from '@/app/components/donate/adoptYourCause'
import DonationPart from '@/app/components/donate/donationPart'

function Donate() {
  return (
    <div className="animate-fade-in-up">
      <DonationHero />
      <AdoptYourCause />
      <DonationPart />
    </div>
  )
}

export default Donate