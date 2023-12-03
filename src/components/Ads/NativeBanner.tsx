import { useEffect, useRef } from 'react';

export default function NativeBanner(): JSX.Element {
    const containerId = 'container-1f9fba3a4c42eeba308fbf4563eb0668';
    const banner = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const refreshAd = () => {
            if (banner.current) {
                // Clear the existing content
                banner.current.innerHTML = '';

                const script = document.createElement('script');
                script.async = true;
                script.dataset.cfasync = 'false';
                script.src = '//pl18066919.toprevenuegate.com/1f9fba3a4c42eeba308fbf4563eb0668/invoke.js';

                banner.current.appendChild(script);

                console.log('Native banner refreshed');
            }
        };

        // Initial ad load
        refreshAd();

        // Set interval to refresh native banner every 35 seconds
        const intervalId = setInterval(refreshAd, 35000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return <div id={containerId} ref={banner}></div>;
}
