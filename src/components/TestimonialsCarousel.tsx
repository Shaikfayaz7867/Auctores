import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Badge } from './ui/Badge';

export const TestimonialsCarousel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      image: '/client1.jpg',
      text: 'Dear Grace Pierce, Editorial Coordinator of Journal of Clinical Research and Reports, Thank you for the speedy and efficient peer review process. I appreciate the fact that your peer reviewers do not take months to respond like with some other journals. I would also like to thank the editorial office for responding quickly to my questions. It is an excellent journal. I plan to submit more manuscripts in the future.',
      author: 'Robert W. McGee'
    },
    {
      image: '/client2.jpg',
      text: 'Dear Grace Pierce, Editorial Coordinator of Journal of Clinical Research and Reports, Working with you and your team on our recent publication in JCRR has been a truly wonderful and enjoyable experience. The responses were prompt, and the reviewers were patient, constructive, and highly professional. One reviewer in particular gave me the feeling that a professor was carefully reading and commenting on my coursework, which was deeply touching.',
      author: 'DR Aibing Rao, Head of R&D'
    },
    {
      image: '/client3.jpg',
      text: 'I Appreciate the Opportunity to Share my Experience with the Journal of Clinical Research and Reports. The peer review process was timely and constructive, and the feedback provided helped improve the quality of our manuscript. The editorial office was professional, responsive, and supportive throughout the process, ensuring smooth communication and efficient handling of the submission.',
      author: 'Anonymous Author'
    },
    {
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
      text: 'Dear Mercy Grace, Editorial Coordinator of Obstetrics Gynecology and Reproductive Sciences, We would like to express our gratitude for your help at all stages of publishing and editing the article. The editors of the magazine answer all the necessary questions and help at every stage. We will definitely continue to cooperate and publish other works in the Obstetrics Gynecology and Reproductive Sciences!',
      author: 'Alla Konstantinovna Politova'
    },
    {
      image: '/client5.png',
      text: 'Dear Maria Emerson, Editorial Coordinator of International Journal of Clinical Case Reports and Reviews, What distinguishes International Journal of Clinical Case Report and Review is not only the scientific rigor of its publications, but the intellectual climate in which research is evaluated. The submission process is refreshingly free of unnecessary formal barriers and bureaucratic rituals.',
      author: 'Prof. Perlat Kapisyzi, FCCP, PULMONOLOGIST AND THORACIC IMAGING'
    },
    {
      image: '/client6.jpg',
      text: 'We have published several articles in the Auctores Publishing, LLC, journal, Clinical Medical Reviews and Reports in recent years (CMRR). This is an "open access" journal and the following are our observations. From the initial invitation to submit an article, to the final edits of galley proofs, we have found CMRR personnel to be professional, responsive, rapid and thorough.',
      author: 'Grateful Author(s)'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="bg-slate-50 dark:bg-slate-900/40 py-16 px-6 border-y border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl flex flex-col gap-10">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <Badge variant="secondary" className="mx-auto">Author Testimonials</Badge>
          <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">What Our Authors Say</h2>
        </div>

        <div className="relative">
          {/* Testimonial Display */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-950 shadow-xl border border-slate-200 dark:border-slate-800 min-h-[400px]">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentTestimonial ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 h-full">
                  {/* Image with reduced opacity */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt="Testimonial"
                      className="h-64 w-64 md:h-80 md:w-80 object-cover rounded-2xl opacity-40"
                    />
                  </div>

                  {/* Testimonial Text */}
                  <div className="flex flex-col gap-4 flex-grow">
                    <p className="text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed italic font-medium">
                      {testimonial.text}
                    </p>
                    <p className="text-sm md:text-base font-bold text-[#8B0000] dark:text-red-400">
                      — {testimonial.author}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-all hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-all hover:scale-110"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentTestimonial ? 'w-8 bg-[#8B0000]' : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
