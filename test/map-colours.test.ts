// thaw-image-processing.ts/test/map-colours.test.ts

import {
	createThAWImage,
	desaturateImage,
	rotateColourChannelsInImage
} from '..';

test('desaturateImage', () => {
	// Arrange
	// const expectedValue = 0;
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = desaturateImage(srcImage);

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(dstImage).toBeTruthy();
	expect(dstImage.width).toBe(srcImage.width);
	expect(dstImage.height).toBe(srcImage.height);
});

test('rotateColourChannelsInImage', () => {
	// Arrange
	// const expectedValue = 0;
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = rotateColourChannelsInImage(srcImage);

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(dstImage).toBeTruthy();
	expect(dstImage.width).toBe(srcImage.width);
	expect(dstImage.height).toBe(srcImage.height);
});
