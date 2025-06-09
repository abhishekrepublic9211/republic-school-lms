import { writable } from 'svelte/store';

export interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'PayPal';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;
}

export interface CoursePayment {
  id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  totalAmount: number;
  paidAmount: number;
  status: 'completed' | 'partial' | 'pending';
  purchaseDate: string;
  nextPaymentDate?: string;
  paymentPlan: 'full' | 'installment';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'payment' | 'refund';
  courseId?: string;
  courseName?: string;
  paymentMethod: string;
  receiptUrl?: string;
}

export interface PaymentSummary {
  totalSpent: number;
  coursesPurchased: number;
  pendingAmount: number;
  nextPaymentDate?: string;
  paymentMethods: PaymentMethod[];
  coursePayments: CoursePayment[];
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2026',
    isDefault: true,
    holderName: 'Sarah Johnson'
  },
  {
    id: '2',
    type: 'PayPal',
    last4: '8765',
    expiryMonth: '08',
    expiryYear: '2025',
    isDefault: false,
    holderName: 'Sarah Johnson'
  }
];

const mockCoursePayments: CoursePayment[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    totalAmount: 299,
    paidAmount: 299,
    status: 'completed',
    purchaseDate: '2024-01-15',
    paymentPlan: 'full'
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    totalAmount: 599,
    paidAmount: 299,
    status: 'partial',
    purchaseDate: '2024-01-20',
    nextPaymentDate: '2024-02-20',
    paymentPlan: 'installment'
  },
  {
    id: '3',
    courseId: '3',
    courseName: 'Broadcast Journalism Essentials',
    instructor: 'James Rodriguez',
    totalAmount: 449,
    paidAmount: 0,
    status: 'pending',
    purchaseDate: '2024-01-25',
    nextPaymentDate: '2024-02-01',
    paymentPlan: 'full'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    date: '2024-01-25T14:30:00',
    description: 'Course Purchase - Broadcast Journalism Essentials',
    amount: 449,
    status: 'pending',
    type: 'payment',
    courseId: '3',
    courseName: 'Broadcast Journalism Essentials',
    paymentMethod: 'Visa ****4242'
  },
  {
    id: 'txn_002',
    date: '2024-01-20T10:15:00',
    description: 'Course Payment - Investigative Reporting (Installment 1)',
    amount: 299,
    status: 'completed',
    type: 'payment',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    paymentMethod: 'Visa ****4242',
    receiptUrl: '/receipts/txn_002.pdf'
  },
  {
    id: 'txn_003',
    date: '2024-01-15T16:45:00',
    description: 'Course Purchase - Digital Journalism Fundamentals',
    amount: 299,
    status: 'completed',
    type: 'payment',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    paymentMethod: 'Visa ****4242',
    receiptUrl: '/receipts/txn_003.pdf'
  },
  {
    id: 'txn_004',
    date: '2024-01-10T09:20:00',
    description: 'Refund - Course Cancellation',
    amount: 199,
    status: 'completed',
    type: 'refund',
    paymentMethod: 'Visa ****4242',
    receiptUrl: '/receipts/txn_004.pdf'
  },
  {
    id: 'txn_005',
    date: '2024-01-05T11:30:00',
    description: 'Course Purchase - Introduction to Journalism',
    amount: 199,
    status: 'failed',
    type: 'payment',
    paymentMethod: 'Visa ****4242'
  },
  {
    id: 'txn_006',
    date: '2023-12-20T13:15:00',
    description: 'Course Purchase - Ethics in Journalism',
    amount: 249,
    status: 'completed',
    type: 'payment',
    paymentMethod: 'PayPal ****8765',
    receiptUrl: '/receipts/txn_006.pdf'
  }
];

const mockPaymentSummary: PaymentSummary = {
  totalSpent: 1346,
  coursesPurchased: 4,
  pendingAmount: 749, // 449 + 300 (remaining installment)
  nextPaymentDate: '2024-02-01',
  paymentMethods: mockPaymentMethods,
  coursePayments: mockCoursePayments
};

export const payments = writable<PaymentSummary>(mockPaymentSummary);
export const transactions = writable<Transaction[]>(mockTransactions);