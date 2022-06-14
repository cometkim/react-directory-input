import * as React from 'react';

import ReactDirectoryInput, {
  type ReactDirectoryInputProps,
} from './ReactDirectoryInput';
import { ZipArchiver } from './ZipArchiver';

export type ReactDirectoryZipInputProps = Omit<ReactDirectoryInputProps, 'archiver' | 'contentType'>;

const ReactDirectoryZipInput: React.ForwardRefRenderFunction<HTMLInputElement, ReactDirectoryZipInputProps> = ({
  ...directoryInputProps
}, forwardedRef) => {
  const getArchiver = React.useCallback((props: { baseDirectoryName: string }) => {
    return new ZipArchiver(props);
  }, []);

  return (
    <ReactDirectoryInput
      {...directoryInputProps}
      ref={forwardedRef}
      getArchiver={getArchiver}
      contentType="application/zip"
    />
  );
};

ReactDirectoryZipInput.displayName = 'ReactDirectoryZipInput';
export default React.forwardRef(ReactDirectoryZipInput);
