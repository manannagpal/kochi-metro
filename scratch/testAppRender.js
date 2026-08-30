import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App.jsx';

try {
  // Mock window.location
  global.window = {
    location: { pathname: '/', search: '', href: 'https://kolkata.metro.org.in/' },
    history: { pushState: () => {}, replaceState: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {}
  };
  global.document = {
    title: '',
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {} }),
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  global.localStorage = {
    getItem: () => null,
    setItem: () => {}
  };

  const html = renderToString(React.createElement(App));
  console.log("App rendered successfully! HTML length:", html.length);
} catch (err) {
  console.error("APP RENDER ERROR:", err);
}
