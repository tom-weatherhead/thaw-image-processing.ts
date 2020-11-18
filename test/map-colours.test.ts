// thaw-image-processing.ts/test/map-colours.test.ts

import {
	createThAWImage,
	desaturateRGBA,
	mapColoursInImageFromBuffer
} from '..';

test('desaturateRGBA', () => {
	// Arrange
	// const expectedValue = 0;
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = mapColoursInImageFromBuffer(srcImage, desaturateRGBA);

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(dstImage).toBeTruthy();
});
