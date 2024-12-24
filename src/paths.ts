export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  resume: {
    upload: '/resume/upload',
    resumePricing: '/resume/pricing',
    resumeOptions: '/resume/options',
    resumeSections: '/resume/resume-sections',
    resumeUpload: '/resume/resume-upload',
    enter: '/resume/enter',
    additionalServices: '/resume/additional-services',
    resumeTemplates: '/resume/resume-templates',
    checkout: '/resume/checkout',
    thankyou: '/resume/thankyou',
  },
  dashboard: {
    overview: '/dashboard',
    orders: '/dashboard/orders',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    // resume: '/dashboard/resume',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
