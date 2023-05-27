import { object, string, mixed, array, date, boolean } from 'yup';
import { getValues } from '../../../utils/utils';
import { salutationOptions, genderOptions } from '../Enums';
import { sub } from 'date-fns/fp';

const maxBirthDate = sub({ years: 19 })(new Date());
const uploadLimit = 10000000;

const FfolkValidation = (state: string) => {
  const gearState = (main: string, other: string | string[]) => (main == 'CaptureFishing' && state == 'gear') || (other.includes('CaptureFishing') && state == 'gear') || (main == 'CaptureFishing' && state == 'gear&vessel') || (other.includes('CaptureFishing') && state == 'gear&vessel');
  const vesselState = (main: string, other: string | string[]) => (main == 'CaptureFishing' && state == 'vessel') || (other.includes('CaptureFishing') && state == 'vessel') || (main == 'CaptureFishing' && state == 'gear&vessel') || (other.includes('CaptureFishing') && state == 'gear&vessel');

  return object().shape({
    lastName: string().required('Enter last name.'),
    firstName: string().required('Enter first name.'),
    middleName: string().required('Enter middle name.'),
    salutation: string().nullable().oneOf(getValues(salutationOptions)).required('Select salutation.'),
    contactNumber: string()
      .required('Enter contact number.')
      .matches(/^(09|\+639)\d{9}$/, 'Please enter a valid contact number.'),
    barangay: string().required('Enter or select barangay.'),
    cityMunicipality: string().required('Enter city/municipality.'),
    province: string().required('Enter province.'),
    residentYear: string().matches(/^\d{4}$/, 'Enter year of residency.'),
    gender: string().nullable().oneOf(getValues(genderOptions)).required('Select gender.'),
    age: string()
      .matches(/^$|\d{1,3}$/, 'Age must be a number.')
      .matches(/^(1[89]|[2-9]\d)$/gm, 'Must be 18 or Above')
      .required('Enter age.'),
    dateOfBirth: date().max(maxBirthDate, 'Enter Valid Date').typeError('Enter Valid Date').required('Enter date of birth.'),
    placeOfBirth: string().required('Enter place of birth.'),
    civilStatus: string().required('Select civil status.'),
    educationalBackground: string().required('Select educational background.'),
    numOfChildren: string().matches(/^$|\d{1,2}$/, 'Enter a number.'),
    nationality: string().required('Enter nationality.'),
    personToNotify: string().required('Enter person to notify.'),
    ptnRelationship: string().required('Enter relationship with person to notify.'),
    ptnContactNum: string()
      .required('Enter contact number of person to notify.')
      .matches(/^(09|\+639)\d{9}$/, 'Please enter a valid contact number.'),
    ptnAddress: string().required('Enter address of person to notify.'),
    mainFishingActivity: string().required('Select main fishing activity.'),
    otherFishingActivities: array().ensure(),
    org: object().when('withOrg', {
      is: true,
      then: object().shape({
        name: string().required('Please enter organization anme'),
        memberSince: string()
          .required('Please Enter year joined')
          .matches(/^$|\d{4}$/, 'Please enter year.'),
        position: string()
          // eslint-disable-next-line quotes
          .required("Please enter you're organization position")
          .matches(/^[a-zA-Z0-9]*$/i, 'No special characters allowed'),
      }),
      otherwise: object().nullable(),
    }),
    profilePhoto: mixed()
      .test('uploadedPhoto', 'Must upload photo', (value) => value != '')
      .test('fileSize', 'File too large', (value) => value && value.size < uploadLimit)
      .test('fileFormat', 'Unsupported Format, Format must be in .jpeg, .jpg, .png', (value) => value && value.type.match(/^.*(image\/jpeg|jpg|png)$/gm)),
    files: mixed()
      .nullable() // .test('uploadedFiles', 'Must upload photo', (value) => value && value.length > 0)
      .test('fileSize', 'File too large', (value) => {
        const truthArray = [];
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].size < uploadLimit) {
              truthArray.push(value[i]);
            }
          }
          return truthArray.length > 0;
        }
        return true;
      })
      .test('fileFormat', 'Unsupported Format, Format must be in .jpeg, .jpg, .png', (value) => {
        const truthArray = [];
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].type.match(/^.*(image\/jpeg|jpg|png)$/gm)) {
              truthArray.push(value[i]);
            }
          }
          return truthArray.length > 0;
        }
        return true;
      }),
    gears: object().when(['mainFishingActivity', 'otherFishingActivities'], {
      is: gearState,
      then: object()
        .shape({
          hookAndLine: array().of(string()).ensure(),
          gillNets: array().of(string()).ensure(),
          liftNets: array().of(string()).ensure(),
          potsAndTraps: array().of(string()).ensure(),
          seineNets: array().of(string()).ensure(),
          scoopNets: array().of(string()).ensure(),
          fallingGear: array().of(string()).ensure(),
          miscellaneous: array().of(string()).ensure(),
          others: string(),
        })
        .test('requiredGear', 'Must have at least 1 gear', (value) => {
          const truthArray = Object.keys(value).map((key) => {
            if (key != 'others') {
              const array = value[key] as Array<string>;
              if (array instanceof Array) {
                return !array.includes('false') && array.length >= 1;
              }
            }
            return typeof value[key] === 'string' && value[key] != '';
          });

          return truthArray.includes(true);
        }),
      otherwise: object().shape({
        hookAndLine: array().of(string()).ensure(),
        gillNets: array().of(string()).ensure(),
        liftNets: array().of(string()).ensure(),
        potsAndTraps: array().of(string()).ensure(),
        seineNets: array().of(string()).ensure(),
        scoopNets: array().of(string()).ensure(),
        fallingGear: array().of(string()).ensure(),
        miscellaneous: array().of(string()).ensure(),
        others: string(),
      }),
    }),
    vessel: object().when(['mainFishingActivity', 'otherFishingActivities'], {
      is: vesselState,
      then: object().shape({
        mfvrNumber: string().required('Please fill up mfvr no.'),
        homeport: string().required('Please indicate home port'),
        name: string().required('Vessel must have name'),
        material: string().required('Select material.'),
        type: string().required('Please indicate type'),
        placeBuilt: string().required('Please indicate place built'),
        yearBuilt: string().matches(/^$|\d{4}$/, 'Enter year.'),
        registeredLength: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        registeredDepth: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        registeredBreadth: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        tonnageLength: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        tonnageDepth: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        tonnageBreadth: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        grossTonnage: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        netTonnage: string().matches(/^$|[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
        engineMake: string().required('Please indicate engine make'),
        serialNumber: string().required('Please enter engine serial number'),
        horsepower: string(),
        files: mixed()
          .required('Please Upload Vessel Images')
          .test('fileSize', 'File too large', (value) => {
            const truthArray = [];
            if (value) {
              for (let i = 0; i < value.length; i++) {
                if (value[i].size >= uploadLimit) {
                  truthArray.push(value[i]);
                }
              }
            }
            return truthArray.length == 0;
          })
          .test('fileFormat', 'Unsupported Format, Format must be in .jpeg, .jpg, .png', (value) => {
            const truthArray = [];
            if (value) {
              for (let i = 0; i < value.length; i++) {
                if (value[i].type.match(/^.*(image\/jpeg|jpg|png)$/gm)) {
                  truthArray.push(value[i]);
                }
              }
            }
            return truthArray.length >= 0;
          }),
      }),
    }),
  });
};

