import { writable } from 'svelte/store';

// Based on NEW apidocs/README.md for GET /users/get/:id response

export interface ProfileData_Personal { // Already exported, but ensure all are
  gender?: string;
  nationality?: string;
  religion?: string;
  category?: string;
  maritalStatus?: string;
  profilePhoto?: string; // This was profilePictureUrl at root before
  // Fields from old 'personal' not in new 'profileData.personal': alternateContact, idProofType, idProofNumber
  // These might be part of a different section or removed. The UPDATE DTO still has them at root.personal.
}

export interface ProfileData_Address { // Already exported
  currentCity?: string;
  currentState?: string;
  currentPincode?: string;
  permanentAddress?: string; // Full permanent address string
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;
  sameAsCurrent?: boolean;
  // Missing currentAddress (full string) from this GET response structure, but present in UPDATE DTO addressDetails.currentAddress
  // The root of User in OLD docs had 'address' (simple string). New GET has no root 'address'.
}

export interface ProfileData_Education { // Already exported
  lastQualificationDegree?: string;
  lastQualificationUniversity?: string;
  lastQualificationPercentage?: string;
  lastQualificationYear?: string;
  // Old 'education' object had only 'year'. Old root had 'qualification', 'institution'.
}

export interface ProfileData_ParentGuardian { // Already exported
  name?: string;
  relationship?: string;
  contactNumber?: string;
  email?: string;
  occupation?: string;
  address?: string;
}

export interface ProfileData_EmergencyContact { // Already exported
  name?: string;
  relationship?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export interface ProfileData_Medical { // Already exported
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
}

export interface ProfileData_Professional { // Already exported
  currentEmployment?: string;
  designation?: string;
  organization?: string;
  workExperience?: string; // Text area? Or structured?
  previousEmployment?: string;
  skills?: string; // Comma-separated? Array?
}

export interface ProfileData_Learning { // Already exported
  courseInterests?: string;
  careerGoals?: string;
  technicalSkills?: string;
  preferredLearningStyle?: string;
  expectations?: string;
}

export interface ProfileData_Additional { // Already exported
  languages?: string; // This was 'languagesKnown' at root in old docs
  hobbies?: string;
  achievements?: string;
  extracurricular?: string;
  socialMedia?: string; // JSON? Links?
  miscellaneous?: string;
}

export interface ProfileData { // Already exported
  personal?: Partial<ProfileData_Personal>;
  address?: Partial<ProfileData_Address>; // Named 'address' in profileData, not 'addressDetails'
  education?: Partial<ProfileData_Education>;
  parentGuardian?: Partial<ProfileData_ParentGuardian>;
  emergencyContact?: Partial<ProfileData_EmergencyContact>;
  medical?: Partial<ProfileData_Medical>;
  professional?: Partial<ProfileData_Professional>;
  learning?: Partial<ProfileData_Learning>;
  additional?: Partial<ProfileData_Additional>;
}

export interface User {
  _id: string;
  email: string;
  firstName?: string; // At root
  lastName?: string;  // At root
  role: string;      // At root
  applicationId?: string; // At root - good for payments page!
  
  profileData?: ProfileData; // Main nested object

  // isProfileComplete is GONE from GET response.
  // Fields that were at root in old User interface, now need to check if they map to profileData or are gone:
  // contact -> (Not directly in GET response, Update DTO has it at root)
  // dob -> (Not directly in GET response, Update DTO has it at root)
  // qualification -> profileData.education.lastQualificationDegree
  // institution -> profileData.education.lastQualificationUniversity
  // languagesKnown -> profileData.additional.languages
  // bloodGroup -> profileData.medical.bloodGroup
  // medicalConditions -> profileData.medical.medicalConditions
  // allergies -> profileData.medical.allergies
  // address (simple string) -> (Not in GET response, Update DTO has it at root)
  // profilePictureUrl -> profileData.personal.profilePhoto

  // Social links like linkedinProfile, githubProfile are not in the new GET response.
  // They might be part of profileData.additional.socialMedia or miscellaneous.
  // For now, removing them from User interface to strictly match GET response.
  // Can be added back if Update DTO supports them and they are needed.

  createdAt?: string;
  updatedAt?: string;
  id?: string; // For compatibility, maps to _id
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const createAuthStore = () => {
  const { subscribe, set, update } = writable<AuthState>(initialAuthState);

  return {
    subscribe,
    login: (user: User, token: string) => {
      const userToStore = { ...user, id: user._id || user.id };
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(userToStore));
      set({ user: userToStore, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      set(initialAuthState);
    },
    initialize: () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (token && storedUser) {
          try {
            let user: User = JSON.parse(storedUser);
            user = { ...user, id: user._id || user.id };
            set({ user, token, isAuthenticated: true });
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            set(initialAuthState);
          }
        }
      }
    },
    setUser: (user: User) => {
        update(state => {
            if (state.isAuthenticated) {
                const userToStore = { ...user, id: user._id || user.id };
                localStorage.setItem('authUser', JSON.stringify(userToStore));
                return { ...state, user: userToStore };
            }
            return state;
        });
    }
  };
};

export const authStore = createAuthStore();

if (typeof window !== 'undefined') {
  authStore.initialize();
}
