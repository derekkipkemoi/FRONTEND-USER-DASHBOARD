import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import  PricingCards  from './pricing';


export const metadata = { title: `App | Upload | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {

  return (
    <div>
        <PricingCards />
    </div>
  );
}