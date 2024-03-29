import { Context } from '../../../context';
import { NexusGenInputs } from '../../../generated/nexus';
import cloudinary from 'cloudinary';

export const uploadToCloud = async (
  imageURI: string,
  options: cloudinary.UploadApiOptions
) => {
  const result = await cloudinary.v2.uploader.upload(imageURI, options);

  return result.url;
};
type CreateImageInput = NexusGenInputs['CreateImageInput'];

export const createImage = async (
  input: NexusGenInputs['UploadImageInput'],
  context: Context
) => {
  const {
    fisherfolkId,
    gearId,
    vesselId,
    name,
    size,
    type,
    uri,
    isProfileImage,
  } = input;
  const url = await uploadToCloud(uri, {
    folder: 'fisherfolk-recordkeeping-system',
    use_filename: true,
  });

  if (fisherfolkId) {
    return await context.prisma.image.create({
      data: {
        name,
        size,
        type,
        url,
        isProfileImage,
        fisherfolk: {
          connect: { id: fisherfolkId },
        },
      },
    });
  }

  if (gearId) {
    return await context.prisma.image.create({
      data: {
        name,
        size,
        type,
        url,
        isProfileImage,
        gear: {
          connect: { id: gearId },
        },
      },
    });
  }

  if (vesselId) {
    return await context.prisma.image.create({
      data: {
        name,
        size,
        type,
        url,
        isProfileImage,
        vessel: {
          connect: { id: vesselId },
        },
      },
    });
  }
};

export async function uploadImage(
  image: NexusGenInputs['CreateImageInput'],
  ctx: Context
) {
  const result = await cloudinary.v2.uploader.upload(image.url, {
    folder: 'fisherfolk-recordkeeping-system',
  });
  console.log(result.url); //checks cloudinary url

  return await ctx.prisma.image.create({
    data: {
      fisherfolkId: image.fisherfolkId,
      gearId: image.gear_id,
      vesselId: image.vessel_id,
      governmentAidId: image.government_aid_id,
      name: result.signature,
      url: result.url,
      updatedAt: result.created_at,
    },
  });
}

export async function updateFisherfolkImage(
  image: CreateImageInput,
  id: string,
  url: string,
  ctx: Context
) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // remove existing image
  await cloudinary.v2.uploader.destroy(url, { invalidate: true });

  // upload image
  const result = await cloudinary.v2.uploader.upload(image.url);

  return await ctx.prisma.image.update({
    where: {
      id: id,
    },
    data: {
      name: result.signature,
      url: result.url,
      updatedAt: result.created_at,
    },
  });
}
