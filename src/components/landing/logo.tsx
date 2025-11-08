import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <svg
            width="698"
            height="699"
            viewBox="0 0 698 699"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('w-12 h-12', className)}>
            <defs>
                {/* Gradiente para simular luz neon realista (branco no centro → roxo ultra vibrante nas bordas) */}
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#F0ABFC', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#F0ABFC', stopOpacity: 1 }} />
                </linearGradient>
                
                {/* Filtro com múltiplas camadas de glow para efeito neon realista */}
                <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur3"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur4"/>
                    <feMerge>
                        <feMergeNode in="blur4"/>
                        <feMergeNode in="blur3"/>
                        <feMergeNode in="blur2"/>
                        <feMergeNode in="blur1"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <style>{`
                @keyframes neonDash {
                    from { stroke-dashoffset: 2800; }
                    to { stroke-dashoffset: 0; }
                }
                .neon-outline {
                    stroke: url(#neonGradient);
                    stroke-width: 6;
                    stroke-linecap: round;
                    fill: none;
                    filter: url(#neonGlow) drop-shadow(0 0 25px #E879F9) drop-shadow(0 0 50px #F0ABFC) drop-shadow(0 0 75px #D946EF);
                    stroke-dasharray: 150 2650;
                    animation: neonDash 8s linear infinite;
                }
            `}</style>
            
            {/* Contorno neon animado */}
            <g className="neon-outline">
                <path d="M263.548 468.5H118.049L64.5117 573.704L214.012 574.704L263.548 468.5Z" />
                <path d="M282.048 141L352.048 282L263.548 468.5H118.049L282.048 141Z" />
                <path d="M282.048 141L352.098 2L421.346 140L352.346 281.5L282.048 141Z" />
                <path d="M421.346 140L352.346 281.5L543.346 698H696.846L421.346 140Z" />
                <path d="M377.282 467.204L263.548 468.5L214.012 574.704H429.011L377.282 467.204Z" />
                <path d="M43.0002 614.5H197L157 698H1L43.0002 614.5Z" />
            </g>
            <g clipPath="url(#clip0_3389_39)" opacity="0.6">
                <path d="M263.548 468.5H118.049L64.5117 573.704L214.012 574.704L263.548 468.5Z" stroke="black" />
                <g filter="url(#filter0_i_3389_39)">
                    <path d="M282.048 141L352.048 282L263.548 468.5H118.049L282.048 141Z" fill="#9333EA" />
                </g>
                <path d="M282.048 141L352.048 282L263.548 468.5H118.049L282.048 141Z" stroke="#A855F7" />
                <g filter="url(#filter1_i_3389_39)">
                    <path d="M263.548 468.5H118.049L64.5117 573.704L214.012 574.704L263.548 468.5Z" fill="#A855F7" />
                </g>
                <path d="M263.548 468.5H118.049L64.5117 573.704L214.012 574.704L263.548 468.5Z" stroke="#C084FC" />
                <g filter="url(#filter2_i_3389_39)">
                    <path d="M282.048 141L352.098 2L421.346 140L352.346 281.5L282.048 141Z" fill="#A855F7" />
                </g>
                <path d="M282.048 141L352.098 2L421.346 140L352.346 281.5L282.048 141Z" stroke="#C084FC" />
                <g filter="url(#filter3_i_3389_39)">
                    <path d="M421.346 140L352.346 281.5L543.346 698H696.846L421.346 140Z" fill="#7C3AED" />
                </g>
                <path d="M421.346 140L352.346 281.5L543.346 698H696.846L421.346 140Z" stroke="#9333EA" />
                <g filter="url(#filter4_i_3389_39)">
                    <path d="M377.282 467.204L263.548 468.5L214.012 574.704H429.011L377.282 467.204Z" fill="#9333EA" />
                </g>
                <path d="M377.282 467.204L263.548 468.5L214.012 574.704H429.011L377.282 467.204Z" stroke="#A855F7" />
                <g filter="url(#filter5_i_3389_39)">
                    <path d="M43.0002 614.5H197L157 698H1L43.0002 614.5Z" fill="#7C3AED" />
                </g>
                <path d="M43.0002 614.5H197L157 698H1L43.0002 614.5Z" stroke="#9333EA" />
            </g>
            <defs>
                <filter id="filter0_i_3389_39" x="118.049" y="112" width="277.999" height="356.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="44" dy="-29" />
                    <feGaussianBlur stdDeviation="46" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3389_39" />
                </filter>
                <filter id="filter1_i_3389_39" x="64.5117" y="468.5" width="222.036" height="124.204" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="23" dy="18" />
                    <feGaussianBlur stdDeviation="20" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3389_39" />
                </filter>
                <filter id="filter2_i_3389_39" x="282.048" y="2" width="157.298" height="329.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="18" dy="50" />
                    <feGaussianBlur stdDeviation="28.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3389_39" />
                </filter>
                <filter id="filter3_i_3389_39" x="352.346" y="140" width="357.5" height="558" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="13" />
                    <feGaussianBlur stdDeviation="29.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3389_39" />
                </filter>
                <filter id="filter4_i_3389_39" x="214.012" y="444.204" width="248.999" height="130.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="34" dy="-23" />
                    <feGaussianBlur stdDeviation="30" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3389_39" />
                </filter>
                <filter id="filter5_i_3389_39" x="1" y="596.5" width="225" height="101.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="29" dy="-18" />
                    <feGaussianBlur stdDeviation="27.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3389_39" />
                </filter>
                <clipPath id="clip0_3389_39">
                    <rect width="698" height="699" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}
