export * from './browser';
export * from './dom';
export * from './formatter';
export * from './keyboard';
export * from './validator';

export const headerLabel = (string) => {
	if (!string) return string;

	if (string.includes('_')) {
		return string
			.replaceAll('_', ' ')
			.replaceAll('pcu', 'PCU')
			.replaceAll(/\bid\b/g, 'ID')
			.replaceAll(/\brid\b/g, 'RID')
			.replaceAll(/\btar\b/g, 'TAR')
			.replaceAll(/\bt_a_r\b/g, 'TAR')
			.replaceAll(/\brma\b/g, 'RMA')
			.replaceAll(/\br_m_a\b/g, 'RMA')
			.replaceAll(/\bdob\b/g, 'DOB')
			.replaceAll(/(^\w|\s\w)/g, (firstChar) => firstChar.toUpperCase())
			.trim();
	}

	return string.replaceAll(/([A-Z])/g, ' $1').replaceAll(/(^\w|\s\w)/g, (firstChar) => firstChar.toUpperCase());
};

export const catchObject = (message) => ({
	error: null,
	message,
	success: false
});
