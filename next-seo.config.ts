import { DefaultSeoProps, BreadCrumbJsonLdProps, SocialProfileJsonLdProps, ProductJsonLdProps, FAQPageJsonLdProps } from "next-seo";

const defaultSEOConfig: DefaultSeoProps = {
  title: "Aiplagreport - #1 Turnitin Alternative | AI-Powered Plagiarism Detection",
  titleTemplate: "%s | Aiplagreport - Best Turnitin Alternative",
  description: 
    "Aiplagreport is the leading Turnitin alternative offering 99.9% accurate plagiarism detection. Trusted by 10,000+ educators and institutions worldwide. Get instant plagiarism reports, AI content detection, and comprehensive similarity analysis.",
  canonical: "https://aiplagreport.com/",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiplagreport.com/",
    siteName: "Aiplagreport - Best Turnitin Alternative",
    title: "Aiplagreport - #1 Turnitin Alternative | AI-Powered Plagiarism Detection",
    description: 
      "The most accurate Turnitin alternative for plagiarism detection. Used by 10,000+ educators worldwide. Get instant plagiarism reports, AI content detection, and comprehensive similarity analysis. Start free trial today!",
    images: [
      {
        url: "https://aiplagreport.com/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aiplagreport - Best Turnitin Alternative for Plagiarism Detection",
        type: "image/png",
      },
      {
        url: "https://aiplagreport.com/assets/images/og-square.png",
        width: 600,
        height: 600,
        alt: "Aiplagreport - Leading Turnitin Alternative",
        type: "image/png",
      }
    ],
  },
  twitter: {
    handle: "@aiplagreport",
    site: "@aiplagreport",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content: "Aiplagreport, AI Plagiarism Report, AI Plagiarism Detection, AI Content Detection, AI Writing Detection, AI Text Analysis, AI Plagiarism Checker, AI Similarity Checker, AI Content Analysis, AI Writing Analysis, AI Text Checker, AI Plagiarism Scanner, AI Content Scanner, AI Writing Scanner, AI Text Scanner, AI Plagiarism Tool, AI Content Tool, AI Writing Tool, AI Text Tool, AI Plagiarism Software, AI Content Software, AI Writing Software, AI Text Software, AI Plagiarism System, AI Content System, AI Writing System, AI Text System, AI Plagiarism Solution, AI Content Solution, AI Writing Solution, AI Text Solution, AI Plagiarism Service, AI Content Service, AI Writing Service, AI Text Service, AI Plagiarism Platform, AI Content Platform, AI Writing Platform, AI Text Platform, AI Plagiarism Check, AI Content Check, AI Writing Check, AI Text Check, AI Plagiarism Analysis, AI Content Analysis, AI Writing Analysis, AI Text Analysis, AI Plagiarism Detection Tool, AI Content Detection Tool, AI Writing Detection Tool, AI Text Detection Tool, AI Plagiarism Detection Software, AI Content Detection Software, AI Writing Detection Software, AI Text Detection Software, AI Plagiarism Detection System, AI Content Detection System, AI Writing Detection System, AI Text Detection System, AI Plagiarism Detection Solution, AI Content Detection Solution, AI Writing Detection Solution, AI Text Detection Solution, AI Plagiarism Detection Service, AI Content Detection Service, AI Writing Detection Service, AI Text Detection Service, AI Plagiarism Detection Platform, AI Content Detection Platform, AI Writing Detection Platform, AI Text Detection Platform, AI Plagiarism Detection Check, AI Content Detection Check, AI Writing Detection Check, AI Text Detection Check, AI Plagiarism Detection Analysis, AI Content Detection Analysis, AI Writing Detection Analysis, AI Text Detection Analysis, Turnitin Alternative, Plagiarism Detection, Plagiarism Checker, Academic Integrity, Content Authenticity, Plagiarism Prevention, Best Turnitin Alternative, Plagiarism Reports, Turnitin for Educators, Turnitin for Institutions, Accurate Plagiarism Detection, Plagiarism Detection Tool, Turnitin Compatible, Plagiarism Detection Software, Turnitin Check Service, Plagiarism Checker for Students, Plagiarism Checker for Teachers, Plagiarism Checker for Institutions, Turnitin Check Online, Turnitin Check Platform, Turnitin Check Tool, Turnitin Check Service Online, Turnitin Check Solution, Turnitin Check Website, Similarity Check, Academic Plagiarism Checker, University Plagiarism Detection, College Plagiarism Checker, School Plagiarism Detection, Research Paper Plagiarism Checker, Thesis Plagiarism Checker, Dissertation Plagiarism Checker, Essay Plagiarism Checker, Assignment Plagiarism Checker, Turnitin Alternative Free, Best Plagiarism Checker 2024, Most Accurate Plagiarism Checker, Reliable Plagiarism Detection, Trusted Plagiarism Checker, Professional Plagiarism Detection, Academic Plagiarism Detection, Educational Plagiarism Checker, Institutional Plagiarism Detection, University Plagiarism Checker, College Plagiarism Detection, School Plagiarism Checker, Research Plagiarism Detection, Thesis Plagiarism Detection, Dissertation Plagiarism Detection, Essay Plagiarism Detection, Assignment Plagiarism Detection, AI Writing Detection, AI Content Analysis, AI Text Analysis, AI Plagiarism Detection, AI Similarity Check, AI Content Check, AI Writing Check, AI Text Check, AI Plagiarism Analysis, AI Content Analysis, AI Writing Analysis, AI Text Analysis, AI Plagiarism Detection Tool, AI Content Detection Tool, AI Writing Detection Tool, AI Text Detection Tool, AI Plagiarism Detection Software, AI Content Detection Software, AI Writing Detection Software, AI Text Detection Software, AI Plagiarism Detection System, AI Content Detection System, AI Writing Detection System, AI Text Detection System, AI Plagiarism Detection Solution, AI Content Detection Solution, AI Writing Detection Solution, AI Text Detection Solution, AI Plagiarism Detection Service, AI Content Detection Service, AI Writing Detection Service, AI Text Detection Service, AI Plagiarism Detection Platform, AI Content Detection Platform, AI Writing Detection Platform, AI Text Detection Platform, AI Plagiarism Detection Check, AI Content Detection Check, AI Writing Detection Check, AI Text Detection Check, AI Plagiarism Detection Analysis, AI Content Detection Analysis, AI Writing Detection Analysis, AI Text Detection Analysis",
    },
    {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    {
      name: "googlebot",
      content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    {
      name: "bingbot",
      content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    {
      property: "og:image:secure_url",
      content: "https://aiplagreport.com/assets/images/og-image.png",
    },
    {
      property: "og:video:secure_url",
      content: "https://aiplagreport.com/assets/videos/demo.mp4",
    },
    {
      property: "og:image:alt",
      content: "Aiplagreport - Best Turnitin Alternative for Plagiarism Detection",
    },
    {
      name: "apple-mobile-web-app-title",
      content: "Aiplagreport - Best Turnitin Alternative",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "author",
      content: "Aiplagreport - Leading Turnitin Alternative",
    },
    {
      name: "thumbnail",
      content: "https://aiplagreport.com/assets/images/og-image.png",
    },
    {
      name: "mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "theme-color",
      content: "#000000",
    },
    {
      name: "application-name",
      content: "Aiplagreport",
    },
    {
      name: "msapplication-TileColor",
      content: "#000000",
    },
    {
      name: "msapplication-config",
      content: "/browserconfig.xml",
    },
    {
      name: "revisit-after",
      content: "7 days",
    },
    {
      name: "distribution",
      content: "global",
    },
    {
      name: "rating",
      content: "general",
    },
    {
      name: "coverage",
      content: "Worldwide",
    },
    {
      name: "target",
      content: "all",
    },
    {
      name: "audience",
      content: "all",
    },
    {
      name: "document-type",
      content: "Public",
    },
    {
      name: "document-rating",
      content: "Safe for Kids",
    },
    {
      name: "document-state",
      content: "Dynamic",
    },
    {
      name: "resource-type",
      content: "document",
    },
    {
      name: "classification",
      content: "Business",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "alternate",
      href: "https://aiplagreport.com",
      hrefLang: "en-US",
    },
    {
      rel: "canonical",
      href: "https://aiplagreport.com",
    },
    {
      rel: "alternate",
      href: "https://aiplagreport.com",
      hrefLang: "x-default",
    },
    {
      rel: "alternate",
      href: "https://aiplagreport.com",
      hrefLang: "en",
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
  defaultSEOConfig, 
  productJsonLd, 
  faqJsonLd, 
  organizationJsonLd,
  socialProfileJsonLd, 
  breadcrumbJsonLd,
  earnPageJsonLd 
};
