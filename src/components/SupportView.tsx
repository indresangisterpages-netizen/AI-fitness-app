import React, { useState } from "react";
import { HelpCircle, Mail, MessageSquare, ShieldCheck, Check } from "lucide-react";

export default function SupportView() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: "How does Coach AI customize suggestions?",
      a: "Coach AI reads your current local stats (calories consumed, logged training intensity, hydration levels, and systemic stress indicators like heart rate deviations) to dynamically compute tailored guidelines every session.",
    },
    {
      q: "Can I log customized meals and custom exercise sets?",
      a: "Yes! Use the NUTRITION log panel to dynamically add foods with custom kCal & protein structures. In the WORKOUTS routine selector, click 'Create Routine' to formulate customized exercises, set ranges, and target reps.",
    },
    {
      q: "Is my personal data persisted?",
      a: "All active metrics, tasks completed, logged meals, and workout configurations are stored directly inside your browser cache and local storage, ensuring immediate data persistence between session reloads.",
    },
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketSubject.trim() && ticketBody.trim()) {
      setTicketSent(true);
      setTicketSubject("");
      setTicketBody("");
      setTimeout(() => setTicketSent(false), 4000);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-10">
      
      {/* Accordion FAQs */}
      <section className="glass-card rounded-2xl p-6 md:p-8 bg-[#1E1E1E]">
        <div className="flex items-center gap-3 border-b border-[#2c2c2e] pb-4 mb-6">
          <HelpCircle size={22} className="text-[#c3f400]" />
          <h3 className="font-display font-extrabold text-[#ffffff] text-xl">Knowledge Base</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#131313]/50 border border-[#2c2c2e]/60">
              <h5 className="font-sans font-bold text-[#ffffff] text-sm mb-1.5">{faq.q}</h5>
              <p className="text-xs text-[#c4c9ac] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="glass-card rounded-2xl p-6 md:p-8 bg-[#1E1E1E]">
        <div className="flex items-center gap-3 border-b border-[#2c2c2e] pb-4 mb-6">
          <Mail size={22} className="text-[#c3f400]" />
          <h3 className="font-display font-extrabold text-[#ffffff] text-xl">Submit Support Request</h3>
        </div>

        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">SUBJECT</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Synchronization issue / Routine editor feedback"
              className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">DETAILED MESSAGE</label>
            <textarea
              required
              rows={4}
              value={ticketBody}
              onChange={(e) => setTicketBody(e.target.value)}
              placeholder="Explain the technical feedback or general support query..."
              className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
            />
          </div>

          {ticketSent && (
            <div className="bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] text-xs p-3 rounded-xl flex items-center gap-2">
              <Check size={14} /> Support ticket submitted successfully! Coach AI technical admins are reviewing.
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#c3f400] text-[#161e00] hover:bg-[#abd600] px-6 py-3 rounded-xl font-display font-black text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <MessageSquare size={14} /> SUBMIT DISPATCH
            </button>
          </div>
        </form>
      </section>

    </div>
  );
}
