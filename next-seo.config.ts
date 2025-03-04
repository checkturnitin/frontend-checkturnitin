import { DefaultSeoProps, BreadCrumbJsonLdProps, SocialProfileJsonLdProps, ProductJsonLdProps, FAQPageJsonLdProps } from "next-seo";

const defaultSEOConfig: DefaultSeoProps = {
  title: "CheckTurnitin - Reliable Turnitin Check & Plagiarism Detection",
  titleTemplate: "%s | CheckTurnitin",
  description: 
     "Ensure your content is plagiarism-free with CheckTurnitin. Trusted by educators and institutions for accurate Turnitin checks and comprehensive plagiarism detection.",
  canonical: "https://checkturnitin.com/",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://checkturnitin.com/",
    siteName: "CheckTurnitin",
    title: "CheckTurnitin - Reliable Turnitin Check | Trusted by Educators",
    description: 
      "Ensure your content is plagiarism-free with our reliable Turnitin check platform. Trusted by educators and institutions for accurate plagiarism detection and comprehensive reports.",
      images: [
        {
          url: "https://checkturnitin.com/assets/images/og-image.png", // Must be absolute URL
          width: 1200,
          height: 630,
          alt: "CheckTurnitin - Reliable Turnitin Check Platform",
          type: "image/png",
        },
        {
          // Square image for platforms that prefer it (e.g., WhatsApp)
          url: "https://checkturnitin.com/assets/images/og-square.png",
          width: 600,
          height: 600,
          alt: "CheckTurnitin Logo",
          type: "image/png",
        }
      ],
    },
    twitter: {
      handle: "@checkturnitin",
      site: "@checkturnitin",
      cardType: "summary_large_image",
    },
    additionalMetaTags: [
      {
        name: "keywords",
        content: "Check Turnitin, Turnitin Check, Plagiarism Detection, Plagiarism Checker, Turnitin Alternative, Plagiarism Reports, Academic Integrity, Content Authenticity, Plagiarism Prevention, CheckTurnitin Platform, Reliable Plagiarism Detection, Turnitin for Educators, Turnitin for Institutions, Accurate Plagiarism Reports, Plagiarism Detection Tool, Turnitin Compatible, Plagiarism Detection Software, Turnitin Check Service, Plagiarism Checker for Students, Plagiarism Checker for Teachers, Plagiarism Checker for Institutions, Turnitin Check Online, Turnitin Check Platform, Turnitin Check Tool, Turnitin Check Service Online, Turnitin Check Solution, Turnitin Check Website",
      },
      {
        property: "og:image:secure_url",
        content: "https://checkturnitin.com/assets/images/og-image.png",
      },
      {
        property: "og:video:secure_url",
        content: "https://checkturnitin.com/assets/videos/demo.mp4",
      },
      {
        property: "og:image:alt",
        content: "CheckTurnitin - Reliable Turnitin Check Platform",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "CheckTurnitin",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "author",
        content: "CheckTurnitin",
      },
      {
        name: "thumbnail",
        content: "https://checkturnitin.com/assets/images/og-image.png",
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
  name: "CheckTurnitin Plagiarism Detection Suite",
  productName: "CheckTurnitin Plagiarism Detection Suite",
  description: "Comprehensive plagiarism detection platform with accurate Turnitin checks and detailed reports. Trusted by educators and institutions for ensuring academic integrity.",
  image: "/assets/images/pricing.png",
  brand: "CheckTurnitin",
  offers: {
    "@type": "Offer",
    price: "999",
    priceCurrency: "USD",
    seller: {
      "@type": "Organization",
      name: "CheckTurnitin",
    },
  },

};

const faqJsonLd: FAQPageJsonLdProps = {
  mainEntity: [
    {
      questionName: "How does CheckTurnitin ensure accurate plagiarism detection?",
      acceptedAnswerText: "CheckTurnitin uses advanced algorithms and comprehensive databases to provide accurate plagiarism detection. Our platform ensures that all content is thoroughly checked and reports are detailed and reliable.",
    },
    {
      questionName: "What makes CheckTurnitin the leading solution in the market?",
      acceptedAnswerText: "CheckTurnitin combines advanced technology, comprehensive databases, and years of research to deliver unmatched results. We offer the highest accuracy in the industry, trusted by educators and institutions worldwide.",
    },
    {
      questionName: "Is CheckTurnitin suitable for educational institutions?",
      acceptedAnswerText: "Absolutely. CheckTurnitin is the preferred choice for educators and institutions. Our platform includes detailed reports, advanced analytics, and dedicated support to meet specific academic needs.",
    },
    {
      questionName: "How quickly can CheckTurnitin process content?",
      acceptedAnswerText: "Our advanced processing engine handles content in real-time, with most texts being checked within seconds. Educators and institutions benefit from priority processing and can check unlimited content through our platform.",
    },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CheckTurnitin",
  url: "https://checkturnitin.com",
  logo: "/assets/images/logo.png",
  sameAs: [
    "https://twitter.com/checkturnitin",
    "https://www.linkedin.com/company/checkturnitin",
    "https://www.youtube.com/checkturnitin",
    "https://www.facebook.com/checkturnitin",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Nepali"],
    email: "support@checkturnitin.com",
    telephone: "+977-9767473470",
  },
};

const socialProfileJsonLd: SocialProfileJsonLdProps = {
  type: "Organization",
  name: "CheckTurnitin",
  url: "https://checkturnitin.com",
  sameAs: [
    "https://twitter.com/checkturnitin",
    "https://www.linkedin.com/company/checkturnitin",
    "https://www.youtube.com/checkturnitin",
    "https://www.facebook.com/checkturnitin",
  ],
};

const breadcrumbJsonLd: BreadCrumbJsonLdProps = {
  itemListElements: [
    {
      position: 1,
      name: "Home",
      item: "https://checkturnitin.com/",
    },
    {
      position: 2,
      name: "Pricing",
      item: "https://checkturnitin.com/pricing",
    },
    { 
      position: 3, 
      name: "Earn", 
      item: "https://checkturnitin.com/earn",
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
