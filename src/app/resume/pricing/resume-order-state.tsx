import { atomWithStorage } from 'jotai/utils';

import { type OrderPackageType } from '@/types/order';

// Define the type for the atom's state

// Define the atom with an initial state
// export const OrderFile = atomWithStorage<OrderFileType>('orderFile', {
//   url: "",
//   name: "",
//   description: ""
// });

export const OrderPackage = atomWithStorage<OrderPackageType>('orderPackage', {
  title: '',
  price: '',
  currency: {
    symbol: '',
    rate: 0,
  },
  description: '',
  features: [],
  orderRevision: 0,
});

// export const OrderTemplateType = atomWithStorage<OrderTemplateType>('orderTemplate', {
//   name: "",
//   url: "",
//   description: ""
// });

// export const OrderObject = atomWithStorage<OrderObjectType>('orderObject', {
//   userId: "",
//   orderId: "",
//   orderPackage: {
//     title: "",
//     price: "",
//     currency: {
//       symbol: "",
//       rate: 0
//     },
//     description: "",
//     features: []
//   },
//   orderNote: "",
//   orderRequireCoverLetter: false,
//   orderRequireLinkedOptimization: false,
//   orderType: "",
//   orderStatus: "Pending",
//   orderTemplate: {
//     name: "",
//     url: "",
//     description: ""
//   },
//   orderResume: {
//     url: "",
//     name: "",
//     description: ""
//   },
//   orderCompletedFiles: [],
//   orderCoverLetterDetails: "",
//   orderLinkedInUrl: "",
//   orderDate: new Date(),
//   deliveryDate: ""
// });
