<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { assignments } from '../stores/dashboard';
  import { onMount } from 'svelte';
  
  let currentDate = new Date();
  let selectedDate: Date | null = null;
  
  $: currentMonth = currentDate.getMonth();
  $: currentYear = currentDate.getFullYear();
  $: monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Get days in current month
  $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  $: firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Generate calendar grid
  $: calendarDays = generateCalendarDays();
  
  function generateCalendarDays() {
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }
  
  function navigateMonth(direction: 'prev' | 'next') {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    currentDate = newDate;
  }
  
  function isToday(day: number | null): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  }
  
  function isSelected(day: number | null): boolean {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  }
  
  function hasAssignment(day: number | null): boolean {
    if (!day) return false;
    const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return $assignments.some(assignment => 
      assignment.dueDate.startsWith(dateString) && !assignment.completed
    );
  }
  
  function selectDate(day: number | null) {
    if (!day) return;
    selectedDate = new Date(currentYear, currentMonth, day);
  }
  
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
</script>

<div class="card p-6">
  <!-- Calendar Header -->
  <div class="flex items-center justify-between mb-6">
    <h3 class="font-semibold text-gray-900">Calendar</h3>
    <div class="flex items-center space-x-2">
      <button
        class="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        on:click={() => navigateMonth('prev')}
        aria-label="Previous month"
      >
        <ChevronLeft class="w-4 h-4 text-gray-600" />
      </button>
      
      <span class="text-sm font-medium text-gray-900 min-w-32 text-center">
        {monthName}
      </span>
      
      <button
        class="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        on:click={() => navigateMonth('next')}
        aria-label="Next month"
      >
        <ChevronRight class="w-4 h-4 text-gray-600" />
      </button>
    </div>
  </div>
  
  <!-- Week Days Header -->
  <div class="grid grid-cols-7 gap-1 mb-2">
    {#each weekDays as weekDay}
      <div class="text-center text-xs font-medium text-gray-500 py-2">
        {weekDay}
      </div>
    {/each}
  </div>
  
  <!-- Calendar Grid -->
  <div class="grid grid-cols-7 gap-1">
    {#each calendarDays as day}
      <button
        class="relative h-10 w-10 mx-auto flex items-center justify-center text-sm rounded-lg transition-all duration-200 {
          day === null 
            ? 'cursor-default' 
            : isToday(day)
              ? 'bg-primary-600 text-white font-bold'
              : isSelected(day)
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'hover:bg-gray-100 text-gray-700'
        }"
        on:click={() => selectDate(day)}
        disabled={day === null}
        aria-label={day ? `Select ${monthName} ${day}` : ''}
      >
        {day || ''}
        
        <!-- Assignment indicator -->
        {#if hasAssignment(day)}
          <div class="absolute bottom-1 right-1 w-2 h-2 bg-error-500 rounded-full"></div>
        {/if}
      </button>
    {/each}
  </div>
  
  <!-- Legend -->
  <div class="mt-4 pt-4 border-t border-gray-100">
    <div class="flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center space-x-1">
        <div class="w-2 h-2 bg-primary-600 rounded-full"></div>
        <span>Today</span>
      </div>
      <div class="flex items-center space-x-1">
        <div class="w-2 h-2 bg-error-500 rounded-full"></div>
        <span>Due date</span>
      </div>
    </div>
  </div>
</div>