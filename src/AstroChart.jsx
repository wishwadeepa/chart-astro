import React, { useEffect, useState, useMemo } from 'react';
import { Body, GeoVector, SearchRiseSet, Observer, Equator, Ecliptic, SearchHourAngle } from 'astronomy-engine';

const PLANETS = [
  { name: 'Sun', symbol: 'M16.5 8.25A8.25 8.25 0 1 1 0 8.25a8.25 8.25 0 0 1 16.5 0ZM8.25 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z', body: Body.Sun, color: '#FFD700' },
  { name: 'Moon', symbol: 'M13.625 15.11a8.25 8.25 0 0 1-5.375-7.61V7.5a8.25 8.25 0 1 0 6.671 13.065l-.369-.475-1.074-1.383.147-3.597Z', body: Body.Moon, color: '#C0C0C0' },
  { name: 'Mercury', symbol: 'M8.25 3.375a3.375 3.375 0 1 0 0 6.75 3.375 3.375 0 0 0 0-6.75Zm0 7.5a4.125 4.125 0 1 1 0-8.25 4.125 4.125 0 0 1 0 8.25ZM8.25 10.875v4.5M5.25 13.125h6M4.5 4.5a3.75 3.75 0 0 1 7.5 0', body: Body.Mercury, color: '#B87333' },
  { name: 'Venus', symbol: 'M8.25 3.375a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25Zm0 9v4.5M5.25 14.625h6', body: Body.Venus, color: '#EEDC82' },
  { name: 'Mars', symbol: 'M12 4.5l3-3m0 0h-3m3 0v3M8.25 6.375a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25Zm0 0l4.5-4.5', body: Body.Mars, color: '#FF4500' },
  { name: 'Jupiter', symbol: 'M4.5 3.75v3a4.5 4.5 0 0 0 4.5 4.5h3m0-7.5v12m-3-3h6', body: Body.Jupiter, color: '#DAA520' },
  { name: 'Saturn', symbol: 'M8.25 3.75v8.25m-3-3h6m-3-8.25a3 3 0 0 1 3 3v4.5a3 3 0 0 0 3 3', body: Body.Saturn, color: '#F4A460' },
  { name: 'Uranus', symbol: 'M8.25 2.25v3m0 0v6m0-6h-3m3 0h3M8.25 11.25a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 6v3', body: Body.Uranus, color: '#ADD8E6' },
  { name: 'Neptune', symbol: 'M4.5 4.5v3a3.75 3.75 0 0 0 3.75 3.75m3.75-6.75v3a3.75 3.75 0 0 1-3.75 3.75m0-6.75v12m-3-3h6', body: Body.Neptune, color: '#4169E1' },
];

const ZODIAC_SYMBOLS = [
  'M2.25 6.75c3 0 6-4.5 6-4.5s3 4.5 6 4.5M8.25 2.25v9', // Aries
  'M4.5 5.25a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0Zm3.75-3.75a3.75 3.75 0 0 0-3.75-3.75M12 1.5a3.75 3.75 0 0 0-3.75 3.75', // Taurus
  'M4.5 3h7.5M4.5 13.5h7.5M6 3v10.5M10.5 3v10.5', // Gemini
  'M9 4.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3-3c4.5 0 8.25 3.75 8.25 8.25M7.5 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3 3C6 15 2.25 11.25 2.25 6.75', // Cancer
  'M6 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-6c2.25-3 6.75-3 9 0s-2.25 10.5-6 10.5a3 3 0 1 1 0-6', // Leo
  'M3 4.5v6a3 3 0 0 0 3 3v-9m0 3v3a3 3 0 0 0 3 3v-9m0 3v3a3 3 0 0 0 3 3v-6m-3 6c0 3-3 4.5-6 4.5M12 10.5c3 0 4.5-1.5 4.5-4.5', // Virgo
  'M3 10.5h10.5M8.25 10.5V7.5a4.5 4.5 0 0 0-9 0', // Libra
  'M3 4.5v6a3 3 0 0 0 3 3v-9m0 3v3a3 3 0 0 0 3 3v-9m0 3v3a3 3 0 0 0 3 3v-3M12 13.5l3 3m0 0v-3m0 3h-3', // Scorpio
  'M3 13.5l10.5-10.5m0 0v4.5m0-4.5h-4.5M6 10.5l4.5-4.5', // Sagittarius
  'M3 4.5v6a3 3 0 0 0 3 3M6 13.5a3 3 0 0 0 3-3v-6m0 6a3 3 0 0 0 3 3c3 0 3-3 0-6s-4.5-3-4.5 0', // Capricorn
  'M2.25 9.75c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0M2.25 5.25c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0', // Aquarius
  'M4.5 3v10.5m7.5-10.5v10.5M2.25 8.25h12' // Pisces
];

