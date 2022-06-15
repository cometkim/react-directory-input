# react-directory-input

A simple component to handle a directory as a single file

## Example

```tsx
import * as React from 'react';
import { ReactDirectoryZipInput } from 'react-directory-input';

function DirectoryUpload() {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [upload, setUpload] = React.useState<File | null>(null);
  return (
    <ReactDirectoryZipInput
      onArchivingStart={() => {
        setIsProcessing(true);
      })
      onArchivingResult={({ result }) => {
        setUpload(result);
        setIsProcessing(false);
      }}
    />
  );
}
```

## Note about using form

There is no way to manipulate state of file input from JavaScript for security reason, which is I didn't noticed when implementing it.

When to try using form, **you should override default form submit handler** to build your own FormData, or it is always empty file value.

## LICENSE

MIT
