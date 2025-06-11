<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore, type User } from '$lib/stores/auth';
  import { authService, ApiError } from '$lib/utils/api';

  let email: string = '';
  let otp: string = '';
  let isLoading: boolean = false;
  let errorMessage: string | null = null;
  let successMessage: string | null = null;
  let otpSent: boolean = false;

  async function handleRequestOtp() {
    if (!email) {
      errorMessage = 'Please enter your email address.';
      return;
    }
    isLoading = true;
    errorMessage = null;
    successMessage = null;
    try {
      const response = await authService.requestOtp(email);
      if (response.data === true) {
        otpSent = true;
        successMessage = response.message || 'OTP has been sent to your email.';
      } else {
        errorMessage = response.message || 'Failed to send OTP. Please try again.';
      }
    } catch (error) {
      if (error instanceof ApiError) {
        errorMessage = error.data?.message || error.message || 'An error occurred while requesting OTP.';
      } else {
        errorMessage = (error as Error).message || 'An unexpected error occurred.';
      }
      console.error('Request OTP error:', error);
    } finally {
      isLoading = false;
    }
  }

  async function handleVerifyOtpAndLogin() {
    if (!email || !otp) {
      errorMessage = 'Please enter your email and the OTP.';
      return;
    }
    isLoading = true;
    errorMessage = null;
    successMessage = null;
    try {
      const response = await authService.verifyOtp(email, otp);
      // Backend response structure is { status, message, data: { access_token, user } }
      if (response.data && response.data.access_token && response.data.user) {
        const userFromResponse = response.data.user as User; 
        authStore.login(userFromResponse, response.data.access_token);
        successMessage = 'Login successful! Redirecting...';
        
        // Since isProfileComplete is no longer on the User object from login,
        // and the user object from OTP verification is minimal,
        // always redirect to profile edit page to encourage completion or review.
        // The profile page will fetch full data and can adjust display/edit mode.
        goto('/profile?edit=true');

      } else {
        // Use the message from backend if available, otherwise a generic one
        errorMessage = response.message || 'Login failed. Please check your OTP and try again.';
        if (response.status === 200 && response.message === 'OTP verified successfully' && (!response.data || !response.data.access_token || !response.data.user)) {
            // This case means OTP was fine, but token/user data was missing in expected structure
            errorMessage = 'OTP verified, but login failed to complete. Missing token or user data from server.';
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        errorMessage = error.data?.message || error.message || 'An error occurred during login.';
      } else {
        errorMessage = (error as Error).message || 'An unexpected error occurred.';
      }
      console.error('Verify OTP error:', error);
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    otpSent = false;
    otp = '';
    errorMessage = null;
    successMessage = null;
  }
</script>

<svelte:head>
  <title>Login - Republic School</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-700">
      {#if otpSent}Verify OTP{:else}Login{/if}
    </h1>

    {#if errorMessage}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{errorMessage}</span>
      </div>
    {/if}

    {#if successMessage && !($authStore.isAuthenticated && successMessage.includes('Login successful'))}
      <!-- Show success message only if it's not the final login success message (which triggers redirect) -->
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{successMessage}</span>
      </div>
    {/if}

    <form on:submit|preventDefault={otpSent ? handleVerifyOtpAndLogin : handleRequestOtp}>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          disabled={otpSent || isLoading}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="you@example.com"
          required
        />
      </div>

      {#if otpSent}
        <div class="mb-6">
          <label for="otp" class="block text-sm font-medium text-gray-700 mb-1">OTP</label>
          <input
            type="text"
            id="otp"
            bind:value={otp}
            disabled={isLoading}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter OTP"
            required
            minlength="6"
            maxlength="6"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
        </button>
        <button
            type="button"
            on:click={resetForm}
            disabled={isLoading}
            class="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
            Change Email or Resend OTP
        </button>
      {:else}
        <button
          type="submit"
          disabled={isLoading}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Sending OTP...' : 'Request OTP'}
        </button>
      {/if}
    </form>
     {#if $authStore.isAuthenticated}
      <p class="mt-4 text-center text-sm text-green-600">
        You are already logged in. <a href="/profile" class="font-medium text-indigo-600 hover:text-indigo-500">Go to Profile</a>
      </p>
    {/if}
  </div>
</div>
