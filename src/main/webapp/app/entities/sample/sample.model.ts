export interface ISample {
  id?: number;
  name?: string | null;
  duration?: number | null;
  userId?: number | null;
}

export class Sample implements ISample {
  constructor(public id?: number, public name?: string | null, public duration?: number | null, public userId?: number | null) {}
}

export function getSampleIdentifier(sample: ISample): number | undefined {
  return sample.id;
}
