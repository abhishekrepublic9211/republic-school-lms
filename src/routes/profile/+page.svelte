<script lang="ts">
  import type { PageData } from './$types';
  import { FileEdit as Edit, Mail, Phone, MapPin, Calendar, User, BookOpen, Heart, Globe, Award, FileText, Users, Briefcase, Save, X } from 'lucide-svelte';
  import { currentUser, updateUser, authLoading } from '$lib/stores/auth';
  import { profileAPI } from '$lib/api/profile';
  import type { ProfileUpdateRequest } from '$lib/api/profile';
  import { onMount } from 'svelte';

  export let data: PageData;

  let isEditing = false;
  let isSaving = false;
  let saveError = '';
  let saveSuccess = '';
  let avatarFile: File | null = null;
  let avatarPreview = '';
  let activeSection = 'personal'; // Track which section is being edited

  // Initialize with data from load function
  $: if (data.profile && !isEditing) {
    initializeProfileData(data.profile);
  }

  $: loadError = data.error;
  
  let profileData = {
    // Personal Information
    personal: {
      name: $currentUser?.name || '',
      email: $currentUser?.email || '',
      phone: $currentUser?.phone || '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      religion: '',
      category: '',
      maritalStatus: '',
      profilePhoto: $currentUser?.avatar || ''
    },
    
    // Address Information
    address: {
      currentAddress: '',
      currentCity: '',
      currentState: '',
      currentPincode: '',
      permanentAddress: '',
      permanentCity: '',
      permanentState: '',
      permanentPincode: '',
      sameAsCurrent: false
    },
    
    // Educational Background
    education: {
      tenthBoard: '',
      tenthSchool: '',
      tenthYear: '',
      tenthPercentage: '',
      twelfthBoard: '',
      twelfthSchool: '',
      twelfthYear: '',
      twelfthPercentage: '',
      graduationDegree: '',
      graduationUniversity: '',
      graduationYear: '',
      graduationPercentage: '',
      postGraduationDegree: '',
      postGraduationUniversity: '',
      postGraduationYear: '',
      postGraduationPercentage: '',
      lastQualificationDegree: '',
      lastQualificationInstitution: '',
      lastQualificationYear: ''
    },
    
    // Parent/Guardian Information
    parentGuardian: {
      name: '',
      relationship: '',
      contactNumber: '',
      email: '',
      occupation: '',
      address: ''
    },
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      contactNumber: '',
      email: '',
      address: ''
    },
    
    // Medical Information
    medical: {
      bloodGroup: '',
      medicalConditions: '',
      allergies: '',
      medications: ''
    },
    
    // Professional Information
    professional: {
      currentEmployment: '',
      designation: '',
      organization: '',
      workExperience: '',
      previousEmployment: '',
      skills: ''
    },
    
    // Course & Learning Information
    learning: {
      courseInterests: '',
      careerGoals: '',
      technicalSkills: '',
      preferredLearningStyle: '',
      expectations: ''
    },
    
    // Additional Information
    additional: {
      languages: '',
      hobbies: '',
      achievements: '',
      extracurricular: '',
      socialMedia: ''
    },
    
    // References
    references: {
      academicRefName: '',
      academicRefDesignation: '',
      academicRefInstitution: '',
      academicRefContact: '',
      professionalRefName: '',
      professionalRefDesignation: '',
      professionalRefOrganization: '',
      professionalRefContact: ''
    }
  };

  // Load profile data from API
  function initializeProfileData(profile: any) {
    if (profile) {
      // Update current user
      updateUser(profile);
      
      // Update profile data if available
      if (profile.profileData) {
        profileData = { ...profileData, ...profile.profileData };
      }
      
      // Update basic info from user data
      profileData.personal.name = profile.name;
      profileData.personal.email = profile.email;
      profileData.personal.phone = profile.phone || '';
      profileData.personal.profilePhoto = profile.avatar;
    }
  }

  // Save profile data to API
  async function saveProfileData() {
    isSaving = true;
    saveError = '';
    saveSuccess = '';
    
    try {
      // Prepare update request
      const updateRequest: ProfileUpdateRequest = {
        personal: {
          name: profileData.personal.name,
          phone: profileData.personal.phone,
          dateOfBirth: profileData.personal.dateOfBirth,
          gender: profileData.personal.gender,
          nationality: profileData.personal.nationality,
          religion: profileData.personal.religion,
          category: profileData.personal.category,
          maritalStatus: profileData.personal.maritalStatus,
        },
        address: profileData.address,
        education: profileData.education,
        parentGuardian: profileData.parentGuardian,
        emergencyContact: profileData.emergencyContact,
        medical: profileData.medical,
        professional: profileData.professional,
        learning: profileData.learning,
        additional: profileData.additional,
        references: profileData.references
      };
      
      const response = await profileAPI.updateProfile(updateRequest);
      
      if (response.success && response.data) {
        // Update current user
        updateUser(response.data);
        
        // Save to localStorage as backup
        localStorage.setItem('profileData', JSON.stringify(profileData));
        
        saveSuccess = 'Profile updated successfully!';
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          saveSuccess = '';
        }, 3000);
      } else {
        saveError = response.message || 'Failed to update profile';
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      saveError = error.message || 'Failed to update profile. Please try again.';
      
      // Save to localStorage as fallback
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } finally {
      isSaving = false;
    }
  }

  async function toggleEdit() {
    if (isEditing) {
      await saveProfileData();
    }
    isEditing = !isEditing;
  }

  function cancelEdit() {
    isEditing = false;
    saveError = '';
    saveSuccess = '';
    // Reload original data
    if (data.profile) {
      initializeProfileData(data.profile);
    }
  }

  // Handle avatar upload
  async function handleAvatarUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      saveError = 'File size must be less than 5MB';
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      saveError = 'Only JPEG, PNG, and WebP images are allowed';
      return;
    }
    
    avatarFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  
  // Upload avatar
  async function uploadAvatar() {
    if (!avatarFile) return;
    
    isSaving = true;
    saveError = '';
    
    try {
      const response = await profileAPI.uploadAvatar(avatarFile);
      
      if (response.success && response.data) {
        // Update profile photo
        profileData.personal.profilePhoto = response.data.avatarUrl;
        
        // Update current user
        if ($currentUser) {
          updateUser({
            ...$currentUser,
            avatar: response.data.avatarUrl
          });
        }
        
        saveSuccess = 'Profile photo updated successfully!';
        avatarFile = null;
        avatarPreview = '';
        
        setTimeout(() => {
          saveSuccess = '';
        }, 3000);
      } else {
        saveError = response.message || 'Failed to upload avatar';
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      saveError = error.message || 'Failed to upload avatar';
    } finally {
      isSaving = false;
    }
  }

  function loadSampleData() {
    profileData = {
      personal: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1995-08-15',
        gender: 'Female',
        nationality: 'American',
        religion: 'Christianity',
        category: 'General',
        maritalStatus: 'Single',
        profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      address: {
        currentAddress: '123 Main Street, Apt 4B',
        currentCity: 'New York',
        currentState: 'NY',
        currentPincode: '10001',
        permanentAddress: '456 Oak Avenue',
        permanentCity: 'Boston',
        permanentState: 'MA',
        permanentPincode: '02101',
        sameAsCurrent: false
      },
      education: {
        tenthBoard: 'CBSE',
        tenthSchool: 'St. Mary\'s High School',
        tenthYear: '2011',
        tenthPercentage: '92%',
        twelfthBoard: 'CBSE',
        twelfthSchool: 'St. Mary\'s Senior Secondary School',
        twelfthYear: '2013',
        twelfthPercentage: '89%',
        graduationDegree: 'Bachelor of Arts in English Literature',
        graduationUniversity: 'Columbia University',
        graduationYear: '2017',
        graduationPercentage: '3.8 GPA',
        postGraduationDegree: 'Master of Arts in Journalism',
        postGraduationUniversity: 'New York University',
        postGraduationYear: '2019',
        postGraduationPercentage: '3.9 GPA',
        lastQualificationDegree: 'Master of Arts in Journalism',
        lastQualificationInstitution: 'New York University',
        lastQualificationYear: '2019'
      },
      parentGuardian: {
        name: 'Robert Johnson',
        relationship: 'Father',
        contactNumber: '+1 (555) 987-6543',
        email: 'robert.johnson@email.com',
        occupation: 'Engineer',
        address: '456 Oak Avenue, Boston, MA 02101'
      },
      emergencyContact: {
        name: 'Emily Johnson',
        relationship: 'Sister',
        contactNumber: '+1 (555) 456-7890',
        email: 'emily.johnson@email.com',
        address: '789 Pine Street, Boston, MA 02102'
      },
      medical: {
        bloodGroup: 'O+',
        medicalConditions: 'None',
        allergies: 'Peanuts',
        medications: 'None'
      },
      professional: {
        currentEmployment: 'Freelance Writer',
        designation: 'Content Writer',
        organization: 'Self-employed',
        workExperience: '2 years',
        previousEmployment: 'Junior Reporter at Local News',
        skills: 'Writing, Research, Interviewing, Social Media'
      },
      learning: {
        courseInterests: 'Digital Journalism, Investigative Reporting',
        careerGoals: 'To become a renowned investigative journalist',
        technicalSkills: 'Adobe Creative Suite, WordPress, Social Media Management',
        preferredLearningStyle: 'Visual and Hands-on',
        expectations: 'Gain practical experience and industry connections'
      },
      additional: {
        languages: 'English (Native), Spanish (Intermediate), French (Basic)',
        hobbies: 'Reading, Photography, Traveling, Blogging',
        achievements: 'Dean\'s List, University Scholarship Recipient',
        extracurricular: 'University Newspaper Editor, Debate Club President',
        socialMedia: 'LinkedIn: sarah-johnson-journalist, Twitter: @sarahjwriter'
      },
      references: {
        academicRefName: 'Dr. Michael Chen',
        academicRefDesignation: 'Professor',
        academicRefInstitution: 'New York University',
        academicRefContact: 'michael.chen@nyu.edu',
        professionalRefName: 'Jane Smith',
        professionalRefDesignation: 'Editor-in-Chief',
        professionalRefOrganization: 'Local News Network',
        professionalRefContact: 'jane.smith@localnews.com'
      }
    };
    saveProfileData();
  }

  // Calculate profile completion percentage
  function calculateCompletion() {
    const requiredFields = [
      profileData.personal.name,
      profileData.personal.email,
      profileData.personal.phone,
      profileData.personal.dateOfBirth,
      profileData.personal.gender,
      profileData.address.currentAddress,
      profileData.address.currentCity,
      profileData.address.currentState,
      profileData.education.lastQualificationDegree,
      profileData.education.lastQualificationInstitution,
      profileData.education.lastQualificationYear,
      profileData.parentGuardian.name,
      profileData.parentGuardian.relationship,
      profileData.parentGuardian.contactNumber,
      profileData.emergencyContact.name,
      profileData.emergencyContact.relationship,
      profileData.emergencyContact.contactNumber,
      profileData.medical.bloodGroup,
      profileData.medical.medicalConditions
    ];
    
    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }

  $: completionPercentage = calculateCompletion();
  
  // Load profile data on component mount
  onMount(() => {
    if (data.profile) {
      initializeProfileData(data.profile);
    }
  });

  // Profile sections for navigation
  const profileSections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'guardian', label: 'Guardian', icon: Users },
    { id: 'emergency', label: 'Emergency', icon: Phone },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'learning', label: 'Learning', icon: Award },
    { id: 'additional', label: 'Additional', icon: Globe },
    { id: 'references', label: 'References', icon: FileText }
  ];
</script>

<svelte:head>
  <title>Profile - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 max-w-6xl mx-auto space-y-6">
  <!-- Error Message -->
  {#if loadError}
    <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
      <p class="text-sm font-medium">Error Loading Profile</p>
      <p class="text-sm">{loadError}</p>
    </div>
  {/if}
    
  <!-- Success/Error Messages -->
  {#if saveSuccess}
    <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-start space-x-2">
      <div class="flex-shrink-0 mt-0.5">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">Success</p>
        <p class="text-sm">{saveSuccess}</p>
      </div>
    </div>
  {/if}
  
  {#if saveError}
    <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start space-x-2">
      <div class="flex-shrink-0 mt-0.5">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">Error</p>
        <p class="text-sm">{saveError}</p>
      </div>
    </div>
  {/if}

  <!-- Profile Header -->
  <div class="card p-8">
    <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
      <div class="relative">
        <img 
          src={avatarPreview || profileData.personal.profilePhoto || $currentUser?.avatar} 
          alt={profileData.personal.name || $currentUser?.name}
          class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        {#if isEditing}
          <div class="absolute bottom-2 right-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              on:change={handleAvatarUpload}
              class="hidden"
              id="avatar-upload"
            />
            <label
              for="avatar-upload"
              class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200 cursor-pointer"
            >
              <Edit class="w-4 h-4" />
            </label>
          </div>
        {/if}
        
        {#if avatarFile}
          <div class="mt-2 flex space-x-2">
            <button
              on:click={uploadAvatar}
              disabled={isSaving}
              class="btn btn-primary text-xs px-3 py-1 disabled:opacity-50"
            >
              {isSaving ? 'Uploading...' : 'Upload'}
            </button>
            <button
              on:click={() => {
                avatarFile = null;
                avatarPreview = '';
              }}
              class="btn btn-secondary text-xs px-3 py-1"
            >
              Cancel
            </button>
          </div>
        {/if}
      </div>
      
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {profileData.personal.name || $currentUser?.name || 'Complete Your Profile'}
        </h1>
        <p class="text-gray-600 mb-4">
          {profileData.learning.careerGoals || 'Student at Republic School of Journalism'}
        </p>
        
        <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          {#if profileData.personal.email}
            <div class="flex items-center space-x-1">
              <Mail class="w-4 h-4" />
              <span>{profileData.personal.email}</span>
            </div>
          {/if}
          {#if profileData.personal.phone}
            <div class="flex items-center space-x-1">
              <Phone class="w-4 h-4" />
              <span>{profileData.personal.phone}</span>
            </div>
          {/if}
          {#if profileData.address.currentCity}
            <div class="flex items-center space-x-1">
              <MapPin class="w-4 h-4" />
              <span>{profileData.address.currentCity}, {profileData.address.currentState}</span>
            </div>
          {/if}
          {#if $currentUser?.joinDate}
            <div class="flex items-center space-x-1">
              <Calendar class="w-4 h-4" />
              <span>Joined {new Date($currentUser.joinDate).toLocaleDateString()}</span>
            </div>
          {/if}
        </div>

        <!-- Profile Completion -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Profile Completion</span>
            <span class="text-sm font-bold text-primary-600">{completionPercentage}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style="width: {completionPercentage}%"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col space-y-2">
        {#if isEditing}
          <button 
            on:click={toggleEdit}
            disabled={isSaving || $authLoading}
            class="btn btn-primary disabled:opacity-50 flex items-center space-x-2"
          >
            {#if isSaving}
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            {:else}
              <Save class="w-4 h-4" />
              <span>Save Changes</span>
            {/if}
          </button>
          <button 
            on:click={cancelEdit}
            disabled={isSaving}
            class="btn btn-secondary flex items-center space-x-2"
          >
            <X class="w-4 h-4" />
            <span>Cancel</span>
          </button>
        {:else}
          <button 
            on:click={toggleEdit}
            disabled={$authLoading}
            class="btn btn-primary flex items-center space-x-2"
          >
            <Edit class="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        {/if}
        <button 
          on:click={loadSampleData}
          disabled={isSaving || $authLoading}
          class="btn btn-secondary text-sm"
        >
          Load Sample Data
        </button>
      </div>
    </div>
  </div>

  <!-- Editing Mode Layout -->
  {#if isEditing}
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Section Navigation -->
      <div class="lg:col-span-1">
        <div class="card p-4 sticky top-6">
          <h3 class="font-semibold text-gray-900 mb-4">Profile Sections</h3>
          <nav class="space-y-1">
            {#each profileSections as section}
              <button
                class="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 {
                  activeSection === section.id 
                    ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }"
                on:click={() => activeSection = section.id}
              >
                <svelte:component this={section.icon} class="w-4 h-4" />
                <span class="text-sm font-medium">{section.label}</span>
              </button>
            {/each}
          </nav>
        </div>
      </div>

      <!-- Form Content -->
      <div class="lg:col-span-3">
        <div class="card p-6">
          {#if activeSection === 'personal'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  bind:value={profileData.personal.name}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  bind:value={profileData.personal.phone}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  bind:value={profileData.personal.dateOfBirth}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  bind:value={profileData.personal.gender}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  bind:value={profileData.personal.nationality}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <input
                  type="text"
                  bind:value={profileData.personal.religion}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  bind:value={profileData.personal.category}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                <select
                  bind:value={profileData.personal.maritalStatus}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          {:else if activeSection === 'address'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Address Information</h2>
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Current Address</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      bind:value={profileData.address.currentAddress}
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      bind:value={profileData.address.currentCity}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      bind:value={profileData.address.currentState}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      bind:value={profileData.address.currentPincode}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div class="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="sameAsCurrent"
                    bind:checked={profileData.address.sameAsCurrent}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label for="sameAsCurrent" class="text-sm font-medium text-gray-700">
                    Permanent address is same as current address
                  </label>
                </div>

                {#if !profileData.address.sameAsCurrent}
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Permanent Address</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        bind:value={profileData.address.permanentAddress}
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      ></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        bind:value={profileData.address.permanentCity}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        bind:value={profileData.address.permanentState}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        bind:value={profileData.address.permanentPincode}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {:else if activeSection === 'education'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Educational Background</h2>
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Last Qualification</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Degree/Qualification</label>
                    <input
                      type="text"
                      bind:value={profileData.education.lastQualificationDegree}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                    <input
                      type="text"
                      bind:value={profileData.education.lastQualificationInstitution}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="text"
                      bind:value={profileData.education.lastQualificationYear}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Graduation</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                    <input
                      type="text"
                      bind:value={profileData.education.graduationDegree}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">University</label>
                    <input
                      type="text"
                      bind:value={profileData.education.graduationUniversity}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="text"
                      bind:value={profileData.education.graduationYear}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Grade/Percentage</label>
                    <input
                      type="text"
                      bind:value={profileData.education.graduationPercentage}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          {:else if activeSection === 'guardian'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Parent/Guardian Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  bind:value={profileData.parentGuardian.name}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  bind:value={profileData.parentGuardian.relationship}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  bind:value={profileData.parentGuardian.contactNumber}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  bind:value={profileData.parentGuardian.email}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input
                  type="text"
                  bind:value={profileData.parentGuardian.occupation}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  bind:value={profileData.parentGuardian.address}
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
          {:else if activeSection === 'emergency'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Emergency Contact</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  bind:value={profileData.emergencyContact.name}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <input
                  type="text"
                  bind:value={profileData.emergencyContact.relationship}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  bind:value={profileData.emergencyContact.contactNumber}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  bind:value={profileData.emergencyContact.email}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  bind:value={profileData.emergencyContact.address}
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
          {:else if activeSection === 'medical'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Medical Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <select
                  bind:value={profileData.medical.bloodGroup}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                <textarea
                  bind:value={profileData.medical.medicalConditions}
                  rows="3"
                  placeholder="List any medical conditions or write 'None'"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <textarea
                  bind:value={profileData.medical.allergies}
                  rows="3"
                  placeholder="List any allergies or write 'None'"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                <textarea
                  bind:value={profileData.medical.medications}
                  rows="3"
                  placeholder="List current medications or write 'None'"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
          {:else if activeSection === 'professional'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Professional Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Employment Status</label>
                <select
                  bind:value={profileData.professional.currentEmployment}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Status</option>
                  <option value="Student">Student</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  bind:value={profileData.professional.designation}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input
                  type="text"
                  bind:value={profileData.professional.organization}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
                <input
                  type="text"
                  bind:value={profileData.professional.workExperience}
                  placeholder="e.g., 2 years"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <textarea
                  bind:value={profileData.professional.skills}
                  rows="3"
                  placeholder="List your professional skills"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
          {:else if activeSection === 'learning'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Learning & Career Information</h2>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Course Interests</label>
                <textarea
                  bind:value={profileData.learning.courseInterests}
                  rows="3"
                  placeholder="What courses are you interested in?"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Career Goals</label>
                <textarea
                  bind:value={profileData.learning.careerGoals}
                  rows="3"
                  placeholder="What are your career aspirations?"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                <textarea
                  bind:value={profileData.learning.technicalSkills}
                  rows="3"
                  placeholder="List your technical skills"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Learning Style</label>
                <select
                  bind:value={profileData.learning.preferredLearningStyle}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Learning Style</option>
                  <option value="Visual">Visual</option>
                  <option value="Auditory">Auditory</option>
                  <option value="Hands-on">Hands-on</option>
                  <option value="Reading/Writing">Reading/Writing</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
          {:else if activeSection === 'additional'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Languages Known</label>
                <textarea
                  bind:value={profileData.additional.languages}
                  rows="2"
                  placeholder="e.g., English (Native), Spanish (Intermediate)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hobbies & Interests</label>
                <textarea
                  bind:value={profileData.additional.hobbies}
                  rows="3"
                  placeholder="List your hobbies and interests"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                <textarea
                  bind:value={profileData.additional.achievements}
                  rows="3"
                  placeholder="List your notable achievements"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Extracurricular Activities</label>
                <textarea
                  bind:value={profileData.additional.extracurricular}
                  rows="3"
                  placeholder="List your extracurricular activities"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
          {:else if activeSection === 'references'}
            <h2 class="text-xl font-bold text-gray-900 mb-6">References</h2>
            <div class="space-y-8">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Academic Reference</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      bind:value={profileData.references.academicRefName}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                      type="text"
                      bind:value={profileData.references.academicRefDesignation}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                    <input
                      type="text"
                      bind:value={profileData.references.academicRefInstitution}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                    <input
                      type="text"
                      bind:value={profileData.references.academicRefContact}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Professional Reference</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      bind:value={profileData.references.professionalRefName}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                      type="text"
                      bind:value={profileData.references.professionalRefDesignation}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                    <input
                      type="text"
                      bind:value={profileData.references.professionalRefOrganization}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                    <input
                      type="text"
                      bind:value={profileData.references.professionalRefContact}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <!-- View Mode Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Personal Information -->
      <div class="card p-6">
        <div class="flex items-center space-x-2 mb-4">
          <User class="w-5 h-5 text-primary-600" />
          <h2 class="text-xl font-bold text-gray-900">Personal Information</h2>
        </div>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-600">Full Name:</span>
              <p class="text-gray-900">{profileData.personal.name || 'Not provided'}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Date of Birth:</span>
              <p class="text-gray-900">{profileData.personal.dateOfBirth || 'Not provided'}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-600">Gender:</span>
              <p class="text-gray-900">{profileData.personal.gender || 'Not provided'}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Nationality:</span>
              <p class="text-gray-900">{profileData.personal.nationality || 'Not provided'}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-600">Religion:</span>
              <p class="text-gray-900">{profileData.personal.religion || 'Not provided'}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Category:</span>
              <p class="text-gray-900">{profileData.personal.category || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Marital Status:</span>
            <p class="text-gray-900">{profileData.personal.maritalStatus || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="card p-6">
        <div class="flex items-center space-x-2 mb-4">
          <Phone class="w-5 h-5 text-primary-600" />
          <h2 class="text-xl font-bold text-gray-900">Contact Information</h2>
        </div>
        <div class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-600">Email Address:</span>
            <p class="text-gray-900">{profileData.personal.email || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Phone Number:</span>
            <p class="text-gray-900">{profileData.personal.phone || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Current Address:</span>
            <p class="text-gray-900">
              {profileData.address.currentAddress ? 
                `${profileData.address.currentAddress}, ${profileData.address.currentCity}, ${profileData.address.currentState} - ${profileData.address.currentPincode}` : 
                'Not provided'
              }
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Permanent Address:</span>
            <p class="text-gray-900">
              {profileData.address.permanentAddress ? 
                `${profileData.address.permanentAddress}, ${profileData.address.permanentCity}, ${profileData.address.permanentState} - ${profileData.address.permanentPincode}` : 
                'Not provided'
              }
            </p>
          </div>
        </div>
      </div>

      <!-- Educational Background -->
      <div class="card p-6">
        <div class="flex items-center space-x-2 mb-4">
          <BookOpen class="w-5 h-5 text-primary-600" />
          <h2 class="text-xl font-bold text-gray-900">Educational Background</h2>
        </div>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Last Qualification</h3>
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-sm"><span class="font-medium">Degree:</span> {profileData.education.lastQualificationDegree || 'Not provided'}</p>
              <p class="text-sm"><span class="font-medium">Institution:</span> {profileData.education.lastQualificationInstitution || 'Not provided'}</p>
              <p class="text-sm"><span class="font-medium">Year:</span> {profileData.education.lastQualificationYear || 'Not provided'}</p>
            </div>
          </div>
          
          {#if profileData.education.graduationDegree}
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Graduation</h3>
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-sm"><span class="font-medium">Degree:</span> {profileData.education.graduationDegree}</p>
                <p class="text-sm"><span class="font-medium">University:</span> {profileData.education.graduationUniversity}</p>
                <p class="text-sm"><span class="font-medium">Year:</span> {profileData.education.graduationYear}</p>
                <p class="text-sm"><span class="font-medium">Grade:</span> {profileData.education.graduationPercentage}</p>
              </div>
            </div>
          {/if}

          {#if profileData.education.twelfthBoard}
            <div>
              <h3 class="font-medium text-gray-900 mb-2">12th Standard</h3>
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-sm"><span class="font-medium">Board:</span> {profileData.education.twelfthBoard}</p>
                <p class="text-sm"><span class="font-medium">School:</span> {profileData.education.twelfthSchool}</p>
                <p class="text-sm"><span class="font-medium">Year:</span> {profileData.education.twelfthYear}</p>
                <p class="text-sm"><span class="font-medium">Percentage:</span> {profileData.education.twelfthPercentage}</p>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Medical Information -->
      <div class="card p-6">
        <div class="flex items-center space-x-2 mb-4">
          <Heart class="w-5 h-5 text-primary-600" />
          <h2 class="text-xl font-bold text-gray-900">Medical Information</h2>
        </div>
        <div class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-600">Blood Group:</span>
            <p class="text-gray-900">{profileData.medical.bloodGroup || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Medical Conditions:</span>
            <p class="text-gray-900">{profileData.medical.medicalConditions || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Allergies:</span>
            <p class="text-gray-900">{profileData.medical.allergies || 'Not provided'}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Current Medications:</span>
            <p class="text-gray-900">{profileData.medical.medications || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>