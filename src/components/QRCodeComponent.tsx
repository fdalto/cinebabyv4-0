
import React from 'react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
}

const QRCodeComponent = ({ value, size = 200 }: QRCodeComponentProps) => {
  // Usando um serviço gratuito de geração de QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return (
    <div className="flex flex-col items-center">
      <img 
        src={qrCodeUrl} 
        alt="QR Code" 
        width={size} 
        height={size}
        className="border rounded-lg"
      />
    </div>
  );
};

export default QRCodeComponent;
