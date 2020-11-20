// thaw-image-processing.ts/src/gaussian-blur.ts

// Adapted from http://dev.theomader.com/gaussian-kernel-calculator/

// See also https://en.wikipedia.org/wiki/Gaussian_blur

import { IThAWImage } from '../util/image';

import { convolveImageFromBuffer } from '../util/convolve';

import Sample from '../util/sample';
import SampleArrayAndWeight from '../util/sample-array-and-weight';

function gaussianDistribution(x: number, mu: number, sigma: number): number {
	const d = x - mu;
	const n = 1.0 / (Math.sqrt(2 * Math.PI) * sigma);

	return Math.exp((-d * d) / (2 * sigma * sigma)) * n;
}

function sampleInterval(
	f: (x: number) => number,
	minInclusive: number,
	maxInclusive: number,
	sampleCount: number
): Sample[] {
	const result: Sample[] = [];
	const stepSize = (maxInclusive - minInclusive) / (sampleCount - 1);

	for (let s = 0; s < sampleCount; ++s) {
		const x = minInclusive + s * stepSize;
		const y = f(x);

		result.push(new Sample(x, y));
	}

	return result;
}

function integrateSimpson(samples: Sample[]): number {
	let result =
		samples[0].sampleValueAtX +
		samples[samples.length - 1].sampleValueAtX;

	for (let s = 1; s < samples.length - 1; ++s) {
		const sampleWeight = s % 2 === 0 ? 2.0 : 4.0;

		result += sampleWeight * samples[s].sampleValueAtX;
	}

	const h =
		(samples[samples.length - 1].x - samples[0].x) / (samples.length - 1);

	return (result * h) / 3.0;
}

function roundTo6DecimalPlaces(n: number): number {
	return Math.round(n * 1000000) / 1000000;
}

export function generateKernel(sigma: number, kernelSize: number): number[] {
	// sigma must be a positive number.
	// kernelSize must be an odd positive integer smaller than 999.
	const sampleCount = 1000.0;

	let samplesPerBin = Math.ceil(sampleCount / kernelSize);

	if (samplesPerBin % 2 === 0) {
		// need an even number of intervals for Simpson integration => odd number of samples
		++samplesPerBin;
	}

	let weightSum = 0;
	const kernelLeft = -Math.floor(kernelSize / 2);

	const calcSamplesForRange = (
		minInclusive: number,
		maxInclusive: number
	): Sample[] => {
		return sampleInterval(
			(x) => gaussianDistribution(x, 0, sigma),
			minInclusive,
			maxInclusive,
			samplesPerBin
		);
	};

	// Get samples left and right of kernel support first
	const outsideSamplesLeft: Sample[] = calcSamplesForRange(
		-5 * sigma,
		kernelLeft - 0.5
	);
	const outsideSamplesRight: Sample[] = calcSamplesForRange(
		-kernelLeft + 0.5,
		5 * sigma
	);
	const allSamples: SampleArrayAndWeight[] = [
		new SampleArrayAndWeight(outsideSamplesLeft, 0)
	];

	// Now, sample kernel taps and calculate tap weights

	for (let tap = 0; tap < kernelSize; ++tap) {
		const left = kernelLeft - 0.5 + tap;
		const tapSamples: Sample[] = calcSamplesForRange(left, left + 1);
		const tapWeight: number = integrateSimpson(tapSamples);

		allSamples.push(new SampleArrayAndWeight(tapSamples, tapWeight));
		weightSum += tapWeight;
	}

	allSamples.push(new SampleArrayAndWeight(outsideSamplesRight, 0));

	// Renormalize the kernel and round its entries to 6 decimal places.

	const result = [];

	for (let i = 1; i < allSamples.length - 1; ++i) {
		result.push(roundTo6DecimalPlaces(allSamples[i].weight / weightSum));
	}

	return result;
}

export function gaussianBlurImage(
	srcImage: IThAWImage,
	sigma: number,
	kernelSize: number
): IThAWImage {
	const kernel = generateKernel(sigma, kernelSize);

	return convolveImageFromBuffer(srcImage, kernel);
}
