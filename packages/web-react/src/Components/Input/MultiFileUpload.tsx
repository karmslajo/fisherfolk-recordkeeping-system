import React, { useState } from 'react';
import {
  UseFormRegister,
  Control,
  FieldValues,
  Controller,
} from 'react-hook-form';
import {
  Paper,
  Theme,
  Button,
  FormHelperText,
  SxProps,
  Grid,
  Box,
} from '@mui/material';

interface MultiFileUploadProps {
  id?: string;
  name: string;
  label: string;
  dataCy?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void | undefined;
  control: Control<FieldValues, unknown>;
  register: UseFormRegister<FieldValues>;
  errors: FieldValues;
  errorState?: boolean;
  errorMessage?: string;
  hideError?: boolean;
  sx?: SxProps<Theme> | undefined;
}

interface Data {
  uri: string;
  name: string;
  size: number;
  type: string;
}

const thumbnails = (srcs: string[]) => {
  return srcs.map((src, index) => {
    return (
      <Paper
        id={`file-thumbnail-${src}`}
        key={`file-thumbnail-${src}`}
        data-cy={`thumbnail-test-${index}`}
        sx={{
          m: 1,
          display: 'block',
          maxWidth: '64px',
          height: 'auto',
          width: 'auto',
        }}
        component="img"
        src={src}
      />
    );
  });
};

function MultiFileUpload({
  id = '',
  name,
  label = '',
  dataCy = '',
  control,
  errors,
  errorState,
  errorMessage,
  hideError,
  sx,
}: MultiFileUploadProps) {
  const [preview, setPreview] = useState<JSX.Element[] | undefined>([]);
  const [datas, setDatas] = useState<Data[]>([]);

  const createData = (files: File[], onChange: (value: any) => void) => {
    const srcs: string[] = [];
    const datas: Data[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      const { name, size, type } = file;

      reader.onload = (ev) => {
        if (ev.target) {
          if (ev.target.result) {
            const src = ev.target.result.toString();
            srcs.push(src);
            datas.push({ uri: src, name: name, size: size, type: type });
          } else {
            throw 'File is null';
          }
        }
        setPreview(thumbnails(srcs));
        onChange(datas);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload =
    (onChange: (value: any) => void) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const uploadedFiles: File[] = [];
      if (event.target instanceof HTMLInputElement) {
        const { files } = event.target;
        if (files) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadedFiles.push(file);
          }
          createData(uploadedFiles, onChange);
        }
      } else {
        throw 'Not Valid Input';
      }
    };

  return (
    <>
      <Box id={id} sx={sx} data-cy={dataCy}>
        <FormHelperText
          error={errorState ?? !!errors[name]}
          hidden={hideError ?? !errors[name]}
          sx={{ ml: 2, mt: 2 }}
        >
          {errorMessage ?? errors[name]?.message}
        </FormHelperText>
        <Grid
          id="file-thumbnail-container"
          container
          sx={{ p: 1, width: '100%' }}
        >
          {preview}
        </Grid>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field: { onChange } }) => (
            <Button
              fullWidth
              id={label}
              variant="contained"
              component="label"
              htmlFor="multi-upload-btn"
            >
              <input
                accept="image/*"
                id="multi-upload-btn"
                multiple
                type="file"
                hidden
                onChange={handleUpload(onChange)}
              />
              Upload
            </Button>
          )}
        />
      </Box>
    </>
  );
}

export default MultiFileUpload;
