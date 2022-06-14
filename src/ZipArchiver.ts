import * as zip from '@zip.js/zip.js';

import { type Archiver } from './Archiver';

export class ZipArchiver implements Archiver {
  #baseDirectoryName: string;
  #writer: zip.ZipWriter;

  constructor(props: {
    baseDirectoryName: string,
  }) {
    this.#baseDirectoryName = props.baseDirectoryName;
    this.#writer = new zip.ZipWriter(new zip.BlobWriter('application/zip'));
  }

  async addFileEntry(file: File): Promise<void> {
    await this.#writer.add(
      file.webkitRelativePath.replace(`${this.#baseDirectoryName}/`, ''),
      new zip.BlobReader(file),
    );
  }

  async getResult(): Promise<File> {
    const blob = await this.#writer.close() as Blob;
    return new File([blob], `${this.#baseDirectoryName}.zip`);
  }
}
