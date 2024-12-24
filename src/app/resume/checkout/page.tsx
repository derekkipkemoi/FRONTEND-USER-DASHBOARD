import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

import CheckoutForm from "./checkout";

export const metadata = { title: `App | Final | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <div>
      <CheckoutForm />
    </div>
  );
}