const VesselWithGearSchema = object().shape({
  vessel: object().shape({
    engineMake: string(),
    grossTonnage: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    homeport: string(),
    horsepower: string(),
    mfvrNumber: string(),
    material: string().required('Select material.'),
    name: string(),
    netTonnage: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    placeBuilt: string(),
    registeredBreadth: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    registeredDepth: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    registeredLength: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    serialNumber: string(),
    tonnageBreadth: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    tonnageDepth: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    tonnageLength: string().matches(/^[0-9]\d*(\.\d+)?$/, 'Enter a number.'),
    type: string(),
    yearBuilt: string().matches(/^$|\d{4}$/, 'Enter year.'),
  }),
});

const CreateAccountSchema = object().shape({
  username: string().required('Enter username.').min(6, 'Username must be atleast 6 characters.'),
  password: string()
    .required('Enter password.')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*[#?!@$%^&*_-]).{8,}$/, 'Password must contain atleast 8 characters, one uppercase, one lowercase, one number and one special character.'),
});

const LoginSchema = object().shape({
  username: string().required('Enter username.'),
  password: string().required('Enter password.'),
});

const UpdateFisherfolkSchema = object().shape({
  profilePhoto: mixed()
    .test('fileSize', 'File too large', (value) => !value || (value instanceof FileList && value[0].size <= uploadLimit))
    .test('fileFormat', 'Unsupported Format, Format must be in .jpeg, .jpg, .png', (value) => !value || (value && value[0].type.match(/^.*(image\/jpeg|jpg|png)$/gm))),
  contactNumber: string().matches(/^$|^(09|\+639)\d{9}$/, 'Please enter a valid contact number.'),
  age: string().matches(/^$|^(1[89]|[2-9]\d)$/gm, 'Must be 18 or Above'),
  ptnContactNum: string().matches(/^$|^(09|\+639)\d{9}$/, 'Please enter a valid contact number.'),
});

export { FfolkValidation, VesselWithGearSchema, CreateAccountSchema, LoginSchema, UpdateFisherfolkSchema };
