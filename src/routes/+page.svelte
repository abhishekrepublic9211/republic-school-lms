<script lang="ts">
  import { onMount } from "svelte";
  onMount(() => {
    window.location.href = "/login";
  });
</script>

<svelte:head>
  <title>Republic School of Journalism - E-Learning Platform</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="text-center">
    <div
      class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4"
    >
      <span class="text-white font-bold text-2xl">R</span>
    </div>
    <h1 class="text-2xl font-bold text-gray-900 mb-2">
      Republic School of Journalism
    </h1>
    <p class="text-gray-600">Loading...</p>
  </div>
</div>
