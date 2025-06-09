<script lang="ts">
  import { Search, Plus, ThumbsUp, MessageCircle, CheckCircle, Filter } from 'lucide-svelte';
  import { doubts, doubtCategories } from '$lib/stores/doubts';
  import { currentUser } from '$lib/stores/auth';
  import type { Doubt } from '$lib/stores/doubts';

  let searchQuery = '';
  let selectedCategory = '';
  let showResolved = false;
  let showNewDoubtForm = false;
  let newDoubtTitle = '';
  let newDoubtContent = '';
  let newDoubtCategory = '';
  let newDoubtTags = '';

  // Filter doubts
  $: filteredDoubts = $doubts.filter(doubt => {
    const matchesSearch = doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doubt.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || doubt.category === selectedCategory;
    const matchesResolved = showResolved || !doubt.isResolved;
    
    return matchesSearch && matchesCategory && matchesResolved;
  });

  function submitDoubt() {
    if (!newDoubtTitle.trim() || !newDoubtContent.trim()) return;

    const newDoubt: Doubt = {
      id: Date.now().toString(),
      title: newDoubtTitle.trim(),
      content: newDoubtContent.trim(),
      category: newDoubtCategory || 'General',
      authorId: $currentUser?.id || '1',
      authorName: $currentUser?.name || 'You',
      authorAvatar: $currentUser?.avatar || '',
      timestamp: new Date().toISOString(),
      upvotes: 0,
      isResolved: false,
      tags: newDoubtTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      responses: []
    };

    doubts.update(doubtList => [newDoubt, ...doubtList]);
    
    // Reset form
    newDoubtTitle = '';
    newDoubtContent = '';
    newDoubtCategory = '';
    newDoubtTags = '';
    showNewDoubtForm = false;
  }

  function upvoteDoubt(doubtId: string) {
    doubts.update(doubtList => 
      doubtList.map(doubt => 
        doubt.id === doubtId 
          ? { ...doubt, upvotes: doubt.upvotes + 1 }
          : doubt
      )
    );
  }

  function getTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  }
</script>

<svelte:head>
  <title>Doubts - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Doubts & Questions</h1>
      <p class="text-gray-600 mt-1">Ask questions and get help from instructors and peers</p>
    </div>
    
    <button 
      on:click={() => showNewDoubtForm = true}
      class="mt-4 md:mt-0 btn btn-primary flex items-center space-x-2"
    >
      <Plus class="w-4 h-4" />
      <span>Ask Question</span>
    </button>
  </div>

  <!-- Search and Filters -->
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-1 relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search doubts and questions..."
        bind:value={searchQuery}
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
    
    <select
      bind:value={selectedCategory}
      class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
    >
      <option value="">All Categories</option>
      {#each $doubtCategories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
    
    <label class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg">
      <input
        type="checkbox"
        bind:checked={showResolved}
        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <span class="text-sm text-gray-700">Show resolved</span>
    </label>
  </div>

  <!-- Doubts List -->
  <div class="space-y-4">
    {#each filteredDoubts as doubt}
      <div class="card p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{doubt.title}</h3>
              {#if doubt.isResolved}
                <CheckCircle class="w-5 h-5 text-success-500" />
              {/if}
            </div>
            
            <p class="text-gray-600 mb-3">{doubt.content}</p>
            
            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div class="flex items-center space-x-1">
                <img 
                  src={doubt.authorAvatar} 
                  alt={doubt.authorName}
                  class="w-5 h-5 rounded-full object-cover"
                />
                <span>{doubt.authorName}</span>
              </div>
              <span>{getTimeAgo(doubt.timestamp)}</span>
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {doubt.category}
              </span>
              {#if doubt.courseName}
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {doubt.courseName}
                </span>
              {/if}
            </div>
            
            <!-- Tags -->
            {#if doubt.tags.length > 0}
              <div class="flex flex-wrap gap-1 mb-3">
                {#each doubt.tags as tag}
                  <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                    #{tag}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              on:click={() => upvoteDoubt(doubt.id)}
              class="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors duration-200"
            >
              <ThumbsUp class="w-4 h-4" />
              <span class="text-sm">{doubt.upvotes}</span>
            </button>
            
            <button class="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors duration-200">
              <MessageCircle class="w-4 h-4" />
              <span class="text-sm">{doubt.responses.length} responses</span>
            </button>
          </div>
          
          <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Details
          </button>
        </div>
        
        <!-- Responses Preview -->
        {#if doubt.responses.length > 0}
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="space-y-3">
              {#each doubt.responses.slice(0, 2) as response}
                <div class="flex items-start space-x-3">
                  <img 
                    src={response.authorAvatar} 
                    alt={response.authorName}
                    class="w-8 h-8 rounded-full object-cover"
                  />
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm font-medium text-gray-900">{response.authorName}</span>
                      {#if response.authorRole === 'instructor'}
                        <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                          Instructor
                        </span>
                      {/if}
                      {#if response.isAccepted}
                        <CheckCircle class="w-4 h-4 text-success-500" />
                      {/if}
                    </div>
                    <p class="text-sm text-gray-600">{response.content}</p>
                  </div>
                </div>
              {/each}
              
              {#if doubt.responses.length > 2}
                <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all {doubt.responses.length} responses
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    {/each}
    
    {#if filteredDoubts.length === 0}
      <div class="text-center py-12">
        <MessageCircle class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No doubts found</h3>
        <p class="text-gray-500">Try adjusting your search or ask a new question</p>
      </div>
    {/if}
  </div>
</div>

<!-- New Doubt Modal -->
{#if showNewDoubtForm}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Ask a Question</h2>
        <button 
          on:click={() => showNewDoubtForm = false}
          class="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <form on:submit|preventDefault={submitDoubt} class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Question Title
          </label>
          <input
            id="title"
            type="text"
            bind:value={newDoubtTitle}
            placeholder="What's your question about?"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            bind:value={newDoubtCategory}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a category</option>
            {#each $doubtCategories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
            Question Details
          </label>
          <textarea
            id="content"
            bind:value={newDoubtContent}
            placeholder="Provide more details about your question..."
            rows="6"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>
        
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
            Tags (optional)
          </label>
          <input
            id="tags"
            type="text"
            bind:value={newDoubtTags}
            placeholder="Enter tags separated by commas"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p class="text-xs text-gray-500 mt-1">e.g., research, writing, ethics</p>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button 
            type="button"
            on:click={() => showNewDoubtForm = false}
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!newDoubtTitle.trim() || !newDoubtContent.trim()}
            class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Question
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}