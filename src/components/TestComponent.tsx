import React from 'react';

export const TestComponent = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f5f5f5' }}>
      <h1 style={{ color: '#002F6C' }}>React is mounting successfully!</h1>
      <p style={{ marginTop: '1rem' }}>If you see this, React is working. The issue is with the app components.</p>
      <p style={{ marginTop: '0.5rem', color: '#666' }}>Check the browser console for any errors.</p>
    </div>
  );
};
