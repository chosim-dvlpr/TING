import React, { useRef, useEffect } from 'react';

const OpenViduVideoComponent = (props) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (props && videoRef.current) {
      props.streamManager.addVideoElement(videoRef.current);
    }
  }, [props]);

  return <video autoPlay={true} ref={videoRef} />;
};

export default OpenViduVideoComponent;
