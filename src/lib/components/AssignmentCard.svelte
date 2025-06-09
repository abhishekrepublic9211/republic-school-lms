<script lang="ts">
  import type { Assignment } from '../stores/assignments';
  import { Calendar, Clock, AlertCircle } from 'lucide-svelte';
  
  export let assignment: Assignment;
  
  const priorityColors = {
    high: 'bg-error-100 text-error-700 border-error-200',
    medium: 'bg-warning-100 text-warning-700 border-warning-200',
    low: 'bg-success-100 text-success-700 border-success-200'
  };
  
  const typeIcons = {
    assignment: '📝',
    test: '📊',
    project: '🚀'
  };
  
  function getDaysUntilDue() {
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  $: daysUntilDue = getDaysUntilDue();
  $: isOverdue = daysUntilDue < 0;
  $: isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0;
  $: completed = assignment.status === 'graded' || assignment.status === 'submitted';
</script>

<div class="card p-4 hover:shadow-md transition-all duration-200 {completed ? 'opacity-60' : ''}">
  <div class="flex items-start justify-between mb-3">
    <div class="flex-1">
      <div class="flex items-center space-x-2 mb-1">
        <span class="text-lg">{typeIcons[assignment.type]}</span>
        <h4 class="font-medium text-gray-900 {completed ? 'line-through' : ''}">{assignment.title}</h4>
      </div>
      <p class="text-sm text-gray-500">{assignment.courseName}</p>
    </div>
    
    <div class="flex flex-col items-end space-y-2">
      <!-- Priority Badge -->
      <span class="px-2 py-1 text-xs font-medium rounded-full border {priorityColors[assignment.priority]}">
        {assignment.priority}
      </span>
      
      <!-- Completion Status -->
      {#if completed}
        <div class="flex items-center space-x-1 text-success-600">
          <Clock class="w-3 h-3" />
          <span class="text-xs font-medium">Completed</span>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Due Date -->
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <Calendar class="w-4 h-4 text-gray-400" />
      <span class="text-sm text-gray-600">Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
    </div>
    
    <!-- Time until due -->
    <div class="flex items-center space-x-1">
      {#if isOverdue}
        <AlertCircle class="w-4 h-4 text-error-500" />
        <span class="text-xs font-medium text-error-600">
          {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue
        </span>
      {:else if isDueSoon}
        <AlertCircle class="w-4 h-4 text-warning-500" />
        <span class="text-xs font-medium text-warning-600">
          Due {daysUntilDue === 0 ? 'today' : `in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
        </span>
      {:else}
        <span class="text-xs text-gray-500">
          {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left
        </span>
      {/if}
    </div>
  </div>
  
  {#if !completed}
    <button class="w-full mt-3 btn btn-primary text-sm py-2">
      Start {assignment.type === 'assignment' ? 'Assignment' : assignment.type === 'test' ? 'Test' : 'Project'}
    </button>
  {/if}
</div>
