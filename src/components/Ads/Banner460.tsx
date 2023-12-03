import { useEffect, useRef } from 'react';

export default function Banner460(): JSX.Element {
    const banner = useRef<HTMLDivElement>(null);

    const atOptions = {
        key: 'af0d679c230c081da37cf2a31cbd2afc',
        format: 'iframe',
        height: 60,
        width: 468,
        params: {},
    };

    useEffect(() => {
        const refreshAd = () => {
            if (banner.current) {
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
