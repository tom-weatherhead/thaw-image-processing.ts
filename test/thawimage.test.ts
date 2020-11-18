// thaw-image-utilities.ts/test/thawimage.test.ts

import { createThAWImage } from '../lib/main';

test('Create image', () => {
	// Arrange
	const width = 1024;
	const height = 768;
	const bytesPerPixel = 4;

	// Act
	const image = createThAWImage(width, height, bytesPerPixel);

	// Assert
	expect(image).toBeTruthy();
	expect(image.width).toEqual(width);
	expect(image.height).toEqual(height);
	expect(image.bytesPerPixel).toEqual(bytesPerPixel);
});

test('Fill image', () => {
	// Arrange
	const width = 40;
	const height = 25;
	const srcColour: number[] = [64, 128, 192, 255];

	// Act
	const image = createThAWImage(width, height);

	image.fill(0, 0, image.width, image.height, srcColour);

	const sampledColour: number[] = image.getPixelAsArray(
		Math.floor(height / 2),
		Math.floor(width / 2)
	);

	// Assert
	expect(image).toBeTruthy();
	expect(image.width).toEqual(width);
	expect(image.height).toEqual(height);
	expect(sampledColour).toStrictEqual(srcColour); // We use .toStrictEqual() because we want a deep comparison of the two arrays.
});

// test('Copy image', () => {
// });
