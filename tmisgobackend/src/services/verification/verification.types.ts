const verificationTypes = /* GraphQL */ `
  scalar Date

  enum DocumentType {
    DEGREE_DIPLOMA
    ACADEMIC_TRANSCRIPT
    TEACHING_LICENSE
  }

  enum RegistrationStep {
    NIN_VERIFICATION
    PERSONAL_DETAILS
    DOCUMENT_UPLOAD
    PIN_SET
    COMPLETED
  }

  type NiraProfile {
    nin: String!
    fullName: String!
    dateOfBirth: Date!
    gender: String!
    districtOfOrigin: String!
  }

  type TeacherProfile {
    id: ID!
    nin: String!
    fullName: String!
    dateOfBirth: Date!
    gender: String!
    districtOfOrigin: String!
    currentStep: RegistrationStep!
    isVerified: Boolean!
  }

  type DocumentPayload {
    id: ID!
    type: DocumentType!
    fileUrl: String!
    status: String!
  }

  type Query {
    verifyNIN(nin: String!): NiraProfile!
  }

  type Mutation {
    initializeTeacherProfile(
      nin: String!
      fullName: String!
      dateOfBirth: Date!
      gender: String!
      districtOfOrigin: String!
    ): TeacherProfile!

    uploadRegistrationDocument(
      teacherId: ID!
      type: DocumentType!
      fileUrl: String!
      publicId: String!
    ): DocumentPayload!
  }
`;

export default verificationTypes;