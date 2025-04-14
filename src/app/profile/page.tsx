"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { serverURL } from "@/utils/utils";

import {
  FiCopy,
  FiShoppingCart,
  FiDollarSign,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiDownload,
  FiGift,
  FiTrash2,
} from "react-icons/fi";
import MinidenticonImg from "./MinidenticonImg";
import Header from "../header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface User {
  name: string;
  email: string;
  credits: number;
  referralCode: string;
  planType: string;
  telegramId?: string | null;
}

interface Purchase {
  _id: string;
  item: string;
  amount: number;
  paymentMethod: string;
  date: string;
  invoiceId: string;
}

interface ExpirationCheck {
  message: string;
  user: {
    userId: string;
    planType: string;
    credits: number;
    expirationDate: string | null;
  };
}

interface Order {
  _id: string;
  item: string;
  status: string;
  date: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCompletedReferrals, setTotalCompletedReferrals] =
    useState<number>(0);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [rewriteCount, setRewriteCount] = useState<number>(-1);
  const [isPurchasesCollapsed, setIsPurchasesCollapsed] = useState(true);
  const [expirationStatus, setExpirationStatus] =
    useState<ExpirationCheck | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState<string>("light");

  // Initialize theme
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      
      
      // Set dark theme if explicitly set to 'dark' or if system prefers dark and no theme is stored
      const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);
      setTheme(isDark ? "dark" : "light");

      // Apply theme to document
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }




      // Listen for theme changes
      const handleStorageChange = () => {
        const updatedTheme = localStorage.getItem("theme");
        const newIsDark = updatedTheme === "dark";
        setTheme(newIsDark ? "dark" : "light");

        if (newIsDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      window.addEventListener("storage", handleStorageChange);
      
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  const deleteAllChecks = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post(
        `${serverURL}/turnitin/deleteAll`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("All checks and associated files deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting checks:", error);
      toast.success("All checks and associated files deleted successfully.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const checkCreditsExpiration = async () => {
    try {
      const response = await axios.get<ExpirationCheck>(
        `${serverURL}/users/check-expiration`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Expiration check response:", response.data);
      setExpirationStatus(response.data);

      if (response.data.message.includes("expired")) {
        setUser((prevUser) => ({
          ...prevUser!,
          credits: response.data.user.credits,
          planType: response.data.user.planType,
        }));
      }
    } catch (error) {
      console.error("Error checking credit expiration:", error);
    }
  };

  const claimTurnitinCredits = async () => {
    try {
      const response = await axios.post(
        `${serverURL}/users/claim-turnitin-credits`,
        { email: user?.email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("Turnitin credits claimed successfully!");

        // Refresh user data to reflect updated credits and plan
        getUser();
      } else {
        toast.error("Failed to claim Turnitin credits.");
      }
    } catch (error) {
      console.error("Error claiming Turnitin credits:", error);
      toast.success("Refreshed");
    }
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await axios.get<{ user: User }>(`${serverURL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User data:", response.data);
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get<Purchase[]>(
        `${serverURL}/shop/purchases`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast.error("Failed to load purchases.");
    }
  };

  useEffect(() => {
    getUser();
    checkCreditsExpiration();
    fetchPurchases();
    claimTurnitinCredits();

    // Set up interval to claim Turnitin credits every 5 minutes
    const intervalId = setInterval(() => {
      claimTurnitinCredits();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleRedirect = () => {
    window.location.href = `/pricing`;
  };

  const copyReferralLink = () => {
    if (user && user.referralCode) {
      const referralLink = `${window.location.origin}/?referral=${user.referralCode}`;
      navigator.clipboard
        .writeText(referralLink)
        .then(() =>
          toast.success("Referral link copied to clipboard!")
        )
        .catch(() =>
          toast.error("Failed to copy referral link.")
        );
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await axios.get(
        `${serverURL}/shop/download-invoice/${invoiceId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-400 dark:text-gray-600">No user data available.</div>
    );
  }

  const referralLink = `${window.location.origin}/?referral=${user.referralCode}`;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <main className="pt-4 sm:pt-9 pb-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md text-gray-900 dark:text-gray-100 rounded-lg">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
                    <MinidenticonImg
                      username={user.email}
                      width={150}
                      height={150}
                      className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full mb-4 sm:mb-0 sm:mr-6"
                    />
                    <div className="text-center sm:text-left w-full">
                      <p className="text-lg sm:text-xl font-semibold mb-2">
                        {user.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 break-all">{user.email}</p>
                      <div className="flex items-center justify-center sm:justify-start">
                        <p className="text-gray-600 dark:text-gray-400 mr-2">Referral Code:</p>
                        <p className="font-semibold">{user.referralCode}</p>
                        <Button
                          variant="ghost"
                          onClick={copyReferralLink}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          <FiCopy />
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Total Completed Referrals: {totalCompletedReferrals}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-white shadow-xl overflow-hidden">
                <CardHeader className="bg-opacity-80 backdrop-blur-sm p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
                    <FiGift className="mr-2" /> Refer Your Friends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-base sm:text-lg mb-4 sm:mb-6">
                    Earn{" "}
                    <span className="font-bold text-yellow-300">
                      1 File credits
                    </span>{" "}
                    for each friend who signs up using your referral code! 🎉
                  </p>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="font-semibold text-center break-all text-sm sm:text-base">
                      {referralLink}
                    </p>
                  </div>
                  <Button
                    onClick={copyReferralLink}
                    className="w-full bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-2 sm:py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center"
                  >
                    <FiCopy className="mr-2" /> Copy Referral Link
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 sm:mb-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md text-gray-900 dark:text-gray-100 rounded-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-black p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  File Credits Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start">
                      <FiFileText className="text-3xl sm:text-4xl text-indigo-600 mr-3 sm:mr-4" />
                      <div>
                        <p className="text-4xl sm:text-6xl font-bold text-indigo-600 mb-2">
                          {user.credits || 0}
                        </p>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                          Available File Credits
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Button
                      onClick={claimTurnitinCredits}
                      className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Refresh Credits
                    </Button>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6">
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Plan Type:
                    </span>{" "}
                    {expirationStatus?.user.planType?.toUpperCase() || "N/A"}
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={handleRedirect}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-102"
                  >
                    Upgrade Your Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 sm:mb-12 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-indigo-500">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <Link href="/pricing" className="w-full">
                    <Card className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-indigo-500 h-full">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <FiShoppingCart className="text-4xl sm:text-5xl text-indigo-600 mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Purchase
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          Buy credits or upgrade your plan
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/earn" className="w-full">
                    <Card className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-indigo-500 h-full">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <FiDollarSign className="text-4xl sm:text-5xl text-indigo-600 mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Earn
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          Refer friends and earn credits
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Card 
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-red-500 h-full"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <FiTrash2 className="text-4xl sm:text-5xl text-red-600 mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Delete All Checks
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Permanently delete all your checks and files
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 sm:mb-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md text-gray-900 dark:text-gray-100 rounded-lg">
              <CardHeader className="flex items-center justify-between cursor-pointer bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-black p-4 sm:p-6">
                <div
                  className="flex items-center flex-grow"
                  onClick={() => setIsPurchasesCollapsed(!isPurchasesCollapsed)}
                >
                  <CardTitle className="flex items-center text-gray-900 dark:text-gray-100 text-lg sm:text-xl">
                    Recent Purchases
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <FiInfo className="ml-2 text-gray-600 dark:text-gray-400 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-gray-900 p-2 rounded shadow-lg">
                          <p>
                            If you have any issues with purchases, please open a
                            ticket in our Discord server.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  {isPurchasesCollapsed ? (
                    <FiChevronDown className="text-xl ml-2 text-gray-900 dark:text-gray-100" />
                  ) : (
                    <FiChevronUp className="text-xl ml-2 text-gray-900 dark:text-gray-100" />
                  )}
                </div>
              </CardHeader>

              {!isPurchasesCollapsed && (
                <CardContent className="p-4 sm:p-6">
                  {purchases.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table className="text-gray-900 dark:text-gray-100">
                        <TableHead>
                          <TableRow className="bg-indigo-100 dark:bg-gray-800">
                            <TableHead className="text-indigo-700 dark:text-indigo-300 font-semibold whitespace-nowrap">
                              Item
                            </TableHead>
                            <TableHead className="text-indigo-700 font-semibold whitespace-nowrap">
                              Amount
                            </TableHead>
                            <TableHead className="text-indigo-700 font-semibold whitespace-nowrap">
                              Payment Method
                            </TableHead>
                            <TableHead className="text-indigo-700 font-semibold whitespace-nowrap">
                              Date
                            </TableHead>
                            <TableHead className="text-indigo-700 font-semibold whitespace-nowrap">
                              Invoice
                            </TableHead>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {purchases.map((purchase) => (
                            <TableRow
                              key={purchase._id}
                              className="hover:bg-indigo-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                              <TableCell className="whitespace-nowrap">{purchase.item}</TableCell>
                              <TableCell className="whitespace-nowrap">${purchase.amount.toFixed(2)}</TableCell>
                              <TableCell className="whitespace-nowrap">{purchase.paymentMethod}</TableCell>
                              <TableCell className="whitespace-nowrap">{purchase.date}</TableCell>
                              <TableCell className="text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors duration-200 whitespace-nowrap">
                                {purchase.invoiceId ? (
                                  <button
                                    onClick={() =>
                                      downloadInvoice(purchase.invoiceId)
                                    }
                                    className="flex items-center"
                                  >
                                    Download
                                    <FiDownload className="ml-1" />
                                  </button>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      No purchases yet.
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              This will permanently delete all your checks and associated files. 
              <span className="font-bold text-red-500"> This action cannot be undone.</span>
            </p>
            <div className="flex justify-end space-x-4 text-white">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteAllChecks}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete All"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" richColors />
    </>
  );
}