import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

const Scanner = () => {
  const [qrData, setQrData] = useState({
    delay: 500,
    result: 'No result',
  });

  const handleScan = (data) => {
    setQrData({
      ...qrData,
      result: data,
    });
  };
  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      <QrReader
        delay={qrData.delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{qrData.result}</p>

      <h1>My Scanner</h1>
    </div>
  );
};

export default Scanner;
