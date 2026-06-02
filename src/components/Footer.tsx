import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Mail, Send, CheckCircle, 
  Phone, MessageSquare, ExternalLink 
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const footerLinks = {
    journals: [
      { label: 'Journal Directory', path: '/journals' },
      { label: 'Article Directory', path: '/articles' },
      { label: 'Special Issues', path: '/journals' },
      { label: 'APC Waiver Program', path: '/about' },
      { label: 'Indexing Services', path: '/about' }
    ],
    services: [
      { label: 'For Authors', path: '/dashboard/author' },
      { label: 'For Reviewers', path: '/dashboard/reviewer' },
      { label: 'For Editors', path: '/dashboard/editor' },
      { label: 'Manuscript Submission', path: '/dashboard/author' },
      { label: 'Editorial Office', path: '/contact' }
    ],
    info: [
      { label: 'Open Access Publishing', path: '/about' },
      { label: 'Publication Ethics', path: '/about' },
      { label: 'Peer Review Process', path: '/about' },
      { label: 'Privacy Policy', path: '/about' },
      { label: 'Terms & Conditions', path: '/about' }
    ],
    offices: [
      { city: 'Basel, Switzerland (HQ)', address: 'St. Alban-Anlage 66, 4052 Basel', phone: '+41 61 683 7734' },
      { city: 'London, United Kingdom', address: '71-75 Shelton Street, Covent Garden', phone: '+44 20 7193 1234' },
      { city: 'Tokyo, Japan', address: '1-6-10 Toranomon, Minato-ku, Tokyo', phone: '+81 3 4567 8901' }
    ]
  };

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t-4 border-[#8B0000]">
      {/* Top Newsletter & Banner Section */}
      <div className="bg-slate-950 px-6 py-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/auct.png"
              alt="Auctores Logo"
              className="h-24 w-28 object-contain"
            />
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-tight">Stay updated with fresh research findings</h3>
              <p className="text-xs text-slate-400 mt-0.5">Subscribe to Auctores Academic general alerts and newsletters</p>
            </div>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
            {subscribed ? (
              <div className="flex h-10 w-full items-center gap-2 rounded-md bg-emerald-950/40 border border-emerald-500/30 px-3 text-emerald-400 text-sm font-medium">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                Subscription success! Thank you for joining.
              </div>
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="Enter your academic email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 h-10"
                />
                <Button variant="secondary" type="submit" className="h-10">
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Links Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Brand & Contact Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/auct.png"
              alt="Auctores Logo"
              className="h-28 w-28 object-contain"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Auctores is an emerging international open access publisher aimed at development and rapid disseminaion of scientific knowledge to the global community without any restrictions
          </p>
          <div className="flex flex-col gap-2 text-xs text-slate-400 mt-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#8B0000]" />
              <span>info@auctorespublishing.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" />
              <span>Live Author Desk (24/7)</span>
            </div>
          </div>
        </div>

        {/* Column 2: Scholarly Directories */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Journals & Articles</h4>
          <ul className="flex flex-col gap-2 text-xs">
            {footerLinks.journals.map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{link.label}</span>
                  {link.label.includes('Waiver') && <ExternalLink className="h-3 w-3 text-slate-500" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Services & Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Services & Ethics</h4>
          <ul className="flex flex-col gap-2 text-xs">
            {footerLinks.services.map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link>
              </li>
            ))}
            {footerLinks.info.map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Information */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Contact</h4>
          <div className="flex flex-col gap-2 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">AUCTORES PUBLISHING LLC</p>
            <p>16192 Coastal Highway</p>
            <p>Lewes, DE 19958, USA</p>
            <div className="flex items-center gap-1 mt-1">
              <Phone className="h-3 w-3 text-[#8B0000]" />
              <span>+1-(302)-520-2632</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-[#8B0000]" />
              <span>info@auctorespublishing.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright and Legal Notice */}
      <div className="bg-slate-950 py-6 border-t border-slate-800 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-4 text-center">
          <p>2017-2026 Auctores Online, All rights reserved. No part of this content may be reproduced or transmitted in any form or by any means as per the standard guidelines of fair use. Creative Commons License Open Access by Auctores Online is licensed under Creative Commons License a Creative Commons Attribution 4.0 International License.</p>
        </div>
      </div>
    </footer>
  );
};
