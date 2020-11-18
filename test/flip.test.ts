// thaw-image-processing.ts/test/flip.test.ts

import { createThAWImage, flipImage } from '..';

test('flipImage', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = flipImage(srcImage);

	// Assert
	expect(dstImage).toBeTruthy();
});
