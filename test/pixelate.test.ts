// thaw-image-processing.ts/test/pixelate.test.ts

import { createThAWImage, pixelateImageFromBuffer } from '..';

test('pixelateImage', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);
	const pixelWidth = 8;

	// Act
	const dstImage = pixelateImageFromBuffer(srcImage, pixelWidth);

	// Assert
	expect(dstImage).toBeTruthy();
});
