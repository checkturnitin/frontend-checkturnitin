import './globals.css';
import { appName } from '@/utils/utils';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { config } from '../../next-seo.config';

// Initialize Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://aiplagreport.com'),
  keywords: config.additionalMetaTags?.find(tag => tag.name === 'keywords')?.content,
  authors: [{ name: 'Aiplagreport' }],
  creator: 'Aiplagreport',
  publisher: 'Aiplagreport',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://aiplagreport.com',
  },


  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
  },
  category: 'technology',
  title: 'AIplagreport - Advanced Plagiarism Detection and AI Report',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Advanced plagiarism detection tool with AI-powered content analysis. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide." />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Aiplagreport - Advanced Plagiarism Detection Tool",
              "url": "https://aiplagreport.com",
              "description": "Advanced plagiarism detection tool with AI-powered content analysis. Get instant similarity reports, detailed analysis, and 99.9% accuracy. Used by 10,000+ educators worldwide.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aiplagreport.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Aiplagreport",
                "url": "https://aiplagreport.com"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aiplagreport",
              "url": "https://aiplagreport.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://aiplagreport.com/assets/images/logo.png"
              },
              "sameAs": [
                "https://twitter.com/aiplagreport",
                "https://www.linkedin.com/company/aiplagreport"
              ]
            }),
          }}
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        
        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AIplagreport - Advanced Plagiarism Detection and AI Report" />
        
        {/* Mobile specific meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://Aiplagreport.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Pricing",
          "item": "https://Aiplagreport.com/pricing",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Earn",
          "item": "https://Aiplagreport.com/earn",
        },
      ],
    }),
  }}
/>

        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-57GR72GV');
            `,
          }}
        /> */}

        {/* Tawk.to Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/68538e4ab95e311917874709/1iu367lc6';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />

      </head>
      <body className={`${inter.className} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        {children}
        <GoogleAnalytics gaId="G-KWDVBFHV5W" />
      </body>
    </html>
  );
}
