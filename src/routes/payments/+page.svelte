<script lang="ts">
  import { CreditCard, Calendar, Download, AlertCircle, CheckCircle, Clock, DollarSign, FileText, Plus } from 'lucide-svelte';
  import { payments, transactions } from '$lib/stores/payments';
  import type { PaymentMethod, Transaction } from '$lib/stores/payments';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let selectedTab = 'overview'; // 'overview', 'methods', 'history', 'invoices'
  let activityTab = 'transactions'; // 'transactions', 'status'
  let showAddPaymentMethod = false;
  let selectedTransaction: Transaction | null = null;

  // Handle tab navigation from URL parameters
  onMount(() => {
    const unsubscribe = page.subscribe(($page) => {
      const tab = $page.url.searchParams.get('tab');
      if (tab && ['overview', 'methods', 'history', 'invoices'].includes(tab)) {
        selectedTab = tab;
      }
    });
    
    return unsubscribe;
  });

  // Update URL when tab changes
  function changeTab(tab: string) {
    selectedTab = tab;
    const url = new URL(window.location.href);
    if (tab === 'overview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    goto(url.pathname + url.search, { replaceState: true });
  }

  // Filter transactions by type
  $: completedPayments = $transactions.filter(t => t.type === 'payment' && t.status === 'completed');
  $: pendingPayments = $transactions.filter(t => t.type === 'payment' && t.status === 'pending');
  $: failedPayments = $transactions.filter(t => t.type === 'payment' && t.status === 'failed');
  $: refunds = $transactions.filter(t => t.type === 'refund');

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-100';
      case 'pending': return 'text-warning-600 bg-warning-100';
      case 'failed': return 'text-error-600 bg-error-100';
      case 'refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  function getPaymentMethodIcon(type: string) {
    switch (type) {
      case 'Visa':
      case 'Mastercard':
      case 'American Express':
        return CreditCard;
      case 'PayPal':
        return DollarSign;
      default:
        return CreditCard;
    }
  }

  function downloadReceipt(receiptUrl: string) {
    console.log('Downloading receipt:', receiptUrl);
    // In a real app, this would trigger a download
  }

  function addPaymentMethod() {
    showAddPaymentMethod = true;
  }

  function makePayment(courseId: string) {
    console.log('Making payment for course:', courseId);
  }

  function viewTransactionDetails(transaction: Transaction) {
    selectedTransaction = transaction;
  }

  function closeTransactionModal() {
    selectedTransaction = null;
  }
</script>

