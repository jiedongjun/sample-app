export interface ISampleFile {
  id?: number;
  url?: string | null;
  sampleId?: number | null;
}

export class SampleFile implements ISampleFile {
  constructor(public id?: number, public url?: string | null, public sampleId?: number | null) {}
}

export function getSampleFileIdentifier(sampleFile: ISampleFile): number | undefined {
  return sampleFile.id;
}
