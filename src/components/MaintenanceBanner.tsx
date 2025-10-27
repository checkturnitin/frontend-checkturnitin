"use client";

import React, { useState, useEffect } from 'react';

export function MaintenanceBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white shadow-lg border-b-2 border-orange-400">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h3 className="text-sm md:text-base font-bold">Site Under Maintenance</h3>
              <p className="text-xs text-orange-100">Will be back up at 6:30 AM UTC</p>
            </div>
          </div>
          <MaintenanceCountdown />
        </div>
      </div>
    </div>
  );
}

function MaintenanceCountdown() {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [currentUTC, setCurrentUTC] = useState<string>("");
  const [currentLocal, setCurrentLocal] = useState<string>("");
  const [hoursLeft, setHoursLeft] = useState<number>(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();
      
      // Set target to 6:30 UTC
      target.setUTCHours(6, 30, 0, 0);
      
      // If current time is after 6:30 UTC, we need tomorrow's 6:30
      if (now.getTime() >= target.getTime()) {
        target.setUTCDate(target.getUTCDate() + 1);
      }
      
      const diff = target.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      setHoursLeft(hours);
      
      // Update current UTC time
      const utcTime = now.toISOString().split('T')[1].split('.')[0];
      setCurrentUTC(utcTime);
      
      // Update current local time
      const localTime = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentLocal(localTime);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs text-orange-100">Your Local Time</p>
          <p className="text-xs font-mono font-bold">{currentLocal}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs text-orange-100">Current UTC Time</p>
          <p className="text-xs font-mono font-bold">{currentUTC}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs text-orange-100">Time Left</p>
          <p className="text-xs font-mono font-bold">{timeLeft}</p>
        </div>
      </div>
      <div className="px-2 py-1 bg-white/20 rounded-full">
        <p className="text-sm font-bold">{hoursLeft} hours remaining</p>
      </div>
    </div>
  );
}
