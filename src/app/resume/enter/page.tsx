import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

import ResumeMain from './resume-main';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <div>
      <ResumeMain />
    </div>
  );
}
