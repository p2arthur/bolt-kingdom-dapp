import React from 'react';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>
    </div>
  );
}