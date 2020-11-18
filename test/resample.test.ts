// thaw-image-processing.ts/test/resample.test.ts

import { createThAWImage, resampleImageFromBuffer, ResamplingMode } from '..';

test('resampleImage', () => {
	// Arrange
	const srcWidth = 320;
	const srcHeight = 200;
	const srcImage = createThAWImage(srcWidth, srcHeight);
	const dstWidth = 1024;
	const dstHeight = 768;

	// Act
	const dstImage = resampleImageFromBuffer(
		srcImage,
		dstWidth,
		dstHeight,
		ResamplingMode.Bicubic
	);

	// Assert
	expect(dstImage).toBeTruthy();
});
