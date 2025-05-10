import { DefaultSeoProps, BreadCrumbJsonLdProps, SocialProfileJsonLdProps, ProductJsonLdProps, FAQPageJsonLdProps } from "next-seo";

const config: DefaultSeoProps = {
  titleTemplate: '%s | Aiplagreport',
  defaultTitle: 'Turnitin Alternative - AI-Powered Plagiarism Detection | Aiplagreport',
  description: 'Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide.',
  canonical: 'https://aiplagreport.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiplagreport.com',
    siteName: 'Aiplagreport',
    title: 'Turnitin Alternative - AI-Powered Plagiarism Detection | Aiplagreport',
    description: 'Advanced Turnitin alternative with AI-powered plagiarism detection. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide.',
    images: [
      {
        url: 'https://aiplagreport.com/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aiplagreport - Turnitin Alternative',
      },
    ],
  },
  twitter: {
    handle: '@aiplagreport',
    site: '@aiplagreport',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'Turnitin Alternative, Plagiarism Detection, AI Content Detection, Academic Integrity, Plagiarism Checker',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
    {
      name: 'theme-color',
      content: '#000000',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
};

const productJsonLd: ProductJsonLdProps = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Aiplagreport Plagiarism Detection Suite",
  productName: "Aiplagreport Plagiarism Detection Suite",
  description: "The most accurate Turnitin alternative for plagiarism detection. Used by 10,000+ educators worldwide. Features AI-powered content detection, comprehensive similarity analysis, and detailed plagiarism reports.",
  image: "https://aiplagreport.com/assets/images/pricing.png",
  brand: "Aiplagreport",
  offers: {
    "@type": "Offer",
    price: "999",
    priceCurrency: "USD",
    priceValidUntil: "2024-12-31",
    availability: "https://schema.org/InStock",
    url: "https://aiplagreport.com/pricing",
    seller: {
      "@type": "Organization",
      name: "Aiplagreport",
      url: "https://aiplagreport.com"
    }
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1000",
    bestRating: "5",
    worstRating: "1"
  }
};

const faqJsonLd: FAQPageJsonLdProps = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is No Repository Mode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We're using Turnitin's 'No Repository Mode' for draft submissions. This means your work won't be stored in any database, so it won't impact your final submission later. Perfect for checking your work before final submission!"
      }
    },
    {
      "@type": "Question",
      name: "How do credits work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All purchased credits in Aiplagreport are lifetime credits with no expiry date. We operate on a pay-as-you-go model with no subscriptions or recurring charges. You only pay for the credits you need, and there are no hidden fees."
      }
    },
    {
      "@type": "Question",
      name: "How do I purchase credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1. Visit the Pricing page\n2. Choose your desired credit package\n3. Complete the payment process\n4. Credits are instantly added to your account"
      }
    },
    {
      "@type": "Question",
      name: "How do I interpret the AI Detection Report?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "0% AI Detected: Your submission is entirely human-written.\n1-19% AI Detected: A small portion may resemble AI-generated content, but is within safe range.\n20-100% AI Detected: A significant portion is likely AI-generated and may be reviewed for academic integrity concerns."
      }
    },
    {
      "@type": "Question",
      name: "What are the submission requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minimum Word Count: 300 words in paragraphs\nFile Size: Less than 100 MB\nPage Count: Maximum 800 pages\nAccepted File Types: .pdf and .docx only\nLanguage: English only"
      }
    }
  ]
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aiplagreport",
  url: "https://aiplagreport.com",
  logo: "https://aiplagreport.com/assets/images/logo.png",
  sameAs: [
    "https://twitter.com/aiplagreport",
    "https://www.linkedin.com/company/aiplagreport",
    "https://www.youtube.com/aiplagreport",
    "https://www.facebook.com/aiplagreport"
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
      email: "contact@aiplagreport.com",
      areaServed: "Worldwide",
      hoursAvailable: "Mo-Su 00:00-24:00"
    }
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "Estonia"
  },
  foundingDate: "2023",
  description: "Aiplagreport is the leading Turnitin alternative offering 99.9% accurate plagiarism detection. Trusted by 10,000+ educators and institutions worldwide."
};

const socialProfileJsonLd: SocialProfileJsonLdProps = {
  type: "Organization",
  name: "Aiplagreport",
  url: "https://aiplagreport.com",
  sameAs: [
    "https://twitter.com/aiplagreport",
    "https://www.linkedin.com/company/aiplagreport",
    "https://www.youtube.com/aiplagreport",
    "https://www.facebook.com/aiplagreport"
  ]
};

const breadcrumbJsonLd: BreadCrumbJsonLdProps = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElements: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://aiplagreport.com/"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: "https://aiplagreport.com/pricing"
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Earn",
      item: "https://aiplagreport.com/earn"
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "FAQ",
      item: "https://aiplagreport.com/faq"
    }
  ]
};

const earnPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Earn Free Report Credits - Aiplagreport",
  description: "Invite friends, earn rewards, and unlock premium features without spending a dime. Get your unique referral link and start earning credits today!",
  url: "https://aiplagreport.com/earn",
  mainEntity: {
    "@type": "HowTo",
    name: "How to Earn Free Report Credits",
    step: [
      {
        "@type": "HowToStep",
        name: "Log In",
        text: "First, log into your account"
      },
      {
        "@type": "HowToStep",
        name: "Get Your Link",
        text: "Copy your unique referral link"
      },
      {
        "@type": "HowToStep",
        name: "Share With Friends",
        text: "Send your link to friends via email, social media, or messaging apps"
      }
    ]
  }
};

export { 
  config, 
  productJsonLd, 
  faqJsonLd, 
  organizationJsonLd,
  socialProfileJsonLd, 
  breadcrumbJsonLd,
  earnPageJsonLd 
};
