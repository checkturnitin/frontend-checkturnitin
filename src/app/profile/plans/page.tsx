"use client";

import { useState, Suspense } from "react";  // Import Suspense
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ElegantFooter from "@/app/last";

// Plans Data
const plans = [
  {
    name: "Basic",
    description: "Perfect for getting started",
    benefits: ["Basic features", "Community support", "Core functionality"],
  },
  {
    name: "Pro",
    description: "Ideal for growing teams",
    benefits: [
      "All Basic features",
      "Priority support",
      "Advanced features",
      "API access",
    ],
  },
  {
    name: "Pro+",
    description: "For professional teams",
    benefits: [
      "All Pro features",
      "24/7 support",
      "Custom solutions",
      "Dedicated account manager",
    ],
  },
];

// Plan Card Component
const PlanCard = ({
  plan,
  isCurrentPlan,
  onClick,
  onUpgradeClick,
}: {
  plan: any;
  isCurrentPlan: boolean;
  onClick: () => void;
  onUpgradeClick: () => void;
}) => (
  <div
    className={`bg-neutral-800 p-8 rounded-lg text-white max-w-md w-full flex flex-col justify-between
      ${isCurrentPlan ? "border-2 border-[#9c40ff]" : "border border-neutral-700"}
      shadow-lg hover:shadow-xl transition-shadow duration-300`}
  >
    <div>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold">{plan.name}</h2>
        {isCurrentPlan && (
          <span className="bg-[#9c40ff] text-xs px-2 py-1 rounded-full">
            Current Plan
          </span>
        )}
      </div>
      <p className="text-neutral-400 mb-8">{plan.description}</p>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Features:</h3>
        <ul className="space-y-3">
          {plan.benefits.map((benefit: string, index: number) => (
            <li key={index} className="flex items-center text-neutral-300">
              <svg
                className="w-6 h-6 mr-3 text-[#ffaa40]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <button
      onClick={isCurrentPlan ? onClick : onUpgradeClick}
      className="w-full bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-white font-semibold py-4 px-5 rounded-lg text-lg transition-all duration-200"
    >
      {isCurrentPlan ? "View Details" : "Upgrade Plan"}
    </button>
  </div>
);

// Main Plans Page Component
const PlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const searchParams = useSearchParams();
  const yourPlan = searchParams.get("yourplan");

  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleUpgradeClick = () => {
    window.location.href = "/pricing"; // Redirect to the /pricing page for upgrades
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <Link
          href="/profile"
          className="inline-flex items-center text-white hover:text-[#9c40ff] transition-colors"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Profile
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[1200px]">
          <h1 className="text-4xl font-bold text-center mb-12 text-white">
            Available Plans
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 justify-items-center">
            {plans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                isCurrentPlan={plan.name.toLowerCase() === yourPlan?.toLowerCase()}
                onClick={() => handlePlanClick(plan)}
                onUpgradeClick={handleUpgradeClick}
              />
            ))}
          </div>

          {/* Selected Plan Details */}
          {selectedPlan && (
            <div className="mt-10 bg-neutral-900 text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-6">{selectedPlan.name} Details</h2>
              <p className="mb-4">{selectedPlan.description}</p>
              <h3 className="text-2xl font-semibold mb-4">Benefits:</h3>
              <ul className="list-disc pl-6 space-y-2">
                {selectedPlan.benefits.map((benefit: string, index: number) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(null)}
                className="mt-6 bg-red-600 hover:bg-red-700 transition-colors text-white py-3 px-6 rounded-lg text-lg"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <ElegantFooter />
    </div>
  );
};

const WrappedPlansPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PlansPage />
  </Suspense>
);

export default WrappedPlansPage;
