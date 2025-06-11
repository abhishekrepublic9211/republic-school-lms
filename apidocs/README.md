# Users Service

This service provides APIs for managing user profiles in the Republic School Student system.

## Features

- Get user profile by ID
- Update user profile

## API Endpoints

### Get User by ID

- **Endpoint**: `GET /users/get/:id`
- **Description**: Retrieves a user's profile by their ID
- **Authentication**: Required (JWT)
- **Authorization**: Admin or Student role required
- **URL Parameters**:
  - `id` (string): The ID of the user to retrieve
- **Response**:
  ```json
  {
    "status": 200,
    "message": "User retrieved successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "applicationId": "60c72b2f9b1d8c001f8e4a3c",
      "profileData": {
        "personal": {
          "gender": "Male",
          "nationality": "",
          "religion": "",
          "category": "",
          "maritalStatus": "",
          "profilePhoto": ""
        },
        "address": {
          "currentCity": "City",
          "currentState": "State",
          "currentPincode": "123456",
          "permanentAddress": "123 Main St",
          "permanentCity": "City",
          "permanentState": "State",
          "permanentPincode": "123456",
          "sameAsCurrent": true
        },
        "education": {
          "lastQualificationDegree": "Graduation",
          "lastQualificationUniversity": "University Name",
          "lastQualificationPercentage": "",
          "lastQualificationYear": "2020"
        },
        "parentGuardian": {
          "name": "Jane Doe",
          "relationship": "Mother",
          "contactNumber": "9876543212",
          "email": "",
          "occupation": "",
          "address": ""
        },
        "emergencyContact": {
          "name": "Jane Doe",
          "relationship": "Mother",
          "contactNumber": "9876543212",
          "email": "",
          "address": ""
        },
        "medical": {
          "bloodGroup": "O+",
          "medicalConditions": "",
          "allergies": "",
          "medications": ""
        },
        "professional": {
          "currentEmployment": "",
          "designation": "",
          "organization": "",
          "workExperience": "",
          "previousEmployment": "",
          "skills": ""
        },
        "learning": {
          "courseInterests": "",
          "careerGoals": "",
          "technicalSkills": "",
          "preferredLearningStyle": "",
          "expectations": ""
        },
        "additional": {
          "languages": "English, Hindi",
          "hobbies": "",
          "achievements": "",
          "extracurricular": "",
          "socialMedia": "",
          "miscellaneous": ""
        }
      },
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### Update User

- **Endpoint**: `POST /users/update/:id`
- **Description**: Updates a user's profile
- **Authentication**: Required (JWT)
- **Authorization**: Admin or Student role required
- **URL Parameters**:
  - `id` (string): The ID of the user to update
- **Request Body**:
  ```json
  {
    "password": "newPassword123", // Optional, min length 6 characters
    "firstName": "John", // Optional
    "lastName": "Smith", // Optional
    "contact": "9876543210", // Optional
    "address": "456 New St, City", // Optional
    "dob": "1990-01-01", // Optional
    "qualification": "Masters", // Optional
    "institution": "New University", // Optional
    "languagesKnown": "English, French", // Optional
    "bloodGroup": "A+", // Optional
    "medicalConditions": "None", // Optional
    "allergies": "None", // Optional
    "personal": { // Optional
      "gender": "Male",
      "alternateContact": "9876543211",
      "idProofType": "Passport",
      "idProofNumber": "A1234567"
    },
    "parentGuardian": { // Optional
      "name": "Jane Smith",
      "relationship": "Mother",
      "contactNumber": "9876543212"
    },
    "emergencyContact": { // Optional
      "name": "Jane Smith",
      "relationship": "Mother",
      "contactNumber": "9876543212"
    },
    "education": { // Optional
      "year": "2021"
    },
    "addressDetails": { // Optional
      "currentAddress": "456 New St",
      "currentCity": "New City",
      "currentState": "New State",
      "currentPincode": "654321",
      "permanentAddress": "456 New St",
      "permanentCity": "New City",
      "permanentState": "New State",
      "permanentPincode": "654321",
      "sameAsCurrent": true
    },
    "extraData": { // Optional
      "languagesKnown": "English, French",
      "miscellaneous": "Additional information"
    }
  }
  ```
- **Response**:
  ```json
  {
    "status": 200,
    "message": "User updated successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "student",
      "applicationId": "60c72b2f9b1d8c001f8e4a3c",
      "profileData": {
        "personal": {
          "gender": "Male",
          "nationality": "",
          "religion": "",
          "category": "",
          "maritalStatus": "",
          "profilePhoto": ""
        },
        "address": {
          "currentCity": "New City",
          "currentState": "New State",
          "currentPincode": "654321",
          "permanentAddress": "456 New St",
          "permanentCity": "New City",
          "permanentState": "New State",
          "permanentPincode": "654321",
          "sameAsCurrent": true
        },
        "education": {
          "lastQualificationDegree": "Masters",
          "lastQualificationUniversity": "New University",
          "lastQualificationPercentage": "",
          "lastQualificationYear": "2021"
        },
        "parentGuardian": {
          "name": "Jane Smith",
          "relationship": "Mother",
          "contactNumber": "9876543212",
          "email": "",
          "occupation": "",
          "address": ""
        },
        "emergencyContact": {
          "name": "Jane Smith",
          "relationship": "Mother",
          "contactNumber": "9876543212",
          "email": "",
          "address": ""
        },
        "medical": {
          "bloodGroup": "A+",
          "medicalConditions": "None",
          "allergies": "None",
          "medications": ""
        },
        "professional": {
          "currentEmployment": "",
          "designation": "",
          "organization": "",
          "workExperience": "",
          "previousEmployment": "",
          "skills": ""
        },
        "learning": {
          "courseInterests": "",
          "careerGoals": "",
          "technicalSkills": "",
          "preferredLearningStyle": "",
          "expectations": ""
        },
        "additional": {
          "languages": "English, French",
          "hobbies": "",
          "achievements": "",
          "extracurricular": "",
          "socialMedia": "",
          "miscellaneous": "Additional information"
        }
      },
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

## Notes

- When updating a user's password, it will be automatically hashed before storage.
- The email field cannot be updated through this endpoint.
