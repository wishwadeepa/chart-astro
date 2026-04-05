import React, { useEffect, useState, useMemo } from 'react';
import { Body, GeoVector, Ecliptic } from 'astronomy-engine';

const PLANETS = [
  { name: 'Sun', symbol: 'M16.5 8.25A8.25 8.25 0 1 1 0 8.25a8.25 8.25 0 0 1 16.5 0ZM8.25 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z', body: Body.Sun, color: '#FFD700', isNode: false },
  { name: 'Moon', symbol: 'M13.625 15.11a8.25 8.25 0 0 1-5.375-7.61V7.5a8.25 8.25 0 1 0 6.671 13.065l-.369-.475-1.074-1.383.147-3.597Z', body: Body.Moon, color: '#C0C0C0', isNode: false },
  { name: 'Mercury', symbol: 'M8.25 3.375a3.375 3.375 0 1 0 0 6.75 3.375 3.375 0 0 0 0-6.75Zm0 7.5a4.125 4.125 0 1 1 0-8.25 4.125 4.125 0 0 1 0 8.25ZM8.25 10.875v4.5M5.25 13.125h6M4.5 4.5a3.75 3.75 0 0 1 7.5 0', body: Body.Mercury, color: '#B87333', isNode: false },
  { name: 'Venus', symbol: 'M8.25 3.375a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25Zm0 9v4.5M5.25 14.625h6', body: Body.Venus, color: '#EEDC82', isNode: false },
  { name: 'Mars', symbol: 'M12 4.5l3-3m0 0h-3m3 0v3M8.25 6.375a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25Zm0 0l4.5-4.5', body: Body.Mars, color: '#FF4500', isNode: false },
  { name: 'Jupiter', symbol: 'M4.5 3.75v3a4.5 4.5 0 0 0 4.5 4.5h3m0-7.5v12m-3-3h6', body: Body.Jupiter, color: '#DAA520', isNode: false },
  { name: 'Saturn', symbol: 'M8.25 3.75v8.25m-3-3h6m-3-8.25a3 3 0 0 1 3 3v4.5a3 3 0 0 0 3 3', body: Body.Saturn, color: '#F4A460', isNode: false },
  { name: 'Uranus', symbol: 'M8.25 2.25v3m0 0v6m0-6h-3m3 0h3M8.25 11.25a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 6v3', body: Body.Uranus, color: '#ADD8E6', isNode: false },
  { name: 'Neptune', symbol: 'M4.5 4.5v3a3.75 3.75 0 0 0 3.75 3.75m3.75-6.75v3a3.75 3.75 0 0 1-3.75 3.75m0-6.75v12m-3-3h6', body: Body.Neptune, color: '#4169E1', isNode: false },
  { name: 'Rahu (North Node)', symbol: 'M4.5 12c0-2 2-5 3.75-5S12 10 12 12s-2 5-3.75 5S4.5 14 4.5 12zm0 0a3.75 3.75 0 0 1 7.5 0M2.25 7.5c1.5-3 3-4.5 6-4.5s4.5 1.5 6 4.5', color: '#B0C4DE', isNode: true, nodeType: 'north' },
  { name: 'Ketu (South Node)', symbol: 'M4.5 4.5c0 2 2 5 3.75 5S12 6.5 12 4.5s-2-5-3.75-5S4.5 2.5 4.5 4.5zm0 0a3.75 3.75 0 0 0 7.5 0M2.25 9c1.5 3 3 4.5 6 4.5s4.5-1.5 6-4.5', color: '#8A9A5B', isNode: true, nodeType: 'south' }
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

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// Calculate the precise Ascendant (Rising Sign) based on location and exact time
const calculateAscendant = (dateObj, lat, lng) => {
  // Julian Date
  const jd = dateObj.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;
  
  // Greenwich Mean Sidereal Time in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - (t * t * t) / 38710000.0;
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;
  
  // Local Sidereal Time in degrees
  let lst = (gmst + lng) % 360;
  if (lst < 0) lst += 360;
  
  // Obliquity of the ecliptic
  const eps = (23.4392911 - 0.0130042 * t) * (Math.PI / 180);
  
  const radLST = lst * (Math.PI / 180);
  const radLat = lat * (Math.PI / 180);
  
  const y = Math.cos(radLST);
  const x = -Math.sin(radLST) * Math.cos(eps) - Math.tan(radLat) * Math.sin(eps);
  
  let ascendantDeg = Math.atan2(y, x) * (180 / Math.PI);
  return (ascendantDeg + 360) % 360;
};

const calculatePositions = (dateStr, timeStr, lat, lng) => {
  if (!dateStr || !timeStr || lat === null || lng === null) return null;

  try {
    const dateObj = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dateObj.getTime())) return null;

    // Use accurate local ascendant calculation 
    const ascendantLon = calculateAscendant(dateObj, parseFloat(lat), parseFloat(lng));
    
    // Calculate mean lunar nodes (Rahu / North Node & Ketu / South Node)
    const T = (dateObj.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525;
    let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
    omega = omega % 360;
    if (omega < 0) omega += 360;
    const ketu = (omega + 180) % 360;

    const positions = PLANETS.map(planet => {
      let rawLon;
      
      if (planet.isNode) {
        rawLon = planet.nodeType === 'north' ? omega : ketu;
      } else {
        const vec = GeoVector(planet.body, dateObj, false);
        const ecl = Ecliptic(vec);
        rawLon = ecl.elon;
      }
      
      let relativeLon = (rawLon - ascendantLon + 360) % 360;
      
      return {
        ...planet,
        lon: relativeLon,
        rawLon: rawLon
      };
    });

    // Symbol Collision Logic (Stelliums)
    const sorted = [...positions].map((p, i) => ({ ...p, originalIndex: i })).sort((a, b) => a.lon - b.lon);
    const collisionDistances = new Array(positions.length).fill(88);
    
    for (let i = 0; i < sorted.length; i++) {
      let overlapCount = 0;
      for (let j = 0; j < i; j++) {
        let diff = Math.abs(sorted[i].lon - sorted[j].lon);
        if (diff > 180) diff = 360 - diff;
        if (diff < 6) overlapCount++;
      }
      collisionDistances[sorted[i].originalIndex] = 88 + (overlapCount * 16);
    }

    return { 
      positions: positions.map((p, i) => ({ ...p, radius: collisionDistances[i] })), 
      ascendantLon 
    };
  } catch (e) {
    console.error("Error calculating astronomy data:", e);
    return null;
  }
};