// Helper to calculate planetary positions
const calculatePositions = (dateStr, timeStr, lat, lng) => {
  if (!dateStr || !timeStr || !lat || !lng) return null;

  try {
    const dateObj = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dateObj.getTime())) return null;

    const observer = new Observer(parseFloat(lat), parseFloat(lng), 0);
    const positions = [];

    // Calculate ascendant (simplistic calculation based on sidereal time)
    // We'll use the Sun's position as a baseline if actual houses are too complex for this visual
    const sunEq = Equator(Body.Sun, dateObj, observer, false, true);
    const sunEcl = Ecliptic(GeoVector(Body.Sun, dateObj, false));
    const ascendantLon = (sunEcl.elon + 90) % 360; // Very rough approximation for visual anchor

    PLANETS.forEach(planet => {
      const vec = GeoVector(planet.body, dateObj, false);
      const ecl = Ecliptic(vec);
      
      // Relative longitude to Ascendant (placing Ascendant at 9 o'clock / 180 degrees visually)
      let relativeLon = (ecl.elon - ascendantLon + 360) % 360;
      
      positions.push({
        ...planet,
        lon: relativeLon,
        rawLon: ecl.elon
      });
    });

    return { positions, ascendantLon };
  } catch (e) {
    console.error("Error calculating astronomy data:", e);
    return null;
  }
};

