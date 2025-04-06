import { DefaultSeoProps, BreadCrumbJsonLdProps, SocialProfileJsonLdProps, ProductJsonLdProps, FAQPageJsonLdProps } from "next-seo";

const defaultSEOConfig: DefaultSeoProps = {
  title: "Aiplagreport - Reliable Turnitin Check & Plagiarism Detection",
  titleTemplate: "%s | Aiplagreport",
  description: 
     "Ensure your content is plagiarism-free with Aiplagreport. Trusted by educators and institutions for accurate Turnitin checks and comprehensive plagiarism detection.",
  canonical: "https://aiplagreport.com/",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiplagreport.com/",
    siteName: "Aiplagreport",
    title: "Aiplagreport - Reliable Turnitin Check | Trusted by Educators",
    description: 
      "Ensure your content is plagiarism-free with our reliable Turnitin check platform. Trusted by educators and institutions for accurate plagiarism detection and comprehensive reports.",
      images: [
        {
          url: "https://aiplagreport.com/assets/images/og-image.png", // Must be absolute URL
          width: 1200,
          height: 630,
          alt: "Aiplagreport - Reliable Turnitin Check Platform",
          type: "image/png",
        },
        {
          // Square image for platforms that prefer it (e.g., WhatsApp)
          url: "https://aiplagreport.com/assets/images/og-square.png",
          width: 600,
          height: 600,
          alt: "Aiplagreport Logo",
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
        content: "Check Turnitin, Turnitin Check, Plagiarism Detection, Plagiarism Checker, Turnitin Alternative, Plagiarism Reports, Academic Integrity, Content Authenticity, Plagiarism Prevention, Aiplagreport Platform, Reliable Plagiarism Detection, Turnitin for Educators, Turnitin for Institutions, Accurate Plagiarism Reports, Plagiarism Detection Tool, Turnitin Compatible, Plagiarism Detection Software, Turnitin Check Service, Plagiarism Checker for Students, Plagiarism Checker for Teachers, Plagiarism Checker for Institutions, Turnitin Check Online, Turnitin Check Platform, Turnitin Check Tool, Turnitin Check Service Online, Turnitin Check Solution, Turnitin Check Website",
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
        content: "Aiplagreport - Reliable Turnitin Check Platform",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Aiplagreport",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "author",
        content: "Aiplagreport",
      },
      {
        name: "thumbnail",
        content: "https://aiplagreport.com/assets/images/og-image.png",
      },
      {
        property: "fb:app_id",
        content: "YOUR_FACEBOOK_APP_ID",
      },
      {
        name: "slack-app-id",
        content: "YOUR_SLACK_APP_ID",
      },
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "theme-color",
        content: "#000000",
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
  ],
};

const productJsonLd: ProductJsonLdProps = {
  type: "Product",
  name: "Aiplagreport Plagiarism Detection Suite",
  productName: "Aiplagreport Plagiarism Detection Suite",
  description: "Comprehensive plagiarism detection platform with accurate Turnitin checks and detailed reports. Trusted by educators and institutions for ensuring academic integrity.",
  image: "/assets/images/pricing.png",
  brand: "Aiplagreport",
  offers: {
    "@type": "Offer",
    price: "999",
    priceCurrency: "USD",
    seller: {
      "@type": "Organization",
      name: "Aiplagreport",
    },
  },

};

const faqJsonLd: FAQPageJsonLdProps = {
  mainEntity: [
    {
      questionName: "How does Aiplagreport ensure accurate plagiarism detection?",
      acceptedAnswerText: "Aiplagreport uses advanced algorithms and comprehensive databases to provide accurate plagiarism detection. Our platform ensures that all content is thoroughly checked and reports are detailed and reliable.",
    },
    {
      questionName: "What makes Aiplagreport the leading solution in the market?",
      acceptedAnswerText: "Aiplagreport combines advanced technology, comprehensive databases, and years of research to deliver unmatched results. We offer the highest accuracy in the industry, trusted by educators and institutions worldwide.",
    },
    {
      questionName: "Is Aiplagreport suitable for educational institutions?",
      acceptedAnswerText: "Absolutely. Aiplagreport is the preferred choice for educators and institutions. Our platform includes detailed reports, advanced analytics, and dedicated support to meet specific academic needs.",
    },
    {
      questionName: "How quickly can Aiplagreport process content?",
      acceptedAnswerText: "Our advanced processing engine handles content in real-time, with most texts being checked within seconds. Educators and institutions benefit from priority processing and can check unlimited content through our platform.",
    },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aiplagreport",
  url: "https://aiplagreport.com",
  logo: "/assets/images/logo.png",
  sameAs: [
    "https://twitter.com/aiplagreport",
    "https://www.linkedin.com/company/aiplagreport",
    "https://www.youtube.com/aiplagreport",
    "https://www.facebook.com/aiplagreport",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Nepali"],
    email: "support@aiplagreport.com",
    telephone: "+977-9767473470",
  },
};

const socialProfileJsonLd: SocialProfileJsonLdProps = {
  type: "Organization",
  name: "Aiplagreport",
  url: "https://aiplagreport.com",
  sameAs: [
    "https://twitter.com/aiplagreport",
    "https://www.linkedin.com/company/aiplagreport",
    "https://www.youtube.com/aiplagreport",
    "https://www.facebook.com/aiplagreport",
  ],
};

const breadcrumbJsonLd: BreadCrumbJsonLdProps = {
  itemListElements: [
    {
      position: 1,
      name: "Home",
      item: "https://aiplagreport.com/",
    },
    {
      position: 2,
      name: "Pricing",
      item: "https://aiplagreport.com/pricing",
    },
    { 
      position: 3, 
      name: "Earn", 
      item: "https://aiplagreport.com/earn",
    },
  ],
};

export { 
  defaultSEOConfig, 
  productJsonLd, 
  faqJsonLd, 
  organizationJsonLd,
  socialProfileJsonLd, 
  breadcrumbJsonLd 
};
