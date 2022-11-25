import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  Tab,
  Tabs,
} from '@mui/material';
import VesselTable from '../Table/VesselTable';
import GearTable from '../Table/GearTable';
import { FisherfolkStatusButton } from '../Buttons/CustomStatusButton';
import AddVesselWithGearForm from '../Forms/AddVesselWithGearForms';
import { FisherfolkByIdDocument } from '../../graphql/generated';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Loading from '../Loading/Loading';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'start',
  color: theme.palette.text.secondary,
}));

interface InfoProps {
  title: string;
  description: string | undefined;
}

interface InfoTitleProps {
  description: string;
}

function Info(input: InfoProps) {
  return (
    <Stack direction="row" spacing={0.3}>
      <Typography variant="caption" color="#347fed">
        {input.title}:
      </Typography>
      <Typography variant="caption" justifyContent="flex-start">
        {input.description}
      </Typography>
    </Stack>
  );
}

function InfoTitle(input: InfoTitleProps) {
  return (
    <Stack direction="row">
      <Typography variant="caption" marginTop={1}>
        <b>{input.description}</b>
      </Typography>
    </Stack>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs() {
  const [addVesselGearBtn, setAddGearsBtn] = useState(false);
  const handleAddMemberOpen = () => setAddGearsBtn(true);
  const handleAddVesselGearClose = () => setAddGearsBtn(false);
  const [value, setValue] = useState(0);
  <Box m={1}>
    <Button
      size="small"
      variant="contained"
      color="primary"
      sx={{ height: 30, fontSize: 5, justifyContent: 'flex-end' }}
    >
      Add Boat/Gear
    </Button>
  </Box>;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid
        container
        justifyContent="space-between"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Boats" {...a11yProps(0)} />
          <Tab label="Gears" {...a11yProps(1)} />
        </Tabs>
        <Box m={1}>
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 30 }}
            onClick={handleAddMemberOpen}
          >
            Add Boat/Gear
          </Button>
          {addVesselGearBtn && (
            <AddVesselWithGearForm
              handleClose={handleAddVesselGearClose}
              open={addVesselGearBtn}
            />
          )}
        </Box>
      </Grid>
      <TabPanel value={value} index={0}>
        <VesselTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GearTable />
      </TabPanel>
    </Box>
  );
}

const FisherfolkViewProfile = () => {
  const { id } = useParams();

  if (id == undefined) {
    throw 'Ffolk does not exist';
  }

  const {
    loading,
    error,
    data: { fisherfolk } = {},
  } = useQuery(FisherfolkByIdDocument, {
    variables: {
      fisherfolkId: parseInt(id),
    },
  });

  if (error) {
    console.log(error);
    return <h1>Error Failed to Fetch!!!</h1>;
  }

  if (loading) {
    <Loading />;
  }

  const handleUndefine = (str: string | undefined) =>
    str == undefined ? '' : str;

  const name = `${handleUndefine(fisherfolk?.lastName)}, ${handleUndefine(
    fisherfolk?.firstName
  )} ${handleUndefine(fisherfolk?.middleName)} ${handleUndefine(
    fisherfolk?.appellation
  )}`;

  const address = `${handleUndefine(fisherfolk?.barangay)} ${handleUndefine(
    fisherfolk?.cityMunicipality
  )}, ${handleUndefine(fisherfolk?.province)}`;

  const mainFishingActivity =
    fisherfolk?.livelihoods == null
      ? ''
      : fisherfolk?.livelihoods.filter((a) => a?.isMain)[0]?.type;

  const otherFishingActivity =
    fisherfolk?.livelihoods == null
      ? ''
      : fisherfolk?.livelihoods.filter(
          (a) => a?.isMain === false && a.type !== 'Others'
        )[0]?.type;

  const otherSourceOfIncome =
    fisherfolk?.livelihoods == null
      ? ''
      : fisherfolk?.livelihoods.filter(
          (a) => a?.isMain === false && a.type === 'Others'
        )[0]?.description;

  const orgName =
    fisherfolk?.organizations == null
      ? ''
      : handleUndefine(fisherfolk?.organizations[0]?.organization.name);

  const yearJoined =
    fisherfolk?.organizations == null
      ? ''
      : handleUndefine(fisherfolk?.organizations[0]?.yearJoined.toString());

  const position =
    fisherfolk?.organizations == null
      ? ''
      : handleUndefine(fisherfolk?.organizations[0]?.position);

  return (
    <Grid container spacing={0.8}>
      <Grid item xs={12} sm={5} md={2.8}>
        <Item>
          <Stack direction="row" spacing={1}>
            <Typography variant="h6">{name}</Typography>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Typography variant="body2" width={200}>
              ID: {handleUndefine(id)}
            </Typography>
            <FisherfolkStatusButton label={fisherfolk?.status} />
          </Stack>
          <InfoTitle description="Personal Information" />
          <Info
            title="Contact Number"
            description={handleUndefine(fisherfolk?.contactNum)}
          />
          <Info title="Address" description={handleUndefine(address)} />
          <Info
            title="Gender"
            description={handleUndefine(fisherfolk?.gender)}
          />
          <Info
            title="Age"
            description={handleUndefine(fisherfolk?.age.toString())}
          />
          <Info
            title="Date of Birth"
            description={new Date(
              handleUndefine(fisherfolk?.dateOfBirth)
            ).toLocaleDateString()}
          />
          <Info
            title="Place of Birth"
            description={handleUndefine(fisherfolk?.placeOfBirth)}
          />
          <Info
            title="Nationality"
            description={handleUndefine(fisherfolk?.nationality)}
          />
          <Info
            title="Civil Status"
            description={handleUndefine(fisherfolk?.civilStatus)}
          />
          <Info
            title="Religion"
            description={handleUndefine(fisherfolk?.religion)}
          />
          <Info
            title="Educational Background"
            description={handleUndefine(fisherfolk?.educationalBackground)}
          />
          <Info
            title="Number of Children"
            description={handleUndefine(fisherfolk?.numOfChildren.toString())}
          />
          <Info
            title="Resident Year"
            description={handleUndefine(fisherfolk?.residentYear.toString())}
          />
          <InfoTitle description="Person to Notify incase of Emergency" />
          <Info
            title="Name"
            description={handleUndefine(fisherfolk?.personToNotify)}
          />
          <Info
            title="Relationship"
            description={handleUndefine(fisherfolk?.ptnRelationship)}
          />
          <Info
            title="Contact Number"
            description={handleUndefine(fisherfolk?.ptnContactNum)}
          />
          <Info
            title="Address"
            description={handleUndefine(fisherfolk?.ptnAddress)}
          />
          <InfoTitle description="Livelihood" />
          <Info
            title="Main Fishing Activity"
            description={handleUndefine(mainFishingActivity)}
          />
          <Info
            title="Other Fishing Activity"
            description={handleUndefine(otherFishingActivity)}
          />
          <Info
            title="Other Source of Income"
            description={handleUndefine(otherSourceOfIncome)}
          />
          <InfoTitle description="Organization" />
          <Info title="Name" description={orgName} />
          <Info title="Member since" description={yearJoined} />
          <Info title="Position" description={position} />
        </Item>
      </Grid>
      <Grid item xs={12} sm={7} md={9.2}>
        <Item sx={{ p: 0 }}>
          <Grid container>
            <BasicTabs />
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );
};

export default FisherfolkViewProfile;
