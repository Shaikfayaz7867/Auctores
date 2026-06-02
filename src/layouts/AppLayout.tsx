import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] text-slate-900 transition-colors duration-150 selection:bg-primary/20">
      {/* Brand Navigation */}
      <Navbar />

      {/* Main Page Slot with Grid pattern on backgrounds */}
      <main className="flex-grow bg-grid-pattern">
        <Outlet />
      </main>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Brand Footer */}
      <Footer />
    </div>
  );
};
