import React from 'react';
import { X, ShieldCheck, Lock, Eye, FileText, Globe } from 'lucide-react';

export function PrivacyModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '720px', maxHeight: '88vh',
        display: 'flex', flexDirection: 'column', position: 'relative',
        background: 'var(--bg-surface)', borderRadius: '16px', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--header-summary-bg)', color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Privacy Policy
              </h3>
              <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                Last Updated: August 20, 2026
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{
            background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: '#FFFFFF',
            width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', lineHeight: '1.7', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          
          <p>
            At <strong>Kochi Metro Route Finder</strong> (<a href="https://delhi.metro.org.in" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>delhi.metro.org.in</a>), accessible from https://delhi.metro.org.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by delhi.metro.org.in and how we use it.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            Log Files & Analytics
          </h4>
          <p>
            delhi.metro.org.in follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            Google DoubleClick DART Cookie & AdSense Policies
          </h4>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>https://policies.google.com/technologies/ads</a>
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            Third Party Advertising Partners
          </h4>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on delhi.metro.org.in, which are sent directly to users' browser. They automatically receive your IP address when this occurs.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            Location Data Privacy
          </h4>
          <p>
            When using our <em>Nearest Metro Station GPS Finder</em>, your geographic coordinates are queried locally in real time inside your web browser. Your precise location is never transmitted to our backend databases or stored on remote servers.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            Contact Information
          </h4>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to reach out to us through our Contact Us page.
          </p>

        </div>
      </div>
    </div>
  );
}
