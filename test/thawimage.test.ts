// thaw-image-utilities.ts/test/thawimage.test.ts

'use strict';

import * as engine from '../lib/main';

test('Create image', () => {
	// Arrange
	// const expectedValue: number = 0;
	const width = 1024;
	const height = 768;
	const bytesPerPixel = 4;

	// Act
	// const actualValue: number = 0; //engine.max([8, 6, 9, 5, 3, 0, 7]);
	const image = engine.CreateThAWImage(
		width,
		height,
		bytesPerPixel,
		0,
		null
	);

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(image).toBeTruthy();
	expect(image.width).toEqual(width);
	expect(image.height).toEqual(height);
	expect(image.bytesPerPixel).toEqual(bytesPerPixel);
});

test('Fill image', () => {
	// Arrange
	// const expectedValue: number = 0;
	const width = 40;
	const height = 25;
	const bytesPerPixel = 4;
	const srcColour: number[] = [64, 128, 192, 255];

	// Act
	// const actualValue: number = 0; //engine.max([8, 6, 9, 5, 3, 0, 7]);
	const image = engine.CreateThAWImage(
		width,
		height,
		bytesPerPixel,
		0,
		null
	);

	image.fill(0, 0, image.width, image.height, srcColour);

	const sampledColour: number[] = image.getPixelAsArray(
		Math.floor(height / 2),
		Math.floor(width / 2)
	);

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(image).toBeTruthy();
	expect(image.width).toEqual(width);
	expect(image.height).toEqual(height);
	expect(image.bytesPerPixel).toEqual(bytesPerPixel);
	expect(sampledColour).toStrictEqual(srcColour); // We use .toStrictEqual() because we want a deep comparison of the two arrays.
});

// test('Copy image', () => {
// });
