<script lang="ts">
  import { sendOTP, verifyOTP } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { Mail, ArrowRight, RefreshCw } from 'lucide-svelte';

  let email = '';
  let otp = '';
  let step = 'email'; // 'email' or 'otp'
  let isLoading = false;
  let error = '';
  let otpSent = false;
  let countdown = 0;
  let countdownInterval: number;

  async function handleSendOTP() {
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    if (!email.includes('@')) {
      error = 'Please enter a valid email address';
      return;
    }

    isLoading = true;
    error = '';

    try {
      const success = await sendOTP(email);
      
      if (success) {
        step = 'otp';
        otpSent = true;
        startCountdown();
      } else {
        error = 'Failed to send OTP. Please try again.';
      }
    } catch (err) {
      error = 'Something went wrong. Please try again.';
    }
    
    isLoading = false;
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

    isLoading = true;
    error = '';

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = verifyOTP(email, otp);
    
    if (success) {
      goto('/dashboard');
    } else {
      error = 'Invalid OTP. Please try again.';
      otp = '';
    }
    
    isLoading = false;
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
    
    isLoading = true;
    error = '';
    
    try {
      const success = await sendOTP(email);
      if (success) {
        startCountdown();
        error = '';
      } else {
        error = 'Failed to resend OTP. Please try again.';
      }
    } catch (err) {
      error = 'Something went wrong. Please try again.';
    }
    
    isLoading = false;
  }

  function goBackToEmail() {
    step = 'email';
    otp = '';
    error = '';
    otpSent = false;
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
          <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        {/if}

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isLoading}
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
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-center text-2xl font-mono tracking-widest"
            placeholder="000000"
          />
          <p class="text-xs text-gray-500 mt-2 text-center">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <!-- Error Message -->
        {#if error}
          <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            {error}
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
              disabled={isLoading}
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
          disabled={isLoading || otp.length !== 6}
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
          class="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back to email
        </button>
      {/if}

      <!-- Demo Instructions -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 mb-2">Demo Instructions:</h4>
        {#if step === 'email'}
          <p class="text-sm text-blue-700">
            Enter any valid email address to receive an OTP. Check the browser console for the demo OTP code.
          </p>
        {:else}
          <p class="text-sm text-blue-700">
            Check the browser console (F12) for the 6-digit OTP code to complete the login.
          </p>
        {/if}
      </div>

      <!-- Sign Up Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <button type="button" class="text-primary-600 hover:text-primary-500 font-medium">
            Sign up for free
          </button>
        </p>
      </div>
    </form>
  </div>
</div>