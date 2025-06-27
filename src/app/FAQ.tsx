"use client";

import React, { useEffect } from "react";
import { NextSeo } from "next-seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqJsonLd } from "../../next-seo.config";

export function FAQSection() {
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map(({ id, question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <NextSeo
        title="Frequently Asked Questions | aiplagreport"
        description="Find answers to common questions about aiplagreport, an online tool for checking plagiarism reports with accuracy."
        openGraph={{
          type: "website",
          title: "Frequently Asked Questions | aiplagreport",
          description:
            "Find answers to common questions about aiplagreport, an online tool for checking plagiarism reports with accuracy.",
          images: [
            {
              url: "/assets/images/faq.png",
              width: 1200,
              height: 630,
              alt: "aiplagreport - FAQ Section",
            },
          ],
        }}
        twitter={{
          handle: "@aiplagreport",
          site: "@aiplagreport",
          cardType: "summary_large_image",
        }}
      />
    
      <section className="flex items-center justify-center min-h-screen py-16 bg-white dark:bg-black dark:text-white">
        <div className="container max-w-4xl px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden">
            <Accordion
              type="single"
              collapsible
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {faqData.map(({ id, question, answer }) => (
                <AccordionItem key={id} value={`item-${id}`}>
                  <AccordionTrigger className="text-lg font-medium hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 px-6 py-4">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300 leading-relaxed px-6 py-4 bg-gray-50 dark:bg-gray-900">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}

const faqData = [
  {
    id: 1,
    question: "What is aiplagreport?",
    answer:
      "aiplagreport is an online tool that allows users to check plagiarism similarity reports with accuracy and ease.",
  },
  {
    id: 2,
    question: "Will my credits expire?",
    answer:
      "Yes, your credits will expire in 1 year, but they are expandable if needed.",
  },
  {
    id: 3,
    question: "Will my document be saved to the plagiarism detection system?",
    answer:
      "No, aiplagreport does not save your document to any plagiarism detection database. Your file remains private and secure.",
  },
  {
    id: 4,
    question: "Is aiplagreport free to use?",
    answer:
      "aiplagreport offers both free and premium plans, allowing users to choose the best option for their needs.",
  },
  {
    id: 5,
    question: "How accurate is aiplagreport?",
    answer:
      "aiplagreport provides highly accurate plagiarism reports by integrating with official plagiarism detection systems.",
  },
  {
    id: 6,
    question: "Is my data safe with aiplagreport?",
    answer:
      "Yes, we prioritize security and do not store your uploaded files. Your privacy is our top concern.",
  },
  {
    id: 7,
    question: "Can I check multiple files at once?",
    answer:
      "Yes, aiplagreport allows bulk uploads for users who need to check multiple documents efficiently.",
  },
];

export default FAQSection;