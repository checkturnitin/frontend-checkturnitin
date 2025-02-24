import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, X, Zap } from 'lucide-react'

interface CreditNotificationProps {
  onClose: () => void;
}

export default function CreditNotification({ onClose }: CreditNotificationProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <Card className="w-full max-w-5xl h-[32rem] bg-gray-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 p-[2px] bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] rounded-lg">
          <div className="w-full h-full bg-gray-950 rounded-lg" />
        </div>
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 bg-gray-800 hover:bg-gray-700 transition-colors z-50"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex flex-col md:flex-row h-full relative z-10">
          <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-center text-white mb-6">
                Unlock Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6 flex items-center justify-center">
                <span className="text-6xl font-extrabold bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-transparent bg-clip-text">
                  50% OFF
                </span>
              </div>
              <p className="mb-8 text-xl text-gray-300">
                Elevate your experience! Upgrade now and enjoy an exclusive discount on all packages.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="bg-gray-800 hover:bg-gray-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
                <span className="relative z-10 flex items-center">
                  Explore Pricing
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full" />
              </Button>
            </CardFooter>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center items-center">
            <h2 className="text-5xl font-bold text-center mb-6 text-white">
              NOAIGPT
            </h2>
            <p className="text-2xl text-center text-gray-400 mb-8">stay unique, stay undetectable</p>
            <div className="flex items-center justify-center text-[#ffaa40]">
              <Zap className="w-8 h-8 mr-2" />
              <span className="text-xl font-semibold">Limited Time Offer</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