const AstroChart = ({ className, dateStr, timeStr, lat, lng, isComplete }) => {
  const [animatedPositions, setAnimatedPositions] = useState([]);
  const [showPlanets, setShowPlanets] = useState(false);
  const [showAspects, setShowAspects] = useState(false);

  const astroData = useMemo(() => calculatePositions(dateStr, timeStr, lat, lng), [dateStr, timeStr, lat, lng]);

  useEffect(() => {
    if (!isComplete) {
      setAnimatedPositions([]);
      setShowPlanets(false);
      setShowAspects(false);
      return;
    }

    if (astroData) {
      setTimeout(() => setShowPlanets(true), 500);
      setTimeout(() => setAnimatedPositions(astroData.positions), 600);
      setTimeout(() => setShowAspects(true), 1500);
    }
  }, [isComplete, astroData]);

  const aspects = useMemo(() => {
    if (!showAspects || animatedPositions.length === 0) return [];
    const lines = [];
    const positions = animatedPositions;
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].isNode && positions[j].isNode) continue;

        const diff = Math.abs(positions[i].lon - positions[j].lon);
        const diffMod = Math.min(diff, 360 - diff);
        
        let isAspect = false;
        let opacity = 0;
        let color = "rgba(212, 175, 55, 0.5)"; 
        let strokeWidth = "0.75";
        
        if (Math.abs(diffMod - 120) < 5) { 
          isAspect = true; opacity = 0.5; strokeWidth = "1.5"; 
        } 
        else if (Math.abs(diffMod - 90) < 5) { 
          isAspect = true; opacity = 0.5; color = "rgba(160, 165, 170, 0.5)"; strokeWidth = "1.5"; 
        } 
        else if (Math.abs(diffMod - 180) < 5) { 
          isAspect = true; opacity = 0.6; color = "rgba(160, 165, 170, 0.6)"; strokeWidth = "1.5"; 
        } 
        else if (Math.abs(diffMod - 60) < 5) { 
          isAspect = true; opacity = 0.4; strokeWidth = "0.75"; 
        }

        if (isAspect) {
          const r1 = 75; 
          const a1 = ((positions[i].lon + 180) * Math.PI) / 180;
          const x1 = 200 + r1 * Math.cos(a1);
          const y1 = 200 + r1 * Math.sin(a1);

          const r2 = 75;
          const a2 = ((positions[j].lon + 180) * Math.PI) / 180;
          const x2 = 200 + r2 * Math.cos(a2);
          const y2 = 200 + r2 * Math.sin(a2);

          lines.push(
            <line 
              key={`aspect-${i}-${j}`} 
              x1={x1} y1={y1} x2={x2} y2={y2} 
              stroke={color} 
              strokeWidth={strokeWidth} 
              opacity={opacity} 
              style={{ transition: 'all 1s ease-in-out' }}
            />
          );
        }
      }
    }
    return lines;
  }, [showAspects, animatedPositions]);

  const displayPositions = animatedPositions.length > 0 ? animatedPositions : (
     isComplete ? PLANETS.map((p, i) => ({...p, lon: Math.random() * 360, radius: 95})) : []
  );

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id="depthGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1c23" />
            <stop offset="100%" stopColor="#0b0c10" />
          </radialGradient>
          
          <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <circle cx="200" cy="200" r="190" fill="url(#depthGrad)" />
        <circle cx="200" cy="200" r="190" fill="url(#goldGlow)" style={{ transition: 'opacity 2s', opacity: isComplete ? 1 : 0.2 }} />
        
        <g style={{ transition: 'opacity 1s', opacity: isComplete ? 1 : 0.1 }}>
          <circle cx="200" cy="200" r="180" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.8" />
          <circle cx="200" cy="200" r="176" fill="none" stroke="#d4af37" strokeWidth="0.25" opacity="0.6" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.7" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />
          <circle cx="200" cy="200" r="75" fill="none" stroke="#d4af37" strokeWidth="0.25" opacity="0.4" />
        </g>
        
        <g style={{ transition: 'opacity 1.5s', opacity: isComplete ? 1 : 0 }}>
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 200 + 75 * Math.cos(angle);
            const y1 = 200 + 75 * Math.sin(angle);
            const x2 = 200 + 180 * Math.cos(angle);
            const y2 = 200 + 180 * Math.sin(angle);
            
            const numAngle = ((i * 30 + 15) * Math.PI) / 180;
            const numX = 200 + 65 * Math.cos(numAngle);
            const numY = 200 + 65 * Math.sin(numAngle);

            return (
              <g key={`house-${i}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4af37" strokeWidth="0.25" opacity="0.6" />
                <text x={numX} y={numY} fill="#d4af37" fontSize="8" fontFamily="'Cinzel', serif" textAnchor="middle" dominantBaseline="middle" opacity="0.5">
                  {ROMAN_NUMERALS[(i + 6) % 12]}
                </text>
              </g>
            );
          })}
        </g>
        
        <g style={{ transition: 'opacity 2s', opacity: isComplete ? 1 : 0 }}>
          {ZODIAC_SYMBOLS.map((pathStr, i) => {
            const ascendantOffset = astroData ? astroData.ascendantLon : 0;
            const visualAngle = (i * 30 + 15 - ascendantOffset + 180) % 360; 
            const angle = (visualAngle * Math.PI) / 180;
            const x = 200 + 163 * Math.cos(angle);
            const y = 200 + 163 * Math.sin(angle);
            return (
              <g key={`sym-${i}`} transform={`translate(${x-8}, ${y-8})`} opacity="0.8">
                 <path d={pathStr} fill="none" stroke="#d4af37" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
        </g>

        <g style={{ transition: 'opacity 1s', opacity: isComplete ? 1 : 0 }}>
          {[...Array(72)].map((_, i) => {
            const angle = (i * 5 * Math.PI) / 180;
            const x = 200 + 178 * Math.cos(angle);
            const y = 200 + 178 * Math.sin(angle);
            const isMajor = i % 6 === 0;
            return (
              <circle key={`dot-${i}`} cx={x} cy={y} r={isMajor ? "1.5" : "0.75"} fill="#d4af37" opacity={isMajor ? "0.9" : "0.5"} />
            );
          })}
        </g>

        {aspects}
        
        <g style={{ transition: 'opacity 0.5s', opacity: isComplete ? 1 : 0 }}>
          <circle cx="200" cy="200" r="2" fill="#d4af37" opacity="0.8" />
          <line x1="195" y1="200" x2="205" y2="200" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />
          <line x1="200" y1="195" x2="200" y2="205" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />
        </g>

        <g style={{ transition: 'opacity 1s', opacity: showPlanets ? 1 : 0 }}>
          {displayPositions.map((planet, i) => {
            const angle = ((planet.lon + 180) * Math.PI) / 180;
            const dist = planet.radius;
            const x = 200 + dist * Math.cos(angle);
            const y = 200 + dist * Math.sin(angle);
            
            return (
              <g 
                key={`planet-${i}`} 
                transform={`translate(${x-8}, ${y-8})`} 
                style={{ transition: 'all 2s ease-out' }}
              >
                <line x1={8 - x + 200} y1={8 - y + 200} x2={8 - (200 + 75 * Math.cos(angle)) + x} y2={8 - (200 + 75 * Math.sin(angle)) + y} stroke={planet.color} strokeWidth="0.25" opacity="0.2" />
                
                <circle cx="8" cy="8" r="9" fill="#111218" opacity="0.9" />
                
                <path 
                  d={planet.symbol} 
                  fill="none" 
                  stroke={planet.color} 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  filter="url(#iconGlow)"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default AstroChart;