<script lang="ts">
  import { FileEdit as Edit, Mail, Phone, MapPin, Calendar, User, BookOpen, Heart, Globe, Award, FileText, Users, Briefcase } from 'lucide-svelte';
  import { currentUser, updateUser } from '$lib/stores/auth';

  let isEditing = false;
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

  // Load data from localStorage on component mount
  function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        profileData = { ...profileData, ...parsed };
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
  }

  // Save data to localStorage
  function saveProfileData() {
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Update current user with basic info
    if ($currentUser) {
      const updatedUser = {
        ...$currentUser,
        name: profileData.personal.name,
        email: profileData.personal.email,
        phone: profileData.personal.phone,
        bio: profileData.learning.careerGoals,
        location: `${profileData.address.currentCity}, ${profileData.address.currentState}`
      };
      updateUser(updatedUser);
    }
  }

  function toggleEdit() {
    if (isEditing) {
      saveProfileData();
    }
    isEditing = !isEditing;
  }

  function cancelEdit() {
    isEditing = false;
    loadProfileData(); // Reload original data
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

  // Load data on component mount
  loadProfileData();

  $: completionPercentage = calculateCompletion();
</script>

<svelte:head>
  <title>Profile - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 max-w-6xl mx-auto space-y-6">
  <!-- Profile Header -->
  <div class="card p-8">
    <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
      <div class="relative">
        <img 
          src={profileData.personal.profilePhoto || $currentUser?.avatar} 
          alt={profileData.personal.name || $currentUser?.name}
          class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        {#if isEditing}
          <button class="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200">
            <Edit class="w-4 h-4" />
          </button>
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
            class="btn btn-primary"
          >
            Save Changes
          </button>
          <button 
            on:click={cancelEdit}
            class="btn btn-secondary"
          >
            Cancel
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
        <button 
          on:click={loadSampleData}
          class="btn btn-secondary text-sm"
        >
          Load Sample Data
        </button>
      </div>
    </div>
  </div>

  <!-- Profile Information Sections -->
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

    <!-- Family Information -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Users class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">Family & Emergency Contact</h2>
      </div>
      <div class="space-y-4">
        <div>
          <h3 class="font-medium text-gray-900 mb-2">Parent/Guardian Information</h3>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm"><span class="font-medium">Name:</span> {profileData.parentGuardian.name || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Relationship:</span> {profileData.parentGuardian.relationship || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Contact:</span> {profileData.parentGuardian.contactNumber || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Email:</span> {profileData.parentGuardian.email || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Occupation:</span> {profileData.parentGuardian.occupation || 'Not provided'}</p>
          </div>
        </div>
        
        <div>
          <h3 class="font-medium text-gray-900 mb-2">Emergency Contact</h3>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm"><span class="font-medium">Name:</span> {profileData.emergencyContact.name || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Relationship:</span> {profileData.emergencyContact.relationship || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Contact:</span> {profileData.emergencyContact.contactNumber || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Email:</span> {profileData.emergencyContact.email || 'Not provided'}</p>
          </div>
        </div>
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

    <!-- Professional Information -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Briefcase class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">Professional Information</h2>
      </div>
      <div class="space-y-3">
        <div>
          <span class="text-sm font-medium text-gray-600">Current Employment:</span>
          <p class="text-gray-900">{profileData.professional.currentEmployment || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Designation:</span>
          <p class="text-gray-900">{profileData.professional.designation || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Organization:</span>
          <p class="text-gray-900">{profileData.professional.organization || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Work Experience:</span>
          <p class="text-gray-900">{profileData.professional.workExperience || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Skills:</span>
          <p class="text-gray-900">{profileData.professional.skills || 'Not provided'}</p>
        </div>
      </div>
    </div>

    <!-- Learning & Career Goals -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Award class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">Learning & Career Goals</h2>
      </div>
      <div class="space-y-3">
        <div>
          <span class="text-sm font-medium text-gray-600">Course Interests:</span>
          <p class="text-gray-900">{profileData.learning.courseInterests || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Career Goals:</span>
          <p class="text-gray-900">{profileData.learning.careerGoals || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Technical Skills:</span>
          <p class="text-gray-900">{profileData.learning.technicalSkills || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Learning Style:</span>
          <p class="text-gray-900">{profileData.learning.preferredLearningStyle || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Expectations:</span>
          <p class="text-gray-900">{profileData.learning.expectations || 'Not provided'}</p>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Globe class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">Additional Information</h2>
      </div>
      <div class="space-y-3">
        <div>
          <span class="text-sm font-medium text-gray-600">Languages:</span>
          <p class="text-gray-900">{profileData.additional.languages || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Hobbies & Interests:</span>
          <p class="text-gray-900">{profileData.additional.hobbies || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Achievements:</span>
          <p class="text-gray-900">{profileData.additional.achievements || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Extracurricular Activities:</span>
          <p class="text-gray-900">{profileData.additional.extracurricular || 'Not provided'}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-600">Social Media:</span>
          <p class="text-gray-900">{profileData.additional.socialMedia || 'Not provided'}</p>
        </div>
      </div>
    </div>

    <!-- References -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <FileText class="w-5 h-5 text-primary-600" />
        <h2 class="text-xl font-bold text-gray-900">References</h2>
      </div>
      <div class="space-y-4">
        <div>
          <h3 class="font-medium text-gray-900 mb-2">Academic Reference</h3>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm"><span class="font-medium">Name:</span> {profileData.references.academicRefName || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Designation:</span> {profileData.references.academicRefDesignation || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Institution:</span> {profileData.references.academicRefInstitution || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Contact:</span> {profileData.references.academicRefContact || 'Not provided'}</p>
          </div>
        </div>
        
        <div>
          <h3 class="font-medium text-gray-900 mb-2">Professional Reference</h3>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm"><span class="font-medium">Name:</span> {profileData.references.professionalRefName || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Designation:</span> {profileData.references.professionalRefDesignation || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Organization:</span> {profileData.references.professionalRefOrganization || 'Not provided'}</p>
            <p class="text-sm"><span class="font-medium">Contact:</span> {profileData.references.professionalRefContact || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Profile Form (shown when editing) -->
  {#if isEditing}
    <div class="card p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Edit Profile Information</h2>
      
      <!-- Personal Information Form -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                bind:value={profileData.personal.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                bind:value={profileData.personal.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                bind:value={profileData.personal.dateOfBirth}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                bind:value={profileData.personal.gender}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
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
          </div>
        </div>

        <!-- Last Qualification -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Last Qualification</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Degree/Qualification *</label>
              <input
                type="text"
                bind:value={profileData.education.lastQualificationDegree}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Institution/University *</label>
              <input
                type="text"
                bind:value={profileData.education.lastQualificationInstitution}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
              <input
                type="text"
                bind:value={profileData.education.lastQualificationYear}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>

        <!-- Parent/Guardian Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
              <input
                type="text"
                bind:value={profileData.parentGuardian.name}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Relationship to Student *</label>
              <select
                bind:value={profileData.parentGuardian.relationship}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select Relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Contact Number *</label>
              <input
                type="tel"
                bind:value={profileData.parentGuardian.contactNumber}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Email</label>
              <input
                type="email"
                bind:value={profileData.parentGuardian.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Emergency Contact Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number *</label>
              <input
                type="tel"
                bind:value={profileData.emergencyContact.contactNumber}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Email</label>
              <input
                type="email"
                bind:value={profileData.emergencyContact.email}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Medical Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
              <select
                bind:value={profileData.medical.bloodGroup}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Any Medical Conditions *</label>
              <input
                type="text"
                bind:value={profileData.medical.medicalConditions}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter 'None' if no conditions"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>