import * as Yup from 'yup';

export const addContactSchema = Yup.object().shape({
  name: Yup.string()
    .required('Customer Name is required'),
  
  shipTo: Yup.string()
    .required('Ship To is required'),
  
  address: Yup.string()
    .required('Address is required'),
  
  gpCustomerNumber: Yup.string()
    .required('GP Customer Number is required'),
  
  contactName: Yup.string()
    .required('Contact Name is required'),
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
  phone: Yup.string()
    .matches(
      /^(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/,
      'Phone number is not valid (e.g., (123) 456-7890 or 123-456-7890)'
    )
    .required('Phone number is required'),
  
  provider: Yup.string()
    .required('Provider is required'),
  
  runGroup: Yup.string()
    .required('Run Group is required'),
});

export const CustomerInfoSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  
  shipTo: Yup.string()
    .required('Ship To is required'),
  
  // address: Yup.string()
  //   .required('Address is required'),
  
  gpCustomerNumber: Yup.string()
    .required('GP Customer Number is required'),
  
  contactName: Yup.string()
    .required('Contact Name is required'),
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
  phone: Yup.string()
    .matches(
      /^(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/,
      'Phone number is not valid (e.g., (123) 456-7890 or 123-456-7890)'
    )
    .required('Phone number is required'),
  
  provider: Yup.string()
    .required('Provider is required'),
  
  // runGroup: Yup.string()
  //   .required('Run Group is required'),
});