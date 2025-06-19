<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore, type User } from '$lib/stores/auth';
  import { authService, userService, ApiError } from '$lib/utils/api';
  import EditProfile from '$lib/components/EditProfile.svelte';

  let currentUser: User | null = null;
  let isLoading: boolean = true;
  let errorMessage: string | null = null;
  let showEditMode: boolean = false;

  // Helper to check if essential profile fields are missing
  function isProfileEffectivelyIncomplete(user: User | null): boolean {
    if (!user) return true;
    // Define "essential" as missing firstName, lastName, or key profileData fields
    return !user.firstName || 
           !user.lastName || 
           !user.profileData?.personal?.gender ||
           !user.profileData?.education?.lastQualificationDegree; 
           // Add more checks as needed for "completeness"
  }

  authStore.subscribe(value => {
    if (!value.isAuthenticated && typeof window !== 'undefined') {
      if ($page.url.pathname !== '/login') {
        goto('/login');
      }
    }
    currentUser = value.user;
    if (currentUser && isProfileEffectivelyIncomplete(currentUser) && !$page.url.searchParams.has('view')) {
        showEditMode = true;
    }
  });

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 0)); 

    if (!$authStore.isAuthenticated) {
      if ($page.url.pathname !== '/login') goto('/login');
      return;
    }

    const editParam = $page.url.searchParams.get('edit');
    if (editParam === 'true') {
      showEditMode = true;
    }
    
    const userId = currentUser?._id || currentUser?.id;

    if (userId) {
      isLoading = true;
      errorMessage = null;
      try {
        let userToStore: User | null = null;
        const initialProfile = await authService.getProfile();

        if (initialProfile && initialProfile.data) {
          let fetchedUser = initialProfile.data as User;
          fetchedUser.id = fetchedUser._id || fetchedUser.id; 
          userToStore = fetchedUser;

          if (!fetchedUser.applicationId && fetchedUser.id) {
            console.log('ApplicationId missing from /auth/profile, fetching from /users/get/:id');
            try {
              const fullUserResponse = await userService.getUserById(fetchedUser.id);
              if (fullUserResponse && fullUserResponse.data) {
                userToStore = fullUserResponse.data as User;
                userToStore.id = userToStore._id || userToStore.id; 
              } else {
                console.warn('Failed to get full user details from /users/get/:id');
              }
            } catch (userGetError) {
              console.error('Error fetching full user details from /users/get/:id:', userGetError);
            }
          }
        } else {
           errorMessage = 'Failed to load profile data from /auth/profile.';
        }

        if (userToStore) {
          authStore.setUser(userToStore); 
          // currentUser is updated by subscription. Re-check edit mode based on new data.
          if (isProfileEffectivelyIncomplete(userToStore) && !$page.url.searchParams.has('view')) {
            showEditMode = true;
          }
        } else if (!errorMessage) { 
            errorMessage = 'Could not retrieve user profile information.';
        }

      } catch (error) {
        if (error instanceof ApiError) {
          errorMessage = error.data?.message || error.message || 'Failed to load profile.';
        } else {
          errorMessage = (error as Error).message || 'An unexpected error occurred.';
        }
        console.error('Error fetching profile onMount:', error);
      } finally {
        isLoading = false;
      }
    } else {
      errorMessage = 'User session not found. Please try logging in again.';
      isLoading = false;
      if (typeof window !== 'undefined' && $page.url.pathname !== '/login') {
        goto('/login');
      }
    }
  });

  function toggleEditMode(saveSuccess?: boolean) {
    if (saveSuccess) {
        showEditMode = false;
        if ($page.url.searchParams.has('edit')) {
            goto('/profile', { replaceState: true });
        }
    } else {
        showEditMode = !showEditMode;
    }
  }

  function handleProfileUpdated(event: CustomEvent<{ user: User }>) {
    authStore.setUser(event.detail.user); 
    currentUser = event.detail.user; 
    toggleEditMode(true); 
  }
</script>

<svelte:head>
  <title>User Profile - Republic School</title>
</svelte:head>

<div class="container mx-auto p-4 md:p-8">
  {#if isLoading}
    <p class="text-center text-gray-600">Loading profile...</p>
  {:else if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
      {#if !currentUser} 
      <p>Please try <a href="/login" class="underline">logging in</a> again.</p>
      {/if}
    </div>
  {:else if currentUser}
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">
          {showEditMode ? 'Edit Profile' : 'User Profile'}
        </h1>
        {#if !showEditMode}
        <button
          on:click={() => toggleEditMode()}
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Profile
        </button>
        {/if}
      </div>

      {#if showEditMode}
        <EditProfile user={currentUser} on:profileUpdated={handleProfileUpdated} on:cancelEdit={() => toggleEditMode()} />
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">Personal Information</h2>
            <p><strong>Full Name:</strong> {currentUser.firstName || 'N/A'} {currentUser.lastName || ''}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <!-- 'contact' (simple phone) is not in GET User model, it's part of Update DTO -->
            <!-- <p><strong>Contact:</strong> {currentUser.contact || 'N/A'}</p> --> 
            <!-- 'dob' (simple date) is not in GET User model, it's part of Update DTO -->
            <!-- <p><strong>Date of Birth:</strong> {currentUser.dob ? new Date(currentUser.dob).toLocaleDateString() : 'N/A'}</p> -->
            <p><strong>Gender:</strong> {currentUser.profileData?.personal?.gender || 'N/A'}</p>
            <p><strong>Nationality:</strong> {currentUser.profileData?.personal?.nationality || 'N/A'}</p>
            <p><strong>Profile Photo:</strong> {#if currentUser.profileData?.personal?.profilePhoto}<img src={currentUser.profileData.personal.profilePhoto} alt="Profile" class="w-16 h-16 rounded-md object-cover inline-block ml-2"/>{:else}N/A{/if}</p>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">Details</h2>
            <p><strong>Permanent Address:</strong> {currentUser.profileData?.address?.permanentAddress || 'N/A'}</p>
            <p><strong>Current City:</strong> {currentUser.profileData?.address?.currentCity || 'N/A'}</p>
            <p><strong>Qualification:</strong> {currentUser.profileData?.education?.lastQualificationDegree || 'N/A'}</p>
            <p><strong>Institution:</strong> {currentUser.profileData?.education?.lastQualificationUniversity || 'N/A'}</p>
            <p><strong>Languages:</strong> {currentUser.profileData?.additional?.languages || 'N/A'}</p>
            <p><strong>Blood Group:</strong> {currentUser.profileData?.medical?.bloodGroup || 'N/A'}</p>
            <p><strong>Role:</strong> {currentUser.role}</p>
            {#if currentUser.applicationId}
              <p><strong>Application ID:</strong> {currentUser.applicationId}</p>
            {:else}
              <p><strong>Application ID:</strong> <span class="text-gray-500">Not available</span></p>
            {/if}
          </div>
        </div>
        {#if isProfileEffectivelyIncomplete(currentUser)}
            <div class="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                <p class="font-semibold">Your profile may be incomplete.</p>
                <p>Please <button class="underline" on:click={() => toggleEditMode()}>review and complete your profile</button> to ensure all information is up to date.</p>
            </div>
        {/if}
      {/if}
    </div>
  {:else}
    <p class="text-center text-gray-600">Could not load user profile. You might not be logged in.</p>
    <p class="text-center mt-2"><a href="/login" class="text-indigo-600 hover:text-indigo-700">Go to Login</a></p>
  {/if}
</div>
