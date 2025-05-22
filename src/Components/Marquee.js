import React, { useRef, useEffect, useState } from 'react';
 
/**

* A customizable marquee component without external classNames.

* Uses inline styles for full compatibility.

* Props:

*  - text: string to scroll

*  - speed: pixels per second (default: 50)

*  - direction: 'left' | 'right' (default: 'left')

*  - pauseOnHover: boolean (default: false)

*  - width: number (px) or string (e.g. '300px' or '100%') for container width (default: '100%')

*  - gradient: boolean to enable fade edges (default: false)

*  - gradientWidth: number of pixels for fade overlay on each side (default: 20)

*  - gradientColors: array of two CSS color strings [start, end] for fade (default: ['transparent', 'white'])

*/

export default function Marquee({

  text,

  speed = 70,

  direction = 'left',

  pauseOnHover = false,

  width = '90%',

  gradient = false,

  gradientWidth = 20,

  gradientColors = ['transparent', 'white'],

}) {

  const containerRef = useRef(null);

  const textRef = useRef(null);

  const [duration, setDuration] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
 
  useEffect(() => {

    if (containerRef.current && textRef.current) {

      const containerWidth = containerRef.current.offsetWidth;

      const textWidth = textRef.current.offsetWidth;

      const totalDistance = textWidth + containerWidth;

      setDuration(totalDistance / speed);

    }

  }, [text, speed]);
 
  const handleMouseEnter = () => pauseOnHover && setIsPaused(true);

  const handleMouseLeave = () => pauseOnHover && setIsPaused(false);
 
  const animName = direction === 'left' ? 'marquee' : 'marquee-reverse';

  const animation = `${animName} ${duration}s linear infinite ${isPaused ? 'paused' : ''}`;
 
  const containerStyle = {

    position: 'relative',

    overflow: 'hidden',

    whiteSpace: 'nowrap',

    width,

  };

  const textStyle = {

    display: 'inline-block',

    paddingLeft: '100%',

    animation,

  };
 
  const gradientStyleLeft = gradient

    ? {

        position: 'absolute',

        left: 0,

        top: 0,

        bottom: 0,

        width: gradientWidth,

        background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,

        pointerEvents: 'none',

      }

    : null;
 
  const gradientStyleRight = gradient

    ? {

        position: 'absolute',

        right: 0,

        top: 0,

        bottom: 0,

        width: gradientWidth,

        background: `linear-gradient(to left, ${gradientColors[0]}, ${gradientColors[1]})`,

        pointerEvents: 'none',

      }

    : null;
 
  return (
<div

      ref={containerRef}

      style={containerStyle}

      onMouseEnter={handleMouseEnter}

      onMouseLeave={handleMouseLeave}
>

      {gradient && <div style={gradientStyleLeft} />}
<div ref={textRef} style={textStyle}>{text}</div>

      {gradient && <div style={gradientStyleRight} />}
 
      {/* Inline keyframes */}
<style>

        {`@keyframes marquee {

            0% { transform: translateX(0); }

            100% { transform: translateX(-100%); }

          }

          @keyframes marquee-reverse {

            0% { transform: translateX(-100%); }

            100% { transform: translateX(0); }

          }`}
</style>
</div>

  );

}
 
// Usage examples:

// <Marquee text="Hello world" width="300px" />

// <Marquee text="Fast" speed={100} direction="right" />

// <Marquee text="Pause on hover" pauseOnHover width={500} />

// <Marquee text="With fade" gradient gradientWidth={30} gradientColors={["rgba(255,255,255,0)","rgba(255,255,255,1)"]} />
 