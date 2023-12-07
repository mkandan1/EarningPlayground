import { useEffect, useRef } from 'react';

export default function NativeBanner(): JSX.Element {
    const containerId = 'container-8045677dad9f66052e176c8217b3a3f7';
    const banner = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const refreshAd = () => {
            if (typeof document !== 'undefined' && banner.current) {
                // Clear the existing content
                banner.current.innerHTML = '';

                const script = document.createElement('script');
                script.async = true;
                script.dataset.cfasync = 'false';
                script.src = '//pl18066919.toprevenuegate.com/8045677dad9f66052e176c8217b3a3f7/invoke.js';

                banner.current.appendChild(script);

                console.log('Native banner refreshed');
            }
        };

        // Initial ad load
        refreshAd();


    }, []);

    return <div id={containerId} ref={banner}></div>;
}