<svelte:head>
  <title>Payments - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Payments</h1>
      <p class="text-gray-600 mt-1">Manage your course payments and billing information</p>
    </div>
    
    <button 
      on:click={addPaymentMethod}
      class="mt-4 md:mt-0 btn btn-primary flex items-center space-x-2"
    >
      <Plus class="w-4 h-4" />
      <span>Add Payment Method</span>
    </button>
  </div>

  <!-- Tab Navigation -->
  <div class="border-b border-gray-200">
    <nav class="-mb-px flex space-x-8">
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => changeTab('overview')}
      >
        Overview
      </button>
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'methods' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => changeTab('methods')}
      >
        Payment Methods
      </button>
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => changeTab('history')}
      >
        Transaction History
      </button>
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'invoices' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => changeTab('invoices')}
      >
        Invoices & Receipts
      </button>
    </nav>
  </div>

  <!-- Tab Content -->
  {#if selectedTab === 'overview'}
    <!-- Overview Tab -->
    <div class="space-y-6">
      <!-- Payment Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Spent</p>
              <p class="text-2xl font-bold text-gray-900">${$payments.totalSpent}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <DollarSign class="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Courses Purchased</p>
              <p class="text-2xl font-bold text-gray-900">{$payments.coursesPurchased}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Amount</p>
              <p class="text-2xl font-bold text-warning-600">${$payments.pendingAmount}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock class="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Next Payment</p>
              <p class="text-sm font-bold text-gray-900">
                {$payments.nextPaymentDate ? new Date($payments.nextPaymentDate).toLocaleDateString() : 'None'}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Course Payments -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Course Payments</h2>
        <div class="space-y-4">
          {#each $payments.coursePayments as payment}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">{payment.courseName}</h3>
                  <p class="text-sm text-gray-600 mb-2">Instructor: {payment.instructor}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Total: ${payment.totalAmount}</span>
                    <span>Paid: ${payment.paidAmount}</span>
                    {#if payment.paymentPlan === 'installment'}
                      <span>Payment Plan: Installments</span>
                    {/if}
                  </div>
                </div>
                
                <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-2">
                  <span class="px-3 py-1 text-xs font-medium rounded-full {
                    payment.status === 'completed' ? 'bg-success-100 text-success-700' :
                    payment.status === 'partial' ? 'bg-warning-100 text-warning-700' :
                    'bg-error-100 text-error-700'
                  }">
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                  
                  {#if payment.status === 'pending' || payment.status === 'partial'}
                    <button 
                      on:click={() => makePayment(payment.courseId)}
                      class="btn btn-primary text-sm px-4 py-2"
                    >
                      {payment.status === 'partial' ? 'Pay Remaining' : 'Make Payment'}
                    </button>
                  {/if}
                  
                  {#if payment.nextPaymentDate}
                    <p class="text-xs text-gray-500">
                      Next payment: {new Date(payment.nextPaymentDate).toLocaleDateString()}
                    </p>
                  {/if}
                </div>
              </div>
              
              <!-- Progress Bar for Partial Payments -->
              {#if payment.paymentPlan === 'installment'}
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">Payment Progress</span>
                    <span class="text-sm text-gray-500">
                      ${payment.paidAmount} / ${payment.totalAmount}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style="width: {(payment.paidAmount / payment.totalAmount) * 100}%"
                    ></div>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Recent Transactions -->
      <!-- Recent Activity Section with Tabs -->
      <div class="card">
        <div class="border-b border-gray-200">
          <div class="px-6 py-4">
            <h2 class="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <nav class="px-6 -mb-px flex space-x-8">
            <button
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {activityTab === 'transactions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => activityTab = 'transactions'}
            >
              Recent Transactions
            </button>
            <button
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {activityTab === 'status' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => activityTab = 'status'}
            >
              Current Status
            </button>
          </nav>
        </div>
        
        <div class="p-6">
          {#if activityTab === 'transactions'}
            <!-- Recent Transactions Content -->
            <div class="space-y-3">
              <div class="flex items-center justify-between mb-4">
                <p class="text-sm text-gray-600">Latest payment activities</p>
                <button 
                  on:click={() => changeTab('history')}
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </button>
              </div>
              {#each $transactions.slice(0, 5) as transaction}
                <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">{transaction.description}</p>
                    <p class="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-bold text-gray-900">
                      {transaction.type === 'refund' ? '+' : '-'}${transaction.amount}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(transaction.status)}">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {:else if activityTab === 'status'}
            <!-- Current Status Content -->
            <div class="space-y-4">
              <p class="text-sm text-gray-600 mb-4">Overview of your payment status and upcoming obligations</p>
              
              <!-- Payment Status Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                      <CheckCircle class="w-4 h-4 text-success-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Completed Payments</p>
                      <p class="text-xs text-gray-500">{completedPayments.length} transactions</p>
                    </div>
                  </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                      <Clock class="w-4 h-4 text-warning-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Pending Payments</p>
                      <p class="text-xs text-gray-500">{pendingPayments.length} transactions</p>
                    </div>
                  </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                      <AlertCircle class="w-4 h-4 text-error-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Failed Payments</p>
                      <p class="text-xs text-gray-500">{failedPayments.length} transactions</p>
                    </div>
                  </div>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign class="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Refunds</p>
                      <p class="text-xs text-gray-500">{refunds.length} transactions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Next Payment Due -->
              {#if $payments.nextPaymentDate}
                <div class="border border-warning-200 bg-warning-50 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                      <Calendar class="w-4 h-4 text-warning-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-warning-900">Next Payment Due</p>
                      <p class="text-sm text-warning-700">
                        Payment due on {new Date($payments.nextPaymentDate).toLocaleDateString()}
                      </p>
                      <p class="text-xs text-warning-600 mt-1">
                        Don't forget to make your payment to avoid any service interruption
                      </p>
                    </div>
                  </div>
                </div>
              {/if}
              
              <!-- Payment Methods Summary -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Active Payment Methods</h4>
                <div class="space-y-2">
                  {#each $payments.paymentMethods as method}
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <CreditCard class="w-4 h-4 text-gray-400" />
                        <span class="text-sm text-gray-700">{method.type} •••• {method.last4}</span>
                      </div>
                      {#if method.isDefault}
                        <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          Default
                        </span>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

  {:else if selectedTab === 'methods'}
    <!-- Payment Methods Tab -->
    <div class="space-y-6">
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Saved Payment Methods</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each $payments.paymentMethods as method}
            {@const Icon = getPaymentMethodIcon(method.type)}
            <div class="border border-gray-200 rounded-lg p-4 {method.isDefault ? 'ring-2 ring-primary-500' : ''}">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon class="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{method.type} •••• {method.last4}</p>
                    <p class="text-sm text-gray-600">{method.holderName}</p>
                    <p class="text-xs text-gray-500">Expires {method.expiryMonth}/{method.expiryYear}</p>
                  </div>
                </div>
                {#if method.isDefault}
                  <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                    Default
                  </span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

  {:else if selectedTab === 'history'}
    <!-- Transaction History Tab -->
    <div class="space-y-6">
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Transaction History</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each $transactions as transaction}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div class="text-sm text-gray-500">
                        {transaction.paymentMethod}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {transaction.type === 'refund' ? '+' : '-'}${transaction.amount}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(transaction.status)}">
                      {transaction.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button 
                        on:click={() => viewTransactionDetails(transaction)}
                        class="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </button>
                      {#if transaction.receiptUrl}
                        <button 
                          on:click={() => downloadReceipt(transaction.receiptUrl)}
                          class="text-primary-600 hover:text-primary-900"
                        >
                          Receipt
                        </button>
                      {/if}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  {:else if selectedTab === 'invoices'}
    <!-- Invoices & Receipts Tab -->
    <div class="space-y-6">
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Invoices & Receipts</h2>
        <div class="space-y-4">
          {#each $transactions.filter(t => t.receiptUrl) as transaction}
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{transaction.description}</p>
                  <p class="text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()} • ${transaction.amount}
                  </p>
                </div>
              </div>
              <button 
                on:click={() => downloadReceipt(transaction.receiptUrl)}
                class="btn btn-secondary flex items-center space-x-2"
              >
                <Download class="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Transaction Details Modal -->
{#if selectedTransaction}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Transaction Details</h3>
        <button 
          on:click={closeTransactionModal}
          class="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <div class="space-y-3">
        <div>
          <p class="text-sm font-medium text-gray-700">Description</p>
          <p class="text-sm text-gray-900">{selectedTransaction.description}</p>
        </div>
        
        <div>
          <p class="text-sm font-medium text-gray-700">Amount</p>
          <p class="text-sm text-gray-900">
            {selectedTransaction.type === 'refund' ? '+' : '-'}${selectedTransaction.amount}
          </p>
        </div>
        
        <div>
          <p class="text-sm font-medium text-gray-700">Date</p>
          <p class="text-sm text-gray-900">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
        </div>
        
        <div>
          <p class="text-sm font-medium text-gray-700">Payment Method</p>
          <p class="text-sm text-gray-900">{selectedTransaction.paymentMethod}</p>
        </div>
        
        <div>
          <p class="text-sm font-medium text-gray-700">Status</p>
          <span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(selectedTransaction.status)}">
            {selectedTransaction.status}
          </span>
        </div>
        
        <div>
          <p class="text-sm font-medium text-gray-700">Transaction ID</p>
          <p class="text-sm text-gray-900 font-mono">{selectedTransaction.id}</p>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        {#if selectedTransaction.receiptUrl}
          <button 
            on:click={() => downloadReceipt(selectedTransaction.receiptUrl)}
            class="btn btn-secondary"
          >
            Download Receipt
          </button>
        {/if}
        <button 
          on:click={closeTransactionModal}
          class="btn btn-primary"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}