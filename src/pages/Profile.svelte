<script lang="ts">
  import { FileEdit as Edit, Mail, Phone, MapPin, Calendar, Award, BookOpen, Trophy, Save, X } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { currentUser } from '../stores/auth';
  import { courses } from '../stores/courses';

  let isEditing = false;
  let editedUser = { ...$currentUser };

  // Extended profile fields based on the form
  let profileData = {
    // Personal Information
    firstName: $currentUser?.name?.split(' ')[0] || '',
    lastName: $currentUser?.name?.split(' ')[1] || '',
    email: $currentUser?.email || '',
    phone: $currentUser?.phone || '',
    whatsapp: '',
    dateOfBirth: '',
    gender: '',
    
    // Address Information
    currentAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    permanentAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    sameAsCurrent: false,
    
    // Educational Background
    education: {
      tenthBoard: '',
      tenthPercentage: '',
      tenthYear: '',
      twelfthBoard: '',
      twelfthPercentage: '',
      twelfthYear: '',
      graduationUniversity: '',
      graduationDegree: '',
      graduationPercentage: '',
      graduationYear: '',
      postGraduationUniversity: '',
      postGraduationDegree: '',
      postGraduationPercentage: '',
      postGraduationYear: ''
    },
    
    // Professional Information
    workExperience: '',
    currentEmployment: '',
    organization: '',
    designation: '',
    workExperienceYears: '',
    
    // Course Information
    courseInterest: '',
    learningGoals: '',
    preferredSchedule: '',
    technicalSkills: '',
    
    // Additional Information
    languagesKnown: [],
    hobbies: '',
    achievements: '',
    references: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    
    // Documents
    documents: {
      photo: null,
      tenthCertificate: null,
      twelfthCertificate: null,
      graduationCertificate: null,
      experienceLetter: null,
      idProof: null
    }
  };

  function toggleEdit() {
    if (isEditing) {
      // Save changes
      const updatedUser = {
        ...$currentUser,
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        phone: profileData.phone
      };
      currentUser.set(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } else {
      // Start editing
      editedUser = { ...$currentUser };
    }
    isEditing = !isEditing;
  }

  function cancelEdit() {
    isEditing = false;
    editedUser = { ...$currentUser };
  }

  function copyCurrentToPermanent() {
    if (profileData.sameAsCurrent) {
      profileData.permanentAddress = { ...profileData.currentAddress };
    }
  }

  function handleFileUpload(event: Event, documentType: string) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      profileData.documents[documentType] = target.files[0];
    }
  }

  $: enrolledCourses = $courses.filter(course => course.isEnrolled);
  $: completedCourses = $courses.filter(course => 
    $currentUser?.completedCourses?.includes(course.id)
  );
  $: totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length)
    : 0;

  // Load saved profile data
  if (typeof window !== 'undefined') {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      try {
        profileData = { ...profileData, ...JSON.parse(savedProfile) };
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
  }

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  const languages = [
    'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 
    'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 'Sanskrit'
  ];
</script>

<Layout>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    <!-- Profile Header -->
    <div class="card p-8">
      <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div class="relative">
          <img 
            src={$currentUser?.avatar} 
            alt={$currentUser?.name}
            class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {#if isEditing}
            <button class="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200">
              <Edit class="w-4 h-4" />
            </button>
          {/if}
        </div>
        
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{$currentUser?.name}</h1>
          <p class="text-gray-600 mb-4">{$currentUser?.bio || 'Complete your profile to get started'}</p>
          
          <div class="flex flex-wrap gap-4 text-sm text-gray-500">
            <div class="flex items-center space-x-1">
              <Mail class="w-4 h-4" />
              <span>{$currentUser?.email}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Phone class="w-4 h-4" />
              <span>{$currentUser?.phone || 'Not provided'}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Calendar class="w-4 h-4" />
              <span>Joined {new Date($currentUser?.joinDate || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          {#if isEditing}
            <button 
              on:click={toggleEdit}
              class="btn btn-primary flex items-center space-x-2"
            >
              <Save class="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button 
              on:click={cancelEdit}
              class="btn btn-secondary flex items-center space-x-2"
            >
              <X class="w-4 h-4" />
              <span>Cancel</span>
            </button>
          {:else}
            <button 
              on:click={toggleEdit}
              class="btn btn-primary flex items-center space-x-2"
            >
              <Edit class="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          {/if}
        </div>
      </div>
    </div>

    {#if isEditing}
      <!-- Comprehensive Profile Form -->
      <div class="space-y-6">
        <!-- Personal Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                bind:value={profileData.firstName}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                bind:value={profileData.lastName}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                bind:value={profileData.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                bind:value={profileData.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                bind:value={profileData.whatsapp}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                bind:value={profileData.dateOfBirth}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                bind:value={profileData.gender}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Address Information</h2>
          
          <!-- Current Address -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Current Address</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <textarea
                  bind:value={profileData.currentAddress.street}
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  bind:value={profileData.currentAddress.city}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select
                  bind:value={profileData.currentAddress.state}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                <input
                  type="text"
                  bind:value={profileData.currentAddress.pincode}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  bind:value={profileData.currentAddress.country}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Permanent Address -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                bind:checked={profileData.sameAsCurrent}
                on:change={copyCurrentToPermanent}
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label class="text-sm font-medium text-gray-700">Same as current address</label>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Permanent Address</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <textarea
                  bind:value={profileData.permanentAddress.street}
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  bind:value={profileData.permanentAddress.city}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select
                  bind:value={profileData.permanentAddress.state}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                <input
                  type="text"
                  bind:value={profileData.permanentAddress.pincode}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  bind:value={profileData.permanentAddress.country}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={profileData.sameAsCurrent}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Educational Background -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Educational Background</h2>
          
          <!-- 10th Standard -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">10th Standard</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Board *</label>
                <input
                  type="text"
                  bind:value={profileData.education.tenthBoard}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
                <input
                  type="text"
                  bind:value={profileData.education.tenthPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
                <input
                  type="number"
                  bind:value={profileData.education.tenthYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 12th Standard -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">12th Standard</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Board *</label>
                <input
                  type="text"
                  bind:value={profileData.education.twelfthBoard}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
                <input
                  type="text"
                  bind:value={profileData.education.twelfthPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
                <input
                  type="number"
                  bind:value={profileData.education.twelfthYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Graduation -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Graduation</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">University/College</label>
                <input
                  type="text"
                  bind:value={profileData.education.graduationUniversity}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  bind:value={profileData.education.graduationDegree}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA</label>
                <input
                  type="text"
                  bind:value={profileData.education.graduationPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                <input
                  type="number"
                  bind:value={profileData.education.graduationYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- Post Graduation -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Post Graduation (if applicable)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">University/College</label>
                <input
                  type="text"
                  bind:value={profileData.education.postGraduationUniversity}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  bind:value={profileData.education.postGraduationDegree}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA</label>
                <input
                  type="text"
                  bind:value={profileData.education.postGraduationPercentage}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
                <input
                  type="number"
                  bind:value={profileData.education.postGraduationYear}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Professional Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
              <select
                bind:value={profileData.workExperience}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Employment Status</label>
              <select
                bind:value={profileData.currentEmployment}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Status</option>
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="freelancer">Freelancer</option>
                <option value="entrepreneur">Entrepreneur</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Organization/Company</label>
              <input
                type="text"
                bind:value={profileData.organization}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                bind:value={profileData.designation}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Course Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Course Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Course Interest</label>
              <select
                bind:value={profileData.courseInterest}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Course</option>
                <option value="diploma-journalism">Diploma in Journalism</option>
                <option value="digital-journalism">Digital Journalism</option>
                <option value="broadcast-journalism">Broadcast Journalism</option>
                <option value="investigative-journalism">Investigative Journalism</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
              <textarea
                bind:value={profileData.learningGoals}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="What do you hope to achieve from this course?"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Schedule</label>
              <select
                bind:value={profileData.preferredSchedule}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Schedule</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evening">Evening Classes</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
              <textarea
                bind:value={profileData.technicalSkills}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List any relevant technical skills (e.g., video editing, photography, etc.)"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Languages Known</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                {#each languages as language}
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={language}
                      bind:group={profileData.languagesKnown}
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="text-sm text-gray-700">{language}</span>
                  </label>
                {/each}
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Hobbies & Interests</label>
              <textarea
                bind:value={profileData.hobbies}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Achievements & Awards</label>
              <textarea
                bind:value={profileData.achievements}
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Emergency Contact</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                bind:value={profileData.emergencyContact.name}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
              <input
                type="text"
                bind:value={profileData.emergencyContact.relationship}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                bind:value={profileData.emergencyContact.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
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
          </div>
        </div>

        <!-- Document Upload -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Document Upload</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Passport Size Photo *</label>
              <input
                type="file"
                accept="image/*"
                on:change={(e) => handleFileUpload(e, 'photo')}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">10th Certificate *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                on:change={(e) => handleFileUpload(e, 'tenthCertificate')}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">12th Certificate *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                on:change={(e) => handleFileUpload(e, 'twelfthCertificate')}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Graduation Certificate</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                on:change={(e) => handleFileUpload(e, 'graduationCertificate')}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Experience Letter</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                on:change={(e) => handleFileUpload(e, 'experienceLetter')}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ID Proof (Aadhar/PAN/Passport) *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                on:change={(e) => handleFileUpload(e, 'idProof')}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- View Mode - Stats and Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BookOpen class="w-6 h-6 text-primary-600" />
          </div>
          <div class="text-2xl font-bold text-gray-900">{enrolledCourses.length}</div>
          <div class="text-sm text-gray-600">Enrolled Courses</div>
        </div>
        
        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Trophy class="w-6 h-6 text-success-600" />
          </div>
          <div class="text-2xl font-bold text-gray-900">{completedCourses.length}</div>
          <div class="text-sm text-gray-600">Completed Courses</div>
        </div>
        
        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Award class="w-6 h-6 text-warning-600" />
          </div>
          <div class="text-2xl font-bold text-gray-900">{$currentUser?.achievements?.length || 0}</div>
          <div class="text-sm text-gray-600">Achievements</div>
        </div>
        
        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <div class="text-blue-600 font-bold text-lg">{totalProgress}%</div>
          </div>
          <div class="text-2xl font-bold text-gray-900">Progress</div>
          <div class="text-sm text-gray-600">Average</div>
        </div>
      </div>

      <!-- Profile Completion Status -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Profile Completion</h2>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-yellow-800">
            Complete your profile to get the most out of your learning experience. 
            Click "Edit Profile" to add your educational background, contact information, and more.
          </p>
        </div>
      </div>
    {/if}
  </div>
</Layout>