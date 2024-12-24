import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

import ThankYouPage from './thankyou';

export const metadata = { title: `App | Final | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <div>
      <ThankYouPage />
    </div>
  );
}
