// src/components/AdBanner.jsx
import { useEffect, useRef } from 'react';

const AdBanner = ({ adKey, width, height, className }) => {
  const containerRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Don't load if already loaded or no container
    if (isLoaded.current || !containerRef.current) return;
    
    isLoaded.current = true;
    
    // Set the ad configuration globally
    window.atOptions = {
      key: adKey,
      format: 'iframe',
      height: height,
      width: width,
      params: {}
    };
    
    // Create and append the script
    const script = document.createElement('script');
    script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    containerRef.current.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      isLoaded.current = false;
    };
  }, [adKey, width, height]);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        minWidth: width, 
        minHeight: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px auto',
        overflow: 'hidden'
      }}
    />
  );
};

export default AdBanner;
