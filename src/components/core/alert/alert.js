import React, { useEffect, useState } from 'react';
import { Form, Toast } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Alert = () => {
	const { t } = useTranslation();
	const [showA, setShowA] = useState(false);

	useEffect(() => {
		if (!navigator.onLine && !showA) {
			setShowA(true);
		}
	}, [showA]);

	return (
		<>
			<Toast show={showA} onClose={() => setShowA(!showA)} style={{ position: 'fixed', bottom: '1%', right: '1%' }}>
				<Toast.Header>
					<Form.Label className="w-100">{t('global:no-internet.translation')}</Form.Label>
				</Toast.Header>
				<Toast.Body>{t('global:check-internet.translation')}</Toast.Body>
			</Toast>
		</>
	);
};

export default Alert;
