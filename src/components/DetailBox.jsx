import React from 'react';

const DetailBox = ({ label, value }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-medium">{value}</p>
  </div>
);

export default DetailBox;
