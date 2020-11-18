// thaw-image-processing.ts/test/rotate.test.ts

import {
	createThAWImage,
	rotate180DegreesFromImage,
	rotate90DegreesClockwiseFromImage,
	rotate90DegreesCounterclockwiseFromImage
} from '..';

test('rotateImage 90 degrees clockwise', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = rotate90DegreesClockwiseFromImage(srcImage);

	// Assert
	expect(dstImage).toBeTruthy();
});

test('rotateImage 90 degrees counterclockwise', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = rotate90DegreesCounterclockwiseFromImage(srcImage);

	// Assert
	expect(dstImage).toBeTruthy();
});

test('rotateImage 180 degrees', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = rotate180DegreesFromImage(srcImage);

	// Assert
	expect(dstImage).toBeTruthy();
});
