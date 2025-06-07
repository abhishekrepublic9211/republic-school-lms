<script lang="ts">
  import Layout from '../components/Layout.svelte';
  import AssignmentCard from '../components/AssignmentCard.svelte';
  import { assignments, type Assignment } from '../stores/assignments';
  import { Upload, FileText, CheckCircle } from 'lucide-svelte';
  
  let showSubmissionModal = false;
  let selectedAssignment: Assignment | null = null;
  let submissionFile: File | null = null;
  let submissionNotes = '';
  
  function openSubmissionModal(assignment: Assignment) {
    selectedAssignment = assignment;
    showSubmissionModal = true;
  }
  
  function closeSubmissionModal() {
    showSubmissionModal = false;
    selectedAssignment = null;
    submissionFile = null;
    submissionNotes = '';
  }
  
  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      submissionFile = target.files[0];
    }
  }
  
  function submitAssignment() {
    if (!selectedAssignment || !submissionFile) return;
    
    // Mock submission process
    const submissionUrl = `/submissions/${selectedAssignment.id}_${submissionFile.name}`;
    const submittedDate = new Date().toISOString();
    
    assignments.update(assignmentList => 
      assignmentList.map(assignment => 
        assignment.id === selectedAssignment.id 
          ? { 
              ...assignment, 
              status: 'submitted' as const,
              submissionUrl,
              submittedDate,
              submissionDate: submittedDate
            }
          : assignment
      )
    );
    
    closeSubmissionModal();
  }
</script>

<Layout>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Assignments</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each $assignments as assignment (assignment.id)}
        <div class="relative">
          <AssignmentCard {assignment} />
          {#if assignment.status === 'pending'}
            <div class="mt-3">
              <button 
                class="w-full btn btn-primary text-sm py-2 flex items-center justify-center space-x-2"
                on:click={() => openSubmissionModal(assignment)}
              >
                <Upload class="w-4 h-4" />
                <span>Submit Assignment</span>
              </button>
            </div>
          {:else if assignment.status === 'submitted'}
            <div class="mt-3 p-2 bg-blue-50 rounded-lg">
              <div class="flex items-center space-x-2 text-blue-700">
                <CheckCircle class="w-4 h-4" />
                <span class="text-sm font-medium">Submitted</span>
              </div>
              {#if assignment.submittedDate}
                <p class="text-xs text-blue-600 mt-1">
                  Submitted on {new Date(assignment.submittedDate).toLocaleDateString()}
                </p>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Submission Modal -->
  {#if showSubmissionModal && selectedAssignment}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Submit Assignment</h3>
        
        <div class="mb-4">
          <h4 class="font-medium text-gray-900">{selectedAssignment.title}</h4>
          <p class="text-sm text-gray-600">{selectedAssignment.courseName}</p>
          <p class="text-xs text-gray-500">Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <input
              type="file"
              on:change={handleFileSelect}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              accept=".pdf,.doc,.docx,.txt"
            />
            {#if submissionFile}
              <div class="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <FileText class="w-4 h-4" />
                <span>{submissionFile.name}</span>
              </div>
            {/if}
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              bind:value={submissionNotes}
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any additional notes for your instructor..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex space-x-3 mt-6">
          <button
            class="flex-1 btn btn-primary"
            on:click={submitAssignment}
            disabled={!submissionFile}
          >
            Submit
          </button>
          <button
            class="flex-1 btn btn-secondary"
            on:click={closeSubmissionModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</Layout>
