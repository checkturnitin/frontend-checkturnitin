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
        <main className="pt-9 pb-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md text-gray-900 dark:text-gray-100 rounded-lg">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <MinidenticonImg
                      username={user.email}
                      width={150}
                      height={150}
                      className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full mr-6"
                    />
                    <div className="max-w-full overflow-hidden flex flex-col sm:flex-row sm:justify-between w-full">
                      <div className="mb-4 sm:mb-0">
                        <p className="text-xl font-semibold mb-2">
                          {user.name}
                        </p>
                        <p className="text-gray-600 mb-2">{user.email}</p>
                        <div className="flex items-center">
                          <p className="text-gray-600 mr-2">Referral Code:</p>
                          <p className="font-semibold">{user.referralCode}</p>
                          <Button
                            variant="ghost"
                            onClick={copyReferralLink}
                            className="ml-2 text-gray-600 hover:text-gray-800"
                          >
                            <FiCopy />
                          </Button>
                        </div>
                        <p className="text-gray-600 mt-2">
                          Total Completed Referrals: {totalCompletedReferrals}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Button
                          variant="default"
                          className={`text-gray-900 font-semibold py-2 px-4 rounded-lg relative ${
                            expirationStatus?.user.planType === "basic"
                              ? "bg-gray-200 hover:bg-gray-300 border border-gray-300"
                              : "border-2 border-transparent"
                          }`}
                          style={{
                            background:
                              expirationStatus?.user.planType !== "basic"
                                ? "linear-gradient(to right, #ffffff, #ffffff) padding-box, linear-gradient(to right, #ffaa40, #9c40ff) border-box"
                                : undefined,
                            backgroundClip:
                              expirationStatus?.user.planType !== "basic"
                                ? "padding-box, border-box"
                                : undefined,
                          }}
                          onClick={handleRedirect}
                        >
                          {expirationStatus?.user.planType?.toUpperCase()}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-white shadow-xl overflow-hidden">
                <CardHeader className="bg-opacity-80 backdrop-blur-sm">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FiGift className="mr-2" /> Refer Your Friends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-lg mb-6">
                    Earn{" "}
                    <span className="font-bold text-yellow-300">
                      1 File credits
                    </span>{" "}
                    for each friend who signs up using your referral code! 🎉
                  </p>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <p className="font-semibold text-center break-all">
                      {referralLink}
                    </p>
                  </div>
                  <Button
                    onClick={copyReferralLink}
                    className="w-full bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center"
                  >
                    <FiCopy className="mr-2" /> Copy Referral Link
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md text-gray-900 dark:text-gray-100 rounded-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-black p-6">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  File Credits Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <div className="flex items-center">
                      <FiFileText className="text-4xl text-indigo-600 mr-4" />
                      <div>
                        <p className="text-6xl font-bold text-indigo-600 mb-2">
                          {user.credits || 0}
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          Available File Credits
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={claimTurnitinCredits}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Refresh Credits
                    </Button>
                    {/* <Button
                      onClick={claimTurnitinCredits}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Claim Credits
                    </Button> */}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
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
                <div className="mt-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {/* <p className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                          Credit Expiration Date:
                          <span className="text-gray-900 dark:text-gray-100 font-semibold ml-2">
                            {expirationStatus?.user.expirationDate?.split("T")[0] || "N/A"}
                          </span>
                          {expirationStatus?.user.expirationDate && (
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              ({(() => {
                                const expirationDate = new Date(expirationStatus.user.expirationDate)
                                const today = new Date()
                                const timeDifference = expirationDate.getTime() - today.getTime()
                                const daysToExpire = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
                                return `${daysToExpire} day${daysToExpire !== 1 ? "s" : ""} left`
                              })()})
                            </span>
                          )}
                        </p> */}
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-gray-900 p-2 rounded shadow-lg">
                        {expirationStatus?.user.expirationDate
                          ? "Your credits will expire if not renewed."
                          : "No expiration date available."}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {expirationStatus?.user.expirationDate &&
                  (() => {
                    const expirationDate = new Date(
                      expirationStatus.user.expirationDate
                    );
                    const today = new Date();
                    const timeDifference =
                      expirationDate.getTime() - today.getTime();
                    const daysToExpire = Math.ceil(
                      timeDifference / (1000 * 60 * 60 * 24)
                    );

                    if (daysToExpire < 0) {
                      return (
                        <p className="mt-2 text-sm text-red-400">
                          Warning: Your credits have expired!
                        </p>
                      );
                    } else if (daysToExpire <= 30) {
                      return (
                        <p className="mt-2 text-sm text-yellow-400">
                          Your credits are going to expire in {daysToExpire}{" "}
                          days. Renew fast!
                        </p>
                      );
                    }
                    return null;
                  })()}
              </CardContent>
            </Card>

            <Card className="mb-12 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/pricing">
                    <Card className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-indigo-500">
                      <CardContent className="flex flex-col items-center justify-center p-8">
                        <FiShoppingCart className="text-5xl text-indigo-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Purchase
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          Buy credits or upgrade your plan
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/earn">
                    <Card className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-indigo-500">
                      <CardContent className="flex flex-col items-center justify-center p-8">
                        <FiDollarSign className="text-5xl text-indigo-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Earn
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          Refer friends and earn credits
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Card 
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded-lg shadow-lg border-2 border-red-500"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-8">
                      <FiTrash2 className="text-5xl text-red-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
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

            <Card className="mb-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md text-gray-900 dark:text-gray-100 rounded-lg">
              <CardHeader className="flex items-center justify-between cursor-pointer bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-black">
                <div
                  className="flex items-center flex-grow"
                  onClick={() => setIsPurchasesCollapsed(!isPurchasesCollapsed)}
                >
                  <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
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
                <CardContent>
                  {purchases.length > 0 ? (
                    <Table className="text-gray-900 dark:text-gray-100">
                      <TableHead>
                        <TableRow className="bg-indigo-100 dark:bg-gray-800">
                          <TableHead className="text-indigo-700 dark:text-indigo-300 font-semibold">
                            Item
                          </TableHead>
                          <TableHead className="text-indigo-700 font-semibold">
                            Amount
                          </TableHead>
                          <TableHead className="text-indigo-700 font-semibold">
                            Payment Method
                          </TableHead>
                          <TableHead className="text-indigo-700 font-semibold">
                            Date
                          </TableHead>
                          <TableHead className="text-indigo-700 font-semibold">
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
                            <TableCell>{purchase.item}</TableCell>
                            <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                            <TableCell>{purchase.paymentMethod}</TableCell>
                            <TableCell>{purchase.date}</TableCell>
                            <TableCell className="text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors duration-200">
                              {purchase.invoiceId ? (
                                <>
                                  <button
                                    onClick={() =>
                                      downloadInvoice(purchase.invoiceId)
                                    }
                                    className="flex items-center"
                                  >
                                    Download
                                    <FiDownload className="ml-1" />
                                  </button>
                                </>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
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