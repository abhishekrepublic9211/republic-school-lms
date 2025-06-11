<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; // Import page store if needed for pathname checks
  import { goto } from '$app/navigation';
  import { authStore, type User } from '$lib/stores/auth';
  // Ensure authService and userService are imported
  import { paymentService, authService, userService, ApiError } from '$lib/utils/api'; 

  interface PaymentGatewayDetails {
    gateway_name: string;
    gateway_order_id: string;
    gateway_payment_id: string;
    gateway_order_reference_id?: string;
    gateway_status_code?: string;
    gateway_settlement?: string;
  }

  interface PaymentMethodDetail {
    upi?: {
      channel: string;
      upi_id: string;
    };
  }

  interface PaymentRecord {
    _id: string;
    application_id: string; 
    order_id: string;
    auth_id?: string;
    authorization?: string;
    bank_reference?: string;
    cf_payment_id: string;
    entity: string;
    error_details?: any;
    is_captured: boolean;
    order_amount: number;
    payment_amount: number;
    payment_completion_time?: string; 
    payment_currency: string;
    payment_gateway_details: PaymentGatewayDetails;
    payment_group: string;
    payment_message: string;
    payment_method: PaymentMethodDetail;
    payment_offers?: any;
    payment_status: 'PENDING' | 'SUCCESS' | 'FAILED'; 
    payment_time: string; 
    createdAt: string;
    updatedAt: string;
  }

  interface PaymentHistory {
    admissionPayments: PaymentRecord[];
    courseFees: PaymentRecord[]; 
  }

  let currentUser: User | null = null;
  let paymentHistory: PaymentHistory | null = null;
  let isLoading: boolean = true;
  let errorMessage: string | null = null;

  authStore.subscribe(value => {
    currentUser = value.user;
    if (!value.isAuthenticated && typeof window !== 'undefined') {
      if ($page.url.pathname !== '/login') { // Check current path before redirecting
         goto('/login');
      }
    }
  });

  async function fetchPayments() {
    if (!currentUser || !currentUser.applicationId) {
      errorMessage = 'Application ID not found. Cannot fetch payment history.';
      isLoading = false;
      return;
    }
    isLoading = true; 
    errorMessage = null; 
    try {
      const response = await paymentService.getPaymentHistory(currentUser.applicationId);
      if (response.data) {
        paymentHistory = response.data as PaymentHistory;
      } else {
        errorMessage = response.message || 'No payment history data returned.';
      }
    } catch (error) {
      if (error instanceof ApiError) {
        errorMessage = error.data?.message || error.message || 'Failed to load payment history.';
      } else {
        errorMessage = (error as Error).message || 'An unexpected error occurred.';
      }
      console.error('Error fetching payment history:', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 0)); // Allow store to update currentUser

    if (!$authStore.isAuthenticated) {
      if ($page.url.pathname !== '/login') goto('/login');
      return;
    }

    const userIdFromStore = currentUser?._id || currentUser?.id;

    if (currentUser && currentUser.applicationId) {
      await fetchPayments();
    } else if (userIdFromStore) {
      // applicationId is missing, try to fetch more complete user data
      isLoading = true;
      errorMessage = null;
      try {
        let userToUpdateStore: User | null = null;
        
        // Step 1: Try /auth/profile
        const authProfileResponse = await authService.getProfile();
        if (authProfileResponse && authProfileResponse.data) {
          let userFromAuth = authProfileResponse.data as User;
          userFromAuth.id = userFromAuth._id || userFromAuth.id; // Ensure id mapping
          userToUpdateStore = userFromAuth;

          if (userFromAuth.applicationId) {
            // Found applicationId from /auth/profile
            authStore.setUser(userFromAuth);
            await new Promise(resolve => setTimeout(resolve, 0)); // Propagate store update
            await fetchPayments(); // currentUser should now have applicationId
            return; // Done
          }
          // If applicationId still missing, proceed to Step 2 if userFromAuth has an ID
        } else {
          console.warn('/auth/profile did not return data.');
          // Continue to try /users/get/:id if we have a userIdFromStore
        }

        // Step 2: If applicationId still missing, try /users/get/:id
        // (userToUpdateStore might be null if /auth/profile failed, or it's the user from /auth/profile without appID)
        if (!(userToUpdateStore?.applicationId) && userIdFromStore) {
          console.log('ApplicationId still missing, fetching from /users/get/:id');
          const fullUserResponse = await userService.getUserById(userIdFromStore);
          if (fullUserResponse && fullUserResponse.data) {
            userToUpdateStore = fullUserResponse.data as User;
            userToUpdateStore.id = userToUpdateStore._id || userToUpdateStore.id; // Ensure id mapping
          } else {
            console.warn('Failed to get data from /users/get/:id');
            errorMessage = 'Could not retrieve full user details to find Application ID.';
          }
        }
        
        // Final check and update
        if (userToUpdateStore) {
          authStore.setUser(userToUpdateStore);
          await new Promise(resolve => setTimeout(resolve, 0)); // Propagate store update
          if (currentUser && currentUser.applicationId) {
            await fetchPayments();
          } else {
            errorMessage = 'Application ID could not be found even after profile refresh.';
          }
        } else if (!errorMessage) {
            errorMessage = 'Failed to retrieve necessary user information for payments.';
        }

      } catch (error) {
        if (error instanceof ApiError) {
          errorMessage = error.data?.message || error.message || 'Failed to load user profile for payments.';
        } else {
          errorMessage = (error as Error).message || 'An unexpected error occurred.';
        }
        console.error('Error fetching user profile on payments page:', error);
      } finally {
        isLoading = false;
      }
    } else {
      errorMessage = 'User session not found. Please try logging in again.';
      isLoading = false;
      if (typeof window !== 'undefined' && $page.url.pathname !== '/login') {
        goto('/login');
      }
    }
  });

  function formatDate(dateString?: string) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
</script>

<svelte:head>
  <title>Payment History - Republic School</title>
</svelte:head>

<div class="container mx-auto p-4 md:p-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Payment History</h1>

  {#if isLoading}
    <p class="text-center text-gray-600">Loading payment history...</p>
  {:else if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {:else if paymentHistory && (paymentHistory.admissionPayments?.length > 0 || paymentHistory.courseFees?.length > 0)}
    <div class="bg-white shadow-md rounded-lg p-6">
      
      {#if paymentHistory.admissionPayments?.length > 0}
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Admission Payments</h2>
        <div class="overflow-x-auto mb-8">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">For (Group)</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each paymentHistory.admissionPayments as payment}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.payment_time)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.payment_amount} {payment.payment_currency}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.payment_group}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      {payment.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                       payment.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                      {payment.payment_status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.cf_payment_id}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      {#if paymentHistory.courseFees?.length > 0}
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Course Fee Payments</h2>
         <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">For (Group)</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each paymentHistory.courseFees as feePayment}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(feePayment.payment_time)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feePayment.payment_amount} {feePayment.payment_currency}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feePayment.payment_group}</td>
                   <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      {feePayment.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                       feePayment.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                      {feePayment.payment_status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feePayment.cf_payment_id}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else if !paymentHistory.admissionPayments?.length} 
        <p class="text-center text-gray-500">No payment history found.</p>
      {/if}
    </div>
  {:else}
    <p class="text-center text-gray-500">No payment history found for your account or unable to load data.</p>
  {/if}
</div>
