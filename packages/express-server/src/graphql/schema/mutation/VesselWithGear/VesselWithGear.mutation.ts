import { list, nonNull, mutationField, intArg, stringArg } from 'nexus';
import CreateGearInput from '../../input/Gear.input';
import CreateVesselInput from '../../input/Vessel.input';
import {
  createGear, createVessel, createVesselWithGear, updateMfvr,
  archiveGear, archiveVessel} from './VesselWithGear.resolver';
import Vessel from '../../model/objecTypes/Vessel';
import Gear from '../../model/objecTypes/Gear';
import { context } from '../../../context';

export const CreateVessel = mutationField('createVessel', {
  type: Vessel,
  args: {
    vessel: nonNull(CreateVesselInput),
  },
  resolve: async (_, args, context) =>
    createVessel(args.vessel, context),
});

export const CreateGears = mutationField('createGears', {
  type: list(Gear),
  args: {
    gears: list(nonNull(CreateGearInput)),
  },
  resolve: async (_, args, context) =>
    args.gears.map((gear) => createGear(gear, context))
});

export const CreateVesselWithGear = mutationField('createVesselWithGear', {
  type: Vessel,
  args: {
    vessel: nonNull(CreateVesselInput),
    gears: list(nonNull(CreateGearInput)),
  },
  resolve: async (_, args, context) =>
    createVesselWithGear(args.vessel, args.gears, context),
});

export const UpdateMFVR = mutationField('updateMfvr', {
  type: Vessel,
  args: {
    id: nonNull(intArg()),
    mfvrNum: nonNull(stringArg()),
  },
  resolve: async (_, args, context) =>
    updateMfvr(args.id, args.mfvrNum, context),
});

export const ArchiveGear = mutationField('archiveGear', {
  type: Vessel,
  args: {
    id: nonNull(intArg())
  },
  resolve: async (_, args, context) => archiveGear(args.id, context)
});

export const ArchiveVessel = mutationField('archiveVessel', {
  type: Gear,
  args: {
    id: nonNull(intArg())
  },
  resolve: async (_, args, context) => archiveVessel(args.id, context)
});