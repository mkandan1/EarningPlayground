import { useEffect, useRef } from 'react';

export default function Banner460(): JSX.Element {
    const banner = useRef<HTMLDivElement>(null);

    const atOptions = {
        key: 'ea2bcc03782b1494c35999ec874fdb42',
        format: 'iframe',
        height: 60,
        width: 468,
        params: {},
    };

    useEffect(() => {
        const refreshAd = () => {
            if (typeof document != 'undefined' && banner.current) {
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
