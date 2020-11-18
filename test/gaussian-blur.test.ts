// thaw-image-processing.ts/test/gaussian-blur.test.ts

import { createThAWImage, gaussianBlurImage } from '..';

test('gaussianBlurImage', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);
	const sigma = 4.0;
	const kernelSize = 21; // kernelSize must be an odd positive integer smaller than 999.

	// Act
	const dstImage = gaussianBlurImage(srcImage, sigma, kernelSize);

	// Assert
	expect(dstImage).toBeTruthy();
});
