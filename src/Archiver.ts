export interface Archiver {
  addFileEntry(file: File): Promise<void>;
  getResult(): Promise<File>;
}
