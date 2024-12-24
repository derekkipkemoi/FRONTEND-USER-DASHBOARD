import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import ResumeUploads from '@/components/resume/resume-upload';

export const metadata = { title: `App | Upload | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <div>
      <ResumeUploads />
    </div>
  );
}
