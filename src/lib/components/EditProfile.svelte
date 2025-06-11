<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { 
    User, 
    // Import the actual ProfileData sub-interfaces
    ProfileData_Personal as UserProfileData_Personal, // From GET response
    ProfileData_Address as UserProfileData_Address,   // From GET response
    ProfileData_Education as UserProfileData_Education, // From GET response
    ProfileData_Medical as UserProfileData_Medical,
    ProfileData_Additional as UserProfileData_Additional
  } from '$lib/stores/auth';
  import { userService, ApiError } from '$lib/utils/api';

  export let user: User;
  const dispatch = createEventDispatcher();

  // Interface for the form data, structured to facilitate building the Update DTO
  interface EditProfileFormData {
    firstName?: string;
    lastName?: string;
    contact?: string; 
    dob?: string;     
    address?: string; 
    qualification?: string; 
    institution?: string;   
    languagesKnown?: string; 
    bloodGroup?: string;     
    medicalConditions?: string;
    allergies?: string;

    // Nested structures for DTO's nested parts
    personal: { // Corresponds to DTO's 'personal' object
        gender?: string;
        alternateContact?: string;
        idProofType?: string;
        idProofNumber?: string;
        // profilePhoto is not in DTO's personal object, but we might display it from GET data
        profilePhoto_display?: string; 
    };
    education: { // Corresponds to DTO's 'education' object { year: string }
        year?: string;
    };
    addressDetails: { // Corresponds to DTO's 'addressDetails' object
        currentAddress?: string;
        currentCity?: string;
        currentState?: string;
        currentPincode?: string;
        permanentAddress?: string;
        permanentCity?: string;
        permanentState?: string;
        permanentPincode?: string;
        sameAsCurrent?: boolean;
    };
    // parentGuardian, emergencyContact, extraData could be added similarly
  }

  let formData: EditProfileFormData = {
    personal: {},
    education: {},
    addressDetails: {}
  };

  onMount(() => {
    formData.firstName = user.firstName || '';
    formData.lastName = user.lastName || '';

    // Initialize DTO root fields from user.profileData where mappings exist, or empty
    // Note: 'contact', 'dob', 'address' (simple) are in DTO root but not User GET root.
    // They must be collected by the form.
    formData.contact = ''; // No direct equivalent in new User GET model for root 'contact'
    formData.dob = '';     // No direct equivalent in new User GET model for root 'dob'
    formData.address = ''; // No direct equivalent for simple root 'address'

    formData.qualification = user.profileData?.education?.lastQualificationDegree || '';
    formData.institution = user.profileData?.education?.lastQualificationUniversity || '';
    formData.languagesKnown = user.profileData?.additional?.languages || ''; // DTO root vs GET profileData.additional
    formData.bloodGroup = user.profileData?.medical?.bloodGroup || ''; // DTO root vs GET profileData.medical
    formData.medicalConditions = user.profileData?.medical?.medicalConditions || '';
    formData.allergies = user.profileData?.medical?.allergies || '';
    
    // Initialize DTO 'personal' object fields
    formData.personal = {
      gender: user.profileData?.personal?.gender || '',
      profilePhoto_display: user.profileData?.personal?.profilePhoto || '', // For display
      alternateContact: '', // Not in GET's profileData.personal
      idProofType: '',      // Not in GET's profileData.personal
      idProofNumber: '',    // Not in GET's profileData.personal
    };

    // Initialize DTO 'education' object { year: string }
    formData.education = {
      year: user.profileData?.education?.lastQualificationYear || '',
    };

    // Initialize DTO 'addressDetails' object
    // GET's profileData.address is different from DTO's addressDetails. Mapping needed.
    formData.addressDetails = {
      currentAddress: '', // GET's profileData.address has no single 'currentAddress' string
      currentCity: user.profileData?.address?.currentCity || '',
      currentState: user.profileData?.address?.currentState || '',
      currentPincode: user.profileData?.address?.currentPincode || '',
      permanentAddress: user.profileData?.address?.permanentAddress || '',
      permanentCity: user.profileData?.address?.permanentCity || '',
      permanentState: user.profileData?.address?.permanentState || '',
      permanentPincode: user.profileData?.address?.permanentPincode || '',
      sameAsCurrent: user.profileData?.address?.sameAsCurrent || false,
    };
  });

  let isLoading: boolean = false;
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  async function handleSubmit() {
    if (!user || !user._id) {
      errorMessage = 'User data is missing. Cannot update profile.';
      return;
    }
    isLoading = true;
    errorMessage = null;
    successMessage = null;

    const updatePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      contact: formData.contact,
      address: formData.address,
      dob: formData.dob,
      qualification: formData.qualification,
      institution: formData.institution,
      languagesKnown: formData.languagesKnown,
      bloodGroup: formData.bloodGroup,
      medicalConditions: formData.medicalConditions,
      allergies: formData.allergies,
      personal: formData.personal, // Send the whole object as structured in formData
      education: formData.education, // Send { year: ... }
      addressDetails: formData.addressDetails,
      // Note: profilePhoto is not part of the documented Update DTO.
      // If it needs to be updated, the DTO must specify how (e.g. personal.profilePhoto or a dedicated endpoint)
    };

    try {
      const response = await userService.updateUser(user._id, updatePayload);
      if (response.data) {
        successMessage = response.message || 'Profile updated successfully!';
        dispatch('profileUpdated', { user: response.data as User });
      } else {
        errorMessage = response.message || 'Failed to update profile.';
      }
    } catch (error) {
      if (error instanceof ApiError) {
        errorMessage = error.data?.message || error.message || 'An error occurred.';
        if (error.data && error.data.errors) { 
          errorMessage = Object.values(error.data.errors).join(', ');
        }
      } else {
        errorMessage = (error as Error).message || 'An unexpected error occurred.';
      }
      console.error('Update profile error:', error);
    } finally {
      isLoading = false;
    }
  }

  function handleCancel() {
    dispatch('cancelEdit');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  {#if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{errorMessage}</span>
    </div>
  {/if}
  {#if successMessage}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{successMessage}</span>
    </div>
  {/if}

  <h3 class="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div><label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label><input type="text" id="firstName" bind:value={formData.firstName} required class="input" /></div>
    <div><label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label><input type="text" id="lastName" bind:value={formData.lastName} required class="input" /></div>
    <div><label for="contact_dto" class="block text-sm font-medium text-gray-700">Contact Number (for DTO)</label><input type="tel" id="contact_dto" bind:value={formData.contact} class="input" /></div>
    <div><label for="dob_dto" class="block text-sm font-medium text-gray-700">Date of Birth (for DTO)</label><input type="date" id="dob_dto" bind:value={formData.dob} class="input" /></div>
    <div>
      <label for="gender_dto" class="block text-sm font-medium text-gray-700">Gender (for DTO)</label>
      <select id="gender_dto" bind:value={formData.personal.gender} class="input">
        <option value={undefined}>Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
      </select>
    </div>
    {#if formData.personal.profilePhoto_display}
      <div><label class="block text-sm font-medium text-gray-700">Current Profile Photo</label><img src={formData.personal.profilePhoto_display} alt="Profile" class="mt-1 w-20 h-20 rounded-md object-cover"/></div>
    {/if}
    <!-- Add input for profilePhoto if updatable via DTO, e.g. formData.personal.profilePhoto -->
  </div>

  <h3 class="mt-6 text-lg font-medium leading-6 text-gray-900">Educational Information</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div><label for="qualification_dto" class="block text-sm font-medium text-gray-700">Qualification (for DTO)</label><input type="text" id="qualification_dto" bind:value={formData.qualification} class="input" /></div>
    <div><label for="institution_dto" class="block text-sm font-medium text-gray-700">Institution (for DTO)</label><input type="text" id="institution_dto" bind:value={formData.institution} class="input" /></div>
    <div><label for="educationYear_dto" class="block text-sm font-medium text-gray-700">Education Year (for DTO)</label><input type="text" id="educationYear_dto" bind:value={formData.education.year} class="input" /></div>
  </div>
  
  <h3 class="mt-6 text-lg font-medium leading-6 text-gray-900">Address Information</h3>
  <div><label for="addressSimple_dto" class="block text-sm font-medium text-gray-700">Address (Simple, for DTO)</label><textarea id="addressSimple_dto" bind:value={formData.address} rows="2" class="input"></textarea></div>
  <div><label for="currentAddress_dto" class="block text-sm font-medium text-gray-700">Current Address (for DTO.addressDetails)</label><textarea id="currentAddress_dto" bind:value={formData.addressDetails.currentAddress} rows="2" class="input"></textarea></div>
  <!-- Add more address fields for DTO: city, state, pincode etc. -->

  <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
    <button type="button" on:click={handleCancel} disabled={isLoading} class="btn-secondary">Cancel</button>
    <button type="submit" disabled={isLoading} class="btn-primary">{isLoading ? 'Saving...' : 'Save Changes'}</button>
  </div>
</form>

<style>
  .input {
    @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
  }
  .btn-primary {
    @apply px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50;
  }
  .btn-secondary {
    @apply px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
  }
</style>
