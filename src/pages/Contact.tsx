import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, MessageSquare, 
  Send, CheckCircle, Clock, ShieldAlert 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    
    setLoading(true);
    // Simulate network delay for API ticket submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      // Auto close success alert after 5s
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  const offices = [
    {
      city: 'Basel, Switzerland (HQ)',
      address: 'St. Alban-Anlage 66, 4052 Basel, Switzerland',
      phone: '+41 61 683 7734',
      hours: '08:00 - 17:00 CET'
    },
    {
      city: 'London, United Kingdom',
      address: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK',
      phone: '+44 20 7193 1234',
      hours: '09:00 - 18:00 GMT'
    },
    {
      city: 'Tokyo, Japan',
      address: '1-6-10 Toranomon, Minato-ku, Tokyo, 105-0001, Japan',
      phone: '+81 3 4567 8901',
      hours: '09:00 - 18:00 JST'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-10 font-sans">
      
      {/* Page Header */}
      <div className="text-center flex flex-col gap-2">
        <Badge variant="secondary" className="mx-auto">Support Desk</Badge>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Editorial Headquarters
        </h1>
        <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-normal">
          Have queries regarding Article Processing Charges, indexing, board membership, or submission delays? Our 24/7 Live Support team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start mt-4">
        
        {/* Contact Info & Offices (Spans 1) */}
        <div className="flex flex-col gap-6">
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Support Center</h3>
          
          {/* Quick channels */}
          <div className="flex flex-col gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <Mail className="h-5 w-5 text-[#8B0000] flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800 dark:text-white mb-0.5">Editorial Inquiries</p>
                <p className="text-slate-400">editorial@auctores.org</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <MessageSquare className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800 dark:text-white mb-0.5">Live Chat Desk</p>
                <p className="text-slate-400">Response within 5 minutes (24/7)</p>
              </div>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-4">Office Coordinates</h3>
          <div className="flex flex-col gap-5 text-xs text-slate-400">
            {offices.map((office) => (
              <div key={office.city} className="flex flex-col gap-1 text-slate-400">
                <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#8B0000]" />
                  {office.city}
                </p>
                <p className="pl-4 leading-normal">{office.address}</p>
                <p className="pl-4 font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {office.phone}
                </p>
                <p className="pl-4 text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Office hours: {office.hours}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Container (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Submit support ticket</h3>
          
          <Card variant="default">
            <CardContent className="p-6">
              {success ? (
                <div className="flex flex-col items-center gap-4 text-center py-10 px-6">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Ticket Submitted Successfully</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-normal">
                    We have received your support request. An editorial support staff member will respond to you at your provided email address within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="e.g. Dr. Aria Chen"
                      value={name}
                      onChange={(e: any) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Academic Email"
                      type="email"
                      placeholder="e.g. aria.chen@university.edu"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Subject / Topic"
                    placeholder="e.g. Inquiry regarding APC Waiver for submission sub-234"
                    value={subject}
                    onChange={(e: any) => setSubject(e.target.value)}
                    required
                  />

                  <div className="flex flex-col gap-1.5 font-sans">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message / Description</label>
                    <textarea
                      placeholder="Please describe your query in detail..."
                      value={message}
                      onChange={(e: any) => setMessage(e.target.value)}
                      required
                      className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/30 p-4 border border-slate-100 dark:border-slate-800 rounded-lg text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
                    <ShieldAlert className="h-4 w-4 text-[#8B0000] flex-shrink-0 mt-0.5" />
                    <span>Please do not include credit card credentials or sensitive passwords. For billing inquiries, our office will issue standard secure billing invoices separately.</span>
                  </div>

                  <Button variant="secondary" type="submit" loading={loading} className="h-11 ml-auto bg-[#8B0000] text-white">
                    <Send className="h-4 w-4 mr-2" /> Submit Support Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};
