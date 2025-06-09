<script lang="ts">
  import { Calendar, Clock, AlertCircle, FileText, CheckCircle, Filter } from 'lucide-svelte';
  import { assignments } from '$lib/stores/assignments';
  import type { Assignment } from '$lib/stores/assignments';

  let selectedStatus = '';
  let selectedType = '';
  let selectedPriority = '';

  // Filter assignments
  $: filteredAssignments = $assignments.filter(assignment => {
    const matchesStatus = !selectedStatus || assignment.status === selectedStatus;
    const matchesType = !selectedType || assignment.type === selectedType;
    const matchesPriority = !selectedPriority || assignment.priority === selectedPriority;
    
    return matchesStatus && matchesType && matchesPriority;
  });

  // Group assignments by status
  $: pendingAssignments = filteredAssignments.filter(a => a.status === 'pending');
  $: submittedAssignments = filteredAssignments.filter(a => a.status === 'submitted');
  $: gradedAssignments = filteredAssignments.filter(a => a.status === 'graded');
  $: overdueAssignments = filteredAssignments.filter(a => a.status === 'overdue');

  function getDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'graded': return 'bg-success-100 text-success-700 border-success-200';
      case 'overdue': return 'bg-error-100 text-error-700 border-error-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-error-100 text-error-700 border-error-200';
      case 'medium': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low': return 'bg-success-100 text-success-700 border-success-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  function startAssignment(assignmentId: string) {
    console.log('Starting assignment:', assignmentId);
  }

  function viewSubmission(assignmentId: string) {
    console.log('Viewing submission:', assignmentId);
  }
</script>

<svelte:head>
  <title>Assignments - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Assignments</h1>
      <p class="text-gray-600 mt-1">Track and manage your course assignments</p>
    </div>
    
    <!-- Filters -->
    <div class="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
      <select
        bind:value={selectedStatus}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="submitted">Submitted</option>
        <option value="graded">Graded</option>
        <option value="overdue">Overdue</option>
      </select>
      
      <select
        bind:value={selectedType}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Types</option>
        <option value="assignment">Assignment</option>
        <option value="test">Test</option>
        <option value="project">Project</option>
      </select>
      
      <select
        bind:value={selectedPriority}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  </div>

  <!-- Stats Overview -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Pending</p>
          <p class="text-2xl font-bold text-warning-600">{pendingAssignments.length}</p>
        </div>
        <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
          <Clock class="w-6 h-6 text-warning-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Submitted</p>
          <p class="text-2xl font-bold text-blue-600">{submittedAssignments.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText class="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Graded</p>
          <p class="text-2xl font-bold text-success-600">{gradedAssignments.length}</p>
        </div>
        <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
          <CheckCircle class="w-6 h-6 text-success-600" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Overdue</p>
          <p class="text-2xl font-bold text-error-600">{overdueAssignments.length}</p>
        </div>
        <div class="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
          <AlertCircle class="w-6 h-6 text-error-600" />
        </div>
      </div>
    </div>
  </div>

  <!-- Assignments List -->
  <div class="space-y-6">
    {#if filteredAssignments.length === 0}
      <div class="text-center py-12">
        <FileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
        <p class="text-gray-500">Try adjusting your filter criteria</p>
      </div>
    {:else}
      {#each filteredAssignments as assignment}
        <div class="card p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                  <p class="text-sm text-gray-600 mb-2">{assignment.courseName}</p>
                  <p class="text-sm text-gray-500">{assignment.description}</p>
                </div>
                
                <div class="flex flex-col items-end space-y-2 ml-4">
                  <span class="px-3 py-1 text-xs font-medium rounded-full border {getStatusColor(assignment.status)}">
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                  <span class="px-2 py-1 text-xs font-medium rounded-full border {getPriorityColor(assignment.priority)}">
                    {assignment.priority} priority
                  </span>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div class="flex items-center space-x-1">
                  <Calendar class="w-4 h-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div class="flex items-center space-x-1">
                  <FileText class="w-4 h-4" />
                  <span>{assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}</span>
                </div>
                
                <div class="flex items-center space-x-1">
                  {#if getDaysUntilDue(assignment.dueDate) < 0}
                    <AlertCircle class="w-4 h-4 text-error-500" />
                    <span class="text-error-600 font-medium">
                      {Math.abs(getDaysUntilDue(assignment.dueDate))} days overdue
                    </span>
                  {:else if getDaysUntilDue(assignment.dueDate) <= 2}
                    <AlertCircle class="w-4 h-4 text-warning-500" />
                    <span class="text-warning-600 font-medium">
                      Due {getDaysUntilDue(assignment.dueDate) === 0 ? 'today' : `in ${getDaysUntilDue(assignment.dueDate)} days`}
                    </span>
                  {:else}
                    <Clock class="w-4 h-4" />
                    <span>{getDaysUntilDue(assignment.dueDate)} days left</span>
                  {/if}
                </div>
                
                <div class="flex items-center space-x-1">
                  <span>Max Grade: {assignment.maxGrade}</span>
                </div>
              </div>
              
              {#if assignment.grade !== undefined}
                <div class="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-success-800">Grade Received</span>
                    <span class="text-lg font-bold text-success-700">{assignment.grade}/{assignment.maxGrade}</span>
                  </div>
                  {#if assignment.feedback}
                    <p class="text-sm text-success-700">{assignment.feedback}</p>
                  {/if}
                </div>
              {/if}
            </div>
            
            <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
              {#if assignment.status === 'pending'}
                <button 
                  on:click={() => startAssignment(assignment.id)}
                  class="btn btn-primary"
                >
                  Start {assignment.type === 'assignment' ? 'Assignment' : assignment.type === 'test' ? 'Test' : 'Project'}
                </button>
              {:else if assignment.status === 'submitted' || assignment.status === 'graded'}
                <button 
                  on:click={() => viewSubmission(assignment.id)}
                  class="btn btn-secondary"
                >
                  View Submission
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>