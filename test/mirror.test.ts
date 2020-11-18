// thaw-image-processing.ts/test/mirror.test.ts

import { createThAWImage, mirrorImage } from '..';

test('mirrorImage', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = mirrorImage(srcImage);

	// Assert
	expect(dstImage).toBeTruthy();
});
