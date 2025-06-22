import React, { Suspense } from 'react';
import UnsubscribedPage from './UnsubscribedPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <UnsubscribedPage />
    </Suspense>
  );
}
