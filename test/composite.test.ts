// thaw-image-processing.ts/test/composite.test.ts

import { compositeTest, createThAWImage } from '..';

test('compositeTest', () => {
	// Arrange
	const width = 320;
	const height = 200;
	const srcImage = createThAWImage(width, height);

	// Act
	const dstImage = compositeTest(srcImage);

	// Assert
	expect(dstImage).toBeTruthy();
});
