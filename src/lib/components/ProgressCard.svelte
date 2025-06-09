<script lang="ts">
  export let title: string;
  export let count: number;
  export let total: number;
  export let color: string = 'primary';
  export let icon: string = '';
  
  $: percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  const colorClasses = {
    primary: 'from-primary-400 to-primary-600',
    secondary: 'from-secondary-400 to-secondary-600',
    success: 'from-success-400 to-success-600',
    warning: 'from-warning-400 to-warning-600',
    pink: 'from-pink-400 to-pink-600',
    purple: 'from-purple-400 to-purple-600'
  };
  
  const gradientClass = colorClasses[color] || colorClasses.primary;
  
  // Calculate stroke dash array for progress circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
</script>

<div class="card p-6 hover:shadow-lg transition-all duration-300 group">
  <div class="flex items-center justify-between mb-4">
    <div class="flex-1">
      <h3 class="text-2xl font-bold text-gray-900 mb-1">{count}</h3>
      <p class="text-sm text-gray-600 font-medium">{title}</p>
      <p class="text-xs text-gray-400 mt-1">of {total} completed</p>
    </div>
    
    <!-- Progress Circle -->
    <div class="relative w-20 h-20">
      <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
        <!-- Background circle -->
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          stroke-width="8"
          fill="none"
          class="text-gray-200"
        />
        <!-- Progress circle -->
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#gradient-{color})"
          stroke-width="8"
          fill="none"
          class="progress-ring transition-all duration-700 ease-out"
          stroke-linecap="round"
          stroke-dasharray={strokeDasharray}
          stroke-dashoffset={strokeDashoffset}
        />
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="gradient-{color}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" class="text-{color}-400" stop-color="currentColor"/>
            <stop offset="100%" class="text-{color}-600" stop-color="currentColor"/>
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Percentage text -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-sm font-bold text-gray-700">{percentage}%</span>
      </div>
    </div>
  </div>
  
  <!-- Icon or additional info -->
  {#if icon}
    <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br {gradientClass} text-white mb-2 group-hover:scale-110 transition-transform duration-200">
      <span class="text-xl">{icon}</span>
    </div>
  {/if}
</div>

<style>
  .progress-ring {
    transition: stroke-dashoffset 0.7s ease-out;
  }
</style>