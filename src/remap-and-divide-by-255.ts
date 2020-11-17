// thaw-image-processing.ts/src/remap-and-divide-by-255.ts

// The essence of dividend remapping is this:
// Map integer x from the range [0 ... 255 * 255] to the range [0 ... 255 * 256 - 1].
// Then 0 <= floor(x / 255) <= 255.

// The rationale behind dividend remapping is this:
// Without dividend remapping, if a and b are in the range [0 ... 255], then floor(a * b / 255) only if a === b === 255;
// e.g. if you smear a little bit of black (0) around a mostly white (255) canvas, the smeared colour may max out at e.g. 245 instead of 255.

export function fastDivideBy255(n: number): number {
	// This is advantageous if the divisions by 256 are done via bit shifting, rather than a div instruction.
	// We need the divisions by 256 to truncate the results and return integers.
	return (n / 256 + n + 1) / 256;
}

export function remapAndDivideBy255(dividend: number): number {
	return Math.trunc((dividend + Math.trunc(dividend / 256)) / 255); // TomW 2018-04-15
}
