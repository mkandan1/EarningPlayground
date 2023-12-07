import { useEffect, useRef } from 'react';

export default function Banner(): JSX.Element {
    const banner = useRef<HTMLDivElement>(null); // Explicitly define the type

    const atOptions = {
        key: 'be291fe7638a798a2bc2bb640c941dfb',
        format: 'iframe',
        height: 50,
        width: 320,
        params: {},
    };

    useEffect(() => {
        const refreshAd = () => {
            if (typeof document !== 'undefined' && banner.current) {
                // Clear the existing content
                banner.current.innerHTML = '';

                const conf = document.createElement('script');
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `//www.topcreativeformat.com/${atOptions.key}/invoke.js`;
                conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

                banner.current.append(conf);
                banner.current.append(script);

                console.log('Ad refreshed');
            }
        };

        // Initial ad load
        refreshAd();

    }, []);

    return <div className="mx-2 my-5 flex justify-center items-center text-center" ref={banner}></div>;
}