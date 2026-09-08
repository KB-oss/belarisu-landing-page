import LegalPage from '@/components/LegalPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms on which BelaRisu Medical Centre provides this website — including appointment requests, donations, event registrations, and the limits of the information published here.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/terms-of-service' },
}

export default function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="9 September 2026"
      intro="These terms govern your use of belarisumedicalcentre.org. By using the site — including requesting an appointment, making a donation or registering for an event — you accept them."
    >
      <h2>About us</h2>
      <p>
        This site is operated by BelaRisu Medical Centre, a cleft care centre at Park Road, Ngara,
        Nairobi, Kenya. You can contact us at{' '}
        <a href="mailto:info@belarisumedicalcentre.org">info@belarisumedicalcentre.org</a> or on{' '}
        <a href="tel:+254722872872">+254 722 872 872</a>.
      </p>

      <h2>This site is not medical advice</h2>
      <p>
        Everything published here is general information about our centre and the care we provide. It
        is not medical advice, and it is not a substitute for consulting a qualified clinician about
        your own circumstances or those of a child in your care. Do not delay seeking medical advice
        because of something you have read on this site.
      </p>
      <p>
        <strong>If this is an emergency, contact emergency services or go to your nearest hospital.</strong>{' '}
        Do not use this website, the contact form or the appointment request form to report an urgent
        medical problem — these are not monitored continuously.
      </p>

      <h2>No doctor–patient relationship</h2>
      <p>
        Using this site does not create a doctor–patient relationship between you and BelaRisu Medical
        Centre or any of our clinicians. That relationship begins only when you are seen and accepted
        for care at the centre.
      </p>

      <h2>Appointment requests</h2>
      <p>
        Submitting the booking form sends us a <em>request</em>. It is not a confirmed appointment. We
        will contact you to confirm, and we may need to propose a different time, a different clinician,
        or an initial assessment first. We may be unable to offer an appointment where the care sought
        is outside what we provide.
      </p>
      <p>
        Please give accurate information when you make a request, and tell us as early as you can if you
        need to cancel or rearrange, so the slot can go to another family.
      </p>

      <h2>Donations</h2>
      <p>
        Donations made through this site — by M-PESA or, where offered, by card — are voluntary gifts
        made to support our work. They fund cleft surgery, therapy and follow-up care, and are not
        payment for treatment for any particular person, including the donor.
      </p>
      <p>
        Because donations are gifts rather than purchases, they are generally not refundable. If you
        believe you have donated in error or been charged incorrectly, contact us promptly and we will
        look into it in good faith. Keep the confirmation message from your payment provider as your
        record of the transaction.
      </p>

      <h2>Event registrations</h2>
      <p>
        Registering for an event such as the Swing For Smiles charity golf day is a request to take
        part, and is confirmed by us. Entry fees are payable as set out on the event page, and your
        place is confirmed once payment is received. Entry fees support our clinical work and, like
        donations, are generally non-refundable; if an event is cancelled or materially changed by us,
        contact us and we will agree a fair outcome with you.
      </p>
      <p>
        Event details — including date, venue and pricing — are those published on the relevant page
        and may change. We will tell registered participants if they do.
      </p>

      <h2>Using this site</h2>
      <p>
        You may use this site for your own personal, non-commercial purposes. Please do not attempt to
        disrupt the site, gain unauthorised access to it, or submit false information through its forms.
        The content, branding and images on this site belong to BelaRisu Medical Centre or our licensors
        and may not be reproduced without permission.
      </p>
      <p>
        Photographs of patients and families are published with consent. Please do not copy or
        redistribute them.
      </p>

      <h2>Links to other sites</h2>
      <p>
        Where we link to other organisations, we are not responsible for their content or their
        privacy practices.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep the site available and accurate, but we do not guarantee that it will be
        uninterrupted or error-free, and we may change or withdraw parts of it. To the extent permitted
        by Kenyan law, we are not liable for loss arising from your use of the site. Nothing in these
        terms limits liability that cannot lawfully be limited, including for death or personal injury
        caused by negligence.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <a href="/privacy-policy">privacy policy</a> explains how we handle personal data submitted
        through this site, and forms part of these terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Kenya, and the courts of Kenya have jurisdiction over
        any dispute arising from them.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If we change these terms we will update the date at the top of this page.
      </p>
    </LegalPage>
  )
}
