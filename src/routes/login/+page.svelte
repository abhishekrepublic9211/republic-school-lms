<script lang="ts">
  import { sendOTP, verifyOTP, authLoading, authError } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { Mail, ArrowRight, RefreshCw } from 'lucide-svelte';

  let email = '';
  let otp = '';
  let step = 'email'; // 'email' or 'otp'
  let error = '';
  let otpSent = false;
  let countdown = 0;
  let countdownInterval: number;
  let attemptsRemaining = 3;

  // Subscribe to auth stores
  $: isLoading = $authLoading;
  $: if ($authError) {
    error = $authError;
  }

  async function handleSendOTP() {
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    if (!email.includes('@')) {
      error = 'Please enter a valid email address';
      return;
    }

    error = '';

    try {
      const result = await sendOTP(email);
      
      if (result.success) {
        step = 'otp';
        otpSent = true;
        attemptsRemaining = result.attemptsRemaining || 3;
        startCountdown();
        error = '';
      } else {
        error = result.message || 'Failed to send OTP. Please try again.';
      }
    } catch (err) {
      error = 'Network error. Please check your connection and try again.';
    }
  }

  async function handleVerifyOTP() {
    if (!otp) {
      error = 'Please enter the OTP';
      return;
    }

    if (otp.length !== 6) {
      error = 'OTP must be 6 digits';
      return;
    }

    error = '';

    try {
      const result = await verifyOTP(email, otp);
      
      if (result.success) {
        goto('/dashboard');
      } else {
        error = result.message || 'Invalid OTP. Please try again.';
        otp = '';
        attemptsRemaining = Math.max(0, attemptsRemaining - 1);
        
        if (attemptsRemaining === 0) {
          step = 'email';
          otpSent = false;
          error = 'Too many failed attempts. Please request a new OTP.';
        }
      }
    } catch (err) {
      error = 'Network error. Please check your connection and try again.';
      otp = '';
    }
  }

  function startCountdown() {
    countdown = 60;
    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  async function resendOTP() {
    if (countdown > 0) return;
    
    error = '';
    
    try {
      const result = await sendOTP(email);
      if (result.success) {
        startCountdown();
        attemptsRemaining = result.attemptsRemaining || 3;
        error = '';
      } else {
        error = result.message || 'Failed to resend OTP. Please try again.';
      }
    } catch (err) {
      error = 'Network error. Please check your connection and try again.';
    }
  }

  function goBackToEmail() {
    step = 'email';
    otp = '';
    error = '';
    otpSent = false;
    attemptsRemaining = 3;
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  }

  function handleOTPInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      otp = value;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (step === 'email') {
        handleSendOTP();
      } else {
        handleVerifyOTP();
      }
    }
  }
</script>

<svelte:head>
  <title>Login - Republic School of Journalism</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div class="text-center">
      <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span class="text-white font-bold text-2xl">R</span>
      </div>
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        {step === 'email' ? 'Welcome Back' : 'Verify Your Email'}
      </h2>
      <p class="text-gray-600">
        {step === 'email' 
          ? 'Sign in to your Republic School of Journalism account' 
          : `We've sent a 6-digit code to ${email}`
        }
      </p>
    </div>

    <form class="mt-8 space-y-6" on:submit|preventDefault={step === 'email' ? handleSendOTP : handleVerifyOTP}>
      {#if step === 'email'}
        <!-- Email Step -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              bind:value={email}
              on:keydown={handleKeyPress}
              required
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- Error Message -->
        {#if error}
          <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">Error</p>
              <p class="text-sm">{error}</p>
            </div>
          </div>
        {/if}

        <!-- Success Message for OTP Sent -->
        {#if otpSent && !error}
          <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">OTP Sent Successfully</p>
              <p class="text-sm">Please check your email for the verification code.</p>
            </div>
          </div>
        {/if}

        <!-- Rate Limiting Info -->
        {#if step === 'otp' && attemptsRemaining < 3}
          <div class="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg">
            <p class="text-sm">
              {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
            </p>
          </div>
        {/if}

        <!-- Network Status -->
        {#if browser && !navigator.onLine}
          <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            <p class="text-sm font-medium">No Internet Connection</p>
            <p class="text-sm">Please check your network connection and try again.</p>
          </div>
        {/if}

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isLoading || (browser && !navigator.onLine)}
          class="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {#if isLoading}
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending OTP...</span>
          {:else}
            <span>Send OTP</span>
            <ArrowRight class="w-5 h-5" />
          {/if}
        </button>

      {:else}
        <!-- OTP Step -->
        <div>
          <label for="otp" class="block text-sm font-medium text-gray-700 mb-1">
            Enter 6-Digit Code
          </label>
          <input
            id="otp"
            type="text"
            bind:value={otp}
            on:input={handleOTPInput}
            on:keydown={handleKeyPress}
            maxlength="6"
            required
            disabled={isLoading}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-center text-2xl font-mono tracking-widest disabled:opacity-50"
            placeholder="000000"
          />
          <p class="text-xs text-gray-500 mt-2 text-center">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <!-- Error Message -->
        {#if error}
          <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">Verification Failed</p>
              <p class="text-sm">{error}</p>
            </div>
          </div>
        {/if}

        <!-- Attempts Remaining -->
        {#if attemptsRemaining < 3 && attemptsRemaining > 0}
          <div class="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg">
            <p class="text-sm">
              {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
            </p>
          </div>
        {/if}

        <!-- Resend OTP -->
        <div class="text-center">
          {#if countdown > 0}
            <p class="text-sm text-gray-500">
              Resend OTP in <span class="font-medium text-primary-600">{countdown}s</span>
            </p>
          {:else}
            <button
              type="button"
              on:click={resendOTP}
              disabled={isLoading || (browser && !navigator.onLine)}
              class="text-sm text-primary-600 hover:text-primary-500 font-medium disabled:opacity-50 flex items-center space-x-1 mx-auto"
            >
              <RefreshCw class="w-4 h-4" />
              <span>Resend OTP</span>
            </button>
          {/if}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isLoading || otp.length !== 6 || (browser && !navigator.onLine)}
          class="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isLoading}
            <div class="flex items-center justify-center space-x-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          {:else}
            Verify & Sign In
          {/if}
        </button>

        <!-- Back Button -->
        <button
          type="button"
          on:click={goBackToEmail}
          disabled={isLoading}
          class="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
        >
          ← Back to email
        </button>
      {/if}

      <!-- Development Mode Notice -->
      {#if import.meta.env.DEV}
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="text-sm font-medium text-blue-900 mb-2">Development Mode:</h4>
          {#if step === 'email'}
            <p class="text-sm text-blue-700">
              In development, any valid email will work. The OTP will be logged to the console.
            </p>
          {:else}
            <p class="text-sm text-blue-700">
              Use OTP: <code class="font-mono bg-blue-100 px-1 rounded">123456</code> for testing.
            </p>
          {/if}
        </div>
      {/if}

      <!-- API Status -->
      {#if import.meta.env.DEV}
        <div class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p class="text-xs text-gray-600">
            API Endpoint: {import.meta.env.VITE_API_BASE_URL || 'https://api.republicschool.edu'}
          </p>
        </div>
      {/if}

      <!-- Sign Up Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <button type="button" class="text-primary-600 hover:text-primary-500 font-medium">
            Contact Admissions
          </button>
        </p>
      </div>
    </form>
  </div>
</div>