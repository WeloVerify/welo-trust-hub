
import React from 'react';
import BadgePreview from '@/components/BadgePreview';

const Widgets = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Badge Widgets</h1>
        <p className="text-gray-600 mt-1">
          Customize your Welo badge and generate embed code for your website.
        </p>
      </div>

      <BadgePreview />
    </div>
  );
};

export default Widgets;
