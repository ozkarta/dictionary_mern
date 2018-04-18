//  EXAMPLE____OF_SUPPORTED_VALIDATIONS

// required: true,
// minLength: 5,
// maxLength: 1,
// pattern: '^([a-z0-9]{5,})$',
// date: true,
// number: true,

module.exports.userRegistrationRules = {
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 128
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 128
  },
  email: {
    pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$",
    maxLength: 128
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128
  },
  role: {
    required: true
  },
  isIndividual: {

  },
  isCompany: {

  },
  businessName: {
    required: true,
    minLength: 1,
    maxLength: 128
  },
  businessType: {
    required: true,
    minLength: 1,
    maxLength: 128
  },
  controlNumber: {
    required: true,
    minLength: 1,
    maxLength: 128
  },
  principalOfficeAddress: {
    required: true,
    minLength: 1,
    maxLength: 128
  },
  registrationDate: {
    date: true
  }
};