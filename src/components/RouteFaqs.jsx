import React, { useState } from 'react';
import { ChevronDown, HelpCircle, FileText } from 'lucide-react';

export function RouteFaqs({ fromStation, toStation, primaryRoute }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!fromStation || !toStation || !primaryRoute) return null;

  const totalStops = primaryRoute.totalStops || primaryRoute.stops || 0;

  const faqs = [
    {
      q: `What is the fare from ${fromStation.name} to ${toStation.name}?`,
      a: `The standard token fare for travelling from ${fromStation.name} to ${toStation.name} is ₹${primaryRoute.fare}. Passengers using a Kochi Metro Smart Card receive a discount, making the smart card fare ₹${primaryRoute.smartCardFare}.`
    },
    {
      q: `How long does the journey from ${fromStation.name} to ${toStation.name} take?`,
      a: `The total estimated journey travel time is ${primaryRoute.totalTimeMins} minutes, covering a total rail distance of approximately ${primaryRoute.totalDistanceKm} km.`
    },
    {
      q: `How many interchanges between ${fromStation.name} and ${toStation.name}?`,
      a: primaryRoute.switches === 0
        ? `This is a direct line journey with 0 interchange switches required.`
        : `This journey requires ${primaryRoute.switches} line switch(es) at designated interchange stations.`
    },
    {
      q: `What are the first and last train timings from ${fromStation.name} to ${toStation.name}?`,
      a: `First metro trains typically start between 06:45 AM and 07:00 AM on weekdays, and the last train departs around 09:45 PM to 10:00 PM.`
    },
    {
      q: `How far is ${toStation.name} from ${fromStation.name}?`,
      a: `The distance by metro rail between ${fromStation.name} and ${toStation.name} is ${primaryRoute.totalDistanceKm} km across ${totalStops} stations.`
    },
    {
      q: `How many stops are there between ${fromStation.name} and ${toStation.name}?`,
      a: `There are ${totalStops} station stops in total along this route.`
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ marginTop: '28px', marginBottom: '32px' }}>
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', marginBottom: '24px', background: 'var(--bg-surface)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} /> {fromStation.name} to {toStation.name} Route Summary & FAQs
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
          This route covers <strong>{totalStops} stations</strong> in total. The approximate travel time is <strong>{primaryRoute.totalTimeMins} min</strong>. The total travel distance is <strong>{primaryRoute.totalDistanceKm} km</strong>. The metro fare for this route is <strong>₹{primaryRoute.fare}</strong> (smart card ₹{primaryRoute.smartCardFare}). First metro train departs at ~06:50 AM and last train at ~09:55 PM. Both origin and destination offer Divyang-friendly universal access.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <HelpCircle color="var(--accent-primary)" size={20} />
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          {fromStation.name} to {toStation.name} Metro Route FAQs
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="glass-panel" style={{
              borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%', padding: '14px 18px', background: 'var(--input-bg)', border: 'none',
                  color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
                }}
              >
                <span>Q. {faq.q}</span>
                <ChevronDown size={18} color="var(--text-muted)" style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              </button>
              {isOpen && (
                <div style={{ padding: '14px 18px', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', borderTop: '1px solid var(--border-color)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
