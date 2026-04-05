import React, { useState, useRef, useEffect, useMemo } from 'react';
import './App.css';
import AstroChart from './AstroChart';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthYear: '',
    birthMonth: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    astrologySystem: 'Western'
  });

  const [geoData, setGeoData] = useState({ lat: null, lng: null });
  const [isComplete, setIsComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const cardRef = useRef(null);

  useEffect(() => {
    const loc = formData.birthLocation.toLowerCase();
    if (loc.includes('sri lanka') || loc.includes('colombo') || loc.includes('kandy') || loc.includes('galle')) {
      setFormData(prev => ({ ...prev, astrologySystem: 'Sri Lankan Jyotishya' }));
    } else if (loc.trim() !== '') {
      setFormData(prev => ({ ...prev, astrologySystem: 'Western' }));
    }
  }, [formData.birthLocation]);

  useEffect(() => {
    const isReady = !!(formData.birthYear && formData.birthMonth && formData.birthDate && formData.birthTime);
    
    if (isReady && !isComplete) {
      setGeoData({ lat: 40.7128, lng: -74.0060 }); 
      setIsComplete(true);
    } else if (!isReady && isComplete) {
      setIsComplete(false);
    }
  }, [formData, isComplete]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, 
        backgroundColor: '#0b0c10',
        useCORS: true,
        logging: false
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement('a');
      link.download = `${formData.firstName || 'astro'}_chart.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);
  const months = [
    { name: 'January', val: '01' }, { name: 'February', val: '02' }, { name: 'March', val: '03' }, 
    { name: 'April', val: '04' }, { name: 'May', val: '05' }, { name: 'June', val: '06' },
    { name: 'July', val: '07' }, { name: 'August', val: '08' }, { name: 'September', val: '09' }, 
    { name: 'October', val: '10' }, { name: 'November', val: '11' }, { name: 'December', val: '12' }
  ];
  const dates = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const dateStr = useMemo(() => {
    if (formData.birthYear && formData.birthMonth && formData.birthDate) {
      const monthObj = months.find(m => m.name === formData.birthMonth);
      const m = monthObj ? monthObj.val : '01';
      return `${formData.birthYear}-${m}-${formData.birthDate}`;
    }
    return null;
  }, [formData.birthYear, formData.birthMonth, formData.birthDate, months]);

  return (
    <div className="app-container">
      <div className="form-section">
        <h1>Astrological Birth Chart</h1>
        
        <div className="form-group">
          <label>First Name</label>
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleInputChange} 
            placeholder="Enter first name"
          />
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleInputChange} 
            placeholder="Enter last name"
          />
        </div>

        <div className="input-row">
          <div className="form-group">
            <label>Year</label>
            <select name="birthYear" value={formData.birthYear} onChange={handleInputChange}>
              <option value="">Year</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label>Month</label>
            <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange}>
              <option value="">Month</option>
              {months.map(month => <option key={month.name} value={month.name}>{month.name}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date</label>
            <select name="birthDate" value={formData.birthDate} onChange={handleInputChange}>
              <option value="">Date</option>
              {dates.map(date => <option key={date} value={date}>{date}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Birth Time</label>
          <input 
            type="time" 
            name="birthTime" 
            value={formData.birthTime} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="form-group">
          <label>Birth Location</label>
          <input 
            type="text" 
            name="birthLocation" 
            value={formData.birthLocation} 
            onChange={handleInputChange} 
            placeholder="City, Country"
          />
        </div>

        <div className="form-group">
          <label>Astrology System</label>
          <select name="astrologySystem" value={formData.astrologySystem} onChange={handleInputChange}>
            <option value="Western">Western Astrology</option>
            <option value="Sri Lankan Jyotishya">Sri Lankan Jyotishya</option>
            <option value="Vedic">Vedic Astrology</option>
          </select>
          <span className="help-text">
            Auto-selected based on location.
          </span>
        </div>

        <button 
          className="generate-btn" 
          onClick={handleDownload}
          disabled={!isComplete || isGenerating}
        >
          {isGenerating ? 'GENERATING...' : 'GENERATE & DOWNLOAD'}
        </button>
      </div>

      <div className="preview-section">
        <div className="poster-wrapper">
          <div className="poster-container" ref={cardRef}>
            <div className="poster-border">
              {/* Technical Blueprint Corners */}
              <div className="border-vertical-accents"></div>
              <div className="corner-crosshairs"></div>
              <div className="corner-crosshairs-bottom"></div>
              
              <div className={`poster-header ${isComplete ? 'visible' : ''}`}>
                <div className="poster-title">The Stars Above</div>
                <div className="poster-subtitle">At the moment of your birth</div>
              </div>
              
              <div className="poster-chart">
                <div className="astro-chart-wrapper">
                  <AstroChart 
                    dateStr={dateStr}
                    timeStr={formData.birthTime}
                    lat={geoData.lat}
                    lng={geoData.lng}
                    isComplete={isComplete} 
                  />
                </div>
              </div>

              <div className={`poster-details ${isComplete ? 'visible' : ''}`}>
                <div className="poster-name">
                  {formData.firstName || formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}` 
                    : 'YOUR NAME'}
                </div>
                <div className="poster-info">
                  {formData.birthMonth || formData.birthDate || formData.birthYear
                    ? `${formData.birthMonth} ${formData.birthDate}, ${formData.birthYear}`
                    : 'JANUARY 1, 1990'}
                  {formData.birthTime && ` • ${formData.birthTime}`}
                  <br/>
                  {formData.birthLocation ? formData.birthLocation.toUpperCase() : 'LOCATION UNKNOWN'}
                  <br/>
                  SYSTEM: {formData.astrologySystem.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;