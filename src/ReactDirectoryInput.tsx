import * as React from 'react';
import mergeRefs from 'react-merge-refs';
import { type IntrinsicElementWrapperFuntion } from '@cometjs/react-utils';

import { type Archiver } from './Archiver';

export type ReactDirectoryInputArchivingStartCallback = (props: {
  files: File[],
}) => boolean;

export type ReactDirectoryInputBeforeArchivingProgressCallback = (props: {
  file: File,
  files: File[],
  remaning: File[],
  procceed: File[],
}) => boolean;

export type ReactDirectoryInputAfterArchivingProgressCallback = (props: {
  file: File,
  files: File[],
  remaning: File[],
  procceed: File[],
}) => void;

export type ReactDirectoryInputArchivingResultCallback = (props: {
  result: File,
  procceed: File[],
}) => void;

export type ReactDirectoryInputArchivingErrorCallback = (props: {
  error: unknown,
}) => void;

export type ReactDirectoryInputProps = {
  /**
   * function to get directory archiver instance
   */
  getArchiver: (props: { baseDirectoryName: string }) => Archiver,

  /**
   * mime type of the result file.
   */
  contentType: string,

  onArchivingStart?: ReactDirectoryInputArchivingStartCallback,
  onBeforeArchivingProgress?: ReactDirectoryInputBeforeArchivingProgressCallback,
  onAfterArchivingProgress?: ReactDirectoryInputAfterArchivingProgressCallback,
  onArchivingResult?: ReactDirectoryInputArchivingResultCallback,
  onArchivingError?: ReactDirectoryInputArchivingErrorCallback,
};

const ReactDirectoryInput: IntrinsicElementWrapperFuntion<'input', ReactDirectoryInputProps> = ({
  id,
  name,
  onChange,
  contentType,
  getArchiver,
  onArchivingStart,
  onBeforeArchivingProgress,
  onAfterArchivingProgress,
  onArchivingResult,
  onArchivingError,
  ...otherProps
}, forwardedRef) => {
  const localRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        {...otherProps}
        type="file"
        // @ts-ignore
        directory=""
        // @ts-ignore
        mozdirectory=""
        // @ts-ignore
        webkitdirectory=""
        multiple
        onChange={async e => {
          const localElement = localRef.current;
          if (!localElement) {
            e.preventDefault();
            return;
          }

          const fileList = e.target.files;
          if (fileList) {
            const files = [...fileList];
            const [firstFile] = fileList;
            const [baseDirectoryName] = firstFile.webkitRelativePath.split('/');

            try {
              const archiver = getArchiver({ baseDirectoryName });
              onArchivingStart?.({ files });

              let remaning = files.slice();
              const procceed: File[] = [];
              for (const file of files) {
                if (
                  onBeforeArchivingProgress == null ||
                  onBeforeArchivingProgress({
                    file,
                    files,
                    procceed,
                    remaning,
                  })
                ) {
                  await archiver.addFileEntry(file);
                  procceed.push(file);
                  remaning = remaning.filter(procceed => procceed === file);

                  onAfterArchivingProgress?.({
                    file,
                    files,
                    procceed,
                    remaning,
                  });
                }
              }

              const result = await archiver.getResult();
              localElement.value = `C:\\fakepath\\${result.name}`;

              const transfer = new DataTransfer();
              transfer.items.add(result);
              localElement.files = transfer.files;
              onArchivingResult?.({ procceed, result });

            } catch (error: unknown) {
              onArchivingError?.({ error });
            }
          } else {
            localElement.value = "";
          }
          localElement.dispatchEvent(new Event('change'));
        }}
      />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={mergeRefs([localRef, forwardedRef])}
        id={id}
        name={name}
      />
      <noscript>
        <input
          {...otherProps}
          type="file"
          accept={contentType}
        />
      </noscript>
    </>
  );
};

ReactDirectoryInput.displayName = 'ReactDirectoryInput';
export default React.forwardRef(ReactDirectoryInput);
