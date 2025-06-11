
import React from 'react';
import VerificationStatus from '@/components/VerificationStatus';

const Verification = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Verification Status</h1>
        <p className="text-gray-600 mt-1">
          Track your verification process and upload required documents.
        </p>
      </div>

      <VerificationStatus status="pending" />
    </div>
  );
};

export default Verification;
