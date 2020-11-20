// thaw-image-processing.ts/src/sample-array-and-weight.ts

import Sample from './sample';

export default class SampleArrayAndWeight {
	public sampleArray: Sample[];
	public weight: number;

	constructor(sa: Sample[], w: number) {
		this.sampleArray = sa;
		this.weight = w;
	}
}