const AstroChart = ({ className, dateStr, timeStr, lat, lng, isComplete }) => {
  const [animatedPositions, setAnimatedPositions] = useState([]);
  const [showPlanets, setShowPlanets] = useState(false);
  const [showAspects, setShowAspects] = useState(false);

  // Calculate actual positions based on input
  const astroData = useMemo(() => calculatePositions(dateStr, timeStr, lat, lng), [dateStr, timeStr, lat, lng]);

  useEffect(() => {
    if (!isComplete) {
      setAnimatedPositions([]);
      setShowPlanets(false);
      setShowAspects(false);
      return;
    }

    if (astroData) {
      // Staggered reveal
      setTimeout(() => setShowPlanets(true), 500);
      setTimeout(() => setAnimatedPositions(astroData.positions), 600);
      setTimeout(() => setShowAspects(true), 1500);
    }
  }, [isComplete, astroData]);

  // Generate aspect lines (connections between planets with specific angles)
  const aspects = useMemo(() => {
    if (!showAspects || animatedPositions.length === 0) return [];
    const lines = [];
    const positions = animatedPositions;
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const diff = Math.abs(positions[i].lon - positions[j].lon);
        const diffMod = Math.min(diff, 360 - diff);
        
        // Define aspects: Trine (~120), Square (~90), Opposition (~180)
        let isAspect = false;
        let opacity = 0;
        let color = "rgba(212, 175, 55, 0.4)"; // Gold for positive
        
        if (Math.abs(diffMod - 120) < 5) { isAspect = true; opacity = 0.5; } // Trine
        else if (Math.abs(diffMod - 90) < 5) { isAspect = true; opacity = 0.4; color = "rgba(255, 100, 100, 0.4)"; } // Square (reddish)
        else if (Math.abs(diffMod - 180) < 5) { isAspect = true; opacity = 0.5; color = "rgba(100, 200, 255, 0.4)"; } // Opposition (bluish)
        else if (Math.abs(diffMod - 60) < 5) { isAspect = true; opacity = 0.3; } // Sextile

        if (isAspect) {
          const r1 = 95 + (i % 3) * 15;
          const a1 = ((positions[i].lon + 180) * Math.PI) / 180;
          const x1 = 200 + r1 * Math.cos(a1);
          const y1 = 200 + r1 * Math.sin(a1);

          const r2 = 95 + (j % 3) * 15;
          const a2 = ((positions[j].lon + 180) * Math.PI) / 180;
          const x2 = 200 + r2 * Math.cos(a2);
          const y2 = 200 + r2 * Math.sin(a2);

          lines.push(
            <line 
              key={`aspect-${i}-${j}`} 
              x1={x1} y1={y1} x2={x2} y2={y2} 
              stroke={color} 
              strokeWidth="1" 
              opacity={opacity} 
              style={{ transition: 'all 1s ease-in-out' }}
            />
          );
        }
      }
    }
    return lines;
  }, [showAspects, animatedPositions]);

  // If no real data yet, use random positions for initial animation effect when complete but no data
  const displayPositions = animatedPositions.length > 0 ? animatedPositions : (
     isComplete ? PLANETS.map((p, i) => ({...p, lon: Math.random() * 360})) : []
  );

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="80%" stopColor="rgba(212, 175, 55, 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        
        {/* Background glow */}
        <circle cx="200" cy="200" r="190" fill="url(#grad)" style={{ transition: 'opacity 2s', opacity: isComplete ? 1 : 0.2 }} />
        
        {/* Rings - fade in sequentially */}
        <g style={{ transition: 'opacity 1s', opacity: isComplete ? 1 : 0.1 }}>
          <circle cx="200" cy="200" r="180" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.8" />
          <circle cx="200" cy="200" r="176" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.6" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.7" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />
        </g>
        
        {/* Zodiac divisions (12 houses) */}
        <g style={{ transition: 'opacity 1.5s', opacity: isComplete ? 1 : 0 }}>
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 200 + 80 * Math.cos(angle);
            const y1 = 200 + 80 * Math.sin(angle);
            const x2 = 200 + 180 * Math.cos(angle);
            const y2 = 200 + 180 * Math.sin(angle);
            return (
              <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4af37" strokeWidth="0.5" opacity="0.6" />
            );
          })}
        </g>
        
        {/* Zodiac Symbols (Using vector paths) */}
        <g style={{ transition: 'opacity 2s', opacity: isComplete ? 1 : 0 }}>
          {ZODIAC_SYMBOLS.map((pathStr, i) => {
            // Offset angle. If we have an ascendant, we rotate the zodiac wheel.
            // For simplicity in this visualizer, we just rotate evenly.
            const ascendantOffset = astroData ? astroData.ascendantLon : 0;
            // 180 is left side (Ascendant), we subtract the actual ascendant lon to align
            const visualAngle = (i * 30 + 15 - ascendantOffset + 180) % 360; 
            const angle = (visualAngle * Math.PI) / 180;
            const x = 200 + 163 * Math.cos(angle);
            const y = 200 + 163 * Math.sin(angle);
            return (
              <g key={`sym-${i}`} transform={`translate(${x-8}, ${y-8}) scale(1)`} opacity="0.8">
                 <path d={pathStr} fill="none" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
        </g>

        {/* Outer degree dots */}
        <g style={{ transition: 'opacity 1s', opacity: isComplete ? 1 : 0 }}>
          {[...Array(72)].map((_, i) => {
            const angle = (i * 5 * Math.PI) / 180;
            const x = 200 + 178 * Math.cos(angle);
            const y = 200 + 178 * Math.sin(angle);
            return (
              <circle key={`dot-${i}`} cx={x} cy={y} r="1" fill="#d4af37" opacity="0.8" />
            );
          })}
        </g>

        {/* Aspect lines (Calculated dynamically) */}
        {aspects}
        
        {/* Center */}
        <circle cx="200" cy="200" r="3" fill="#d4af37" style={{ transition: 'opacity 0.5s', opacity: isComplete ? 1 : 0 }} />
        
        {/* Inner planetary symbols (Actual positions) */}
        <g style={{ transition: 'opacity 1s', opacity: showPlanets ? 1 : 0 }}>
          {displayPositions.map((planet, i) => {
            // +180 to place 0 degrees at 9 o'clock (Ascendant usually on the left)
            const angle = ((planet.lon + 180) * Math.PI) / 180;
            const dist = 95 + (i % 3) * 15; // varying distances so they don't overlap as much
            const x = 200 + dist * Math.cos(angle);
            const y = 200 + dist * Math.sin(angle);
            
            return (
              <g 
                key={`planet-${i}`} 
                transform={`translate(${x-8}, ${y-8})`} 
                style={{ transition: 'all 2s ease-out' }}
              >
                {/* Connecting line to center for some visual flair */}
                <line x1={8 - x + 200} y1={8 - y + 200} x2="8" y2="8" stroke={planet.color} strokeWidth="0.5" opacity="0.2" />
                <circle cx="8" cy="8" r="12" fill="#0b0c10" opacity="0.8" />
                <path d={planet.symbol} fill="none" stroke={planet.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default AstroChart;