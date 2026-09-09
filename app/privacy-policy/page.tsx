import LegalPage from '@/components/LegalPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How BelaRisu Medical Centre collects, uses and protects personal data submitted through this website — appointment requests, donations, event registrations and enquiries.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/privacy-policy' },
}

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="9 September 2026"
      intro="This policy explains what personal data BelaRisu Medical Centre collects through this website, why we collect it, who it is shared with, and the rights you have over it under the Kenya Data Protection Act, 2019."
    >
      <h2>Who we are</h2>
      <p>
        BelaRisu Medical Centre (&ldquo;BelaRisu&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a cleft care
        centre based at Park Road, Ngara, Nairobi, Kenya. We are the data controller for personal data
        collected through belarisumedicalcentre.org. You can reach us at{' '}
        <a href="mailto:info@belarisumedicalcentre.org">info@belarisumedicalcentre.org</a> or on{' '}
        <a href="tel:+254722872872">+254 722 872 872</a>.
      </p>

      <h2>What we collect, and when</h2>

      <h3>Appointment requests</h3>
      <p>
        When you request an appointment we collect your first and last name, email address and phone
        number, together with the service you are enquiring about and any preference you express about
        which clinician you see. Because the service you select indicates the care you are seeking, we
        treat this as health-related data and handle it as sensitive personal data under the Act.
      </p>

      <h3>Donations</h3>
      <p>
        When you donate through the site we collect the phone number and amount needed to raise an
        M-PESA payment request, and where card payment is offered, the details required to process it.
        Card details are entered into and processed by our payment provider; we do not store full card
        numbers on our systems.
      </p>

      <h3>Event registrations</h3>
      <p>
        When you register for an event such as the Swing For Smiles charity golf day, we collect your
        name, email address, phone number, entry type, the names of any teammates you supply, and
        anything you choose to tell us in the free-text field — for example dietary or accessibility
        requirements.
      </p>

      <h3>Enquiries</h3>
      <p>
        When you use the contact form we collect the details you enter so we can reply.
      </p>

      <h3>Information collected automatically</h3>
      <p>
        Our hosting and content delivery providers process technical information such as your IP
        address, browser type and the pages you request, as an ordinary part of serving the site
        securely. We also store small amounts of information in your browser, described under Cookies
        below.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to appointment requests, enquiries and event registrations.</li>
        <li>To process and acknowledge donations, and to meet our financial record-keeping obligations.</li>
        <li>To provide care and to contact you about arrangements for your visit or the event you registered for.</li>
        <li>To keep the site secure and working correctly.</li>
      </ul>
      <p>
        We rely on your consent for optional cookies and for marketing-style communications. We rely on
        our legitimate interest in running the centre for responding to your enquiries, and on legal
        obligation for financial records. Where you give us health-related information, we act on your
        explicit consent in seeking care from us.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We do not sell personal data. We share it only with the service providers that make this site
        and our services work, and only so far as each needs it:
      </p>
      <ul>
        <li><strong>Supabase</strong> — stores appointment requests submitted through the site.</li>
        <li><strong>Safaricom M-PESA</strong> — processes mobile money donations and payment confirmations.</li>
        <li><strong>CyberSource</strong> — processes card payments where card payment is offered.</li>
        <li><strong>Web3Forms</strong> — delivers contact form and event registration submissions to us by email.</li>
        <li><strong>Cloudinary</strong> — hosts and delivers the images on this site.</li>
        <li><strong>Google Fonts</strong> — serves the typefaces used on this site; your IP address is visible to Google when a page loads.</li>
      </ul>
      <p>
        Some of these providers operate outside Kenya, which means your data may be transferred abroad.
        We may also disclose data where the law requires it.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We use a small number of strictly necessary items that make the site function. We also store
        your cookie choice, and whether you have already been shown our event announcement, so we do
        not repeat it on every visit. These are stored in your browser and are not used to track you
        across other websites.
      </p>
      <p>
        If we introduce analytics cookies, they will only be set where you have chosen &ldquo;Accept
        all&rdquo;. You can change your choice at any time by clearing this site&rsquo;s data in your
        browser settings.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep appointment and clinical records for as long as required by Kenyan medical
        record-keeping rules, and financial records for as long as required by tax and audit rules.
        Enquiries and event registrations are kept only as long as needed to deal with them and for a
        reasonable period afterwards.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the Kenya Data Protection Act, 2019 you have the right to be informed how your data is
        used, to access it, to have inaccurate data corrected, to have data deleted where there is no
        good reason for us to keep it, to object to certain processing, and to withdraw consent you
        have given. To exercise any of these, write to{' '}
        <a href="mailto:info@belarisumedicalcentre.org">info@belarisumedicalcentre.org</a>.
      </p>
      <p>
        If you are not satisfied with our response, you may complain to the Office of the Data
        Protection Commissioner of Kenya.
      </p>

      <h2>Keeping data safe</h2>
      <p>
        We use reputable providers, restrict access to those who need it, and serve the site over an
        encrypted connection. No method of transmission over the internet is completely secure, and we
        cannot guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>
        Much of our work is with children, and appointment requests are usually made by a parent or
        guardian. Where information about a child is provided to us, we expect it to be provided by a
        person with parental responsibility, and we handle it with the same care as any other sensitive
        data.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will update the date at the top of this page.
      </p>
    </LegalPage>
  )
}
