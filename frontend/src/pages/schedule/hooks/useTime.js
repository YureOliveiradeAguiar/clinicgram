import { useState, useEffect } from 'react';

export const useTime = (interval = 5000) => {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const tick = () => setNow(new Date());
		const timer = setInterval(tick, interval);
		return () => clearInterval(timer);
	}, [interval]);

	return now;
};
