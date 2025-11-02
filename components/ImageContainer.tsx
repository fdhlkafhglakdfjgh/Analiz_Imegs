import React from 'react';
import { SpinnerIcon, UploadIcon } from './icons';

interface ImageContainerProps {
  imageSrc: string | null;
  title: string;
  isLoading?: boolean;
  isUploader?: boolean;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageSrc, title, isLoading = false, isUploader = false, onFileChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (isUploader && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-semibold text-gray-300">{title}</h2>
      <div 
        className={`relative aspect-square w-full max-w-lg rounded-xl overflow-hidden bg-gray-800/50 border-2 border-dashed border-gray-600 flex items-center justify-center group ${isUploader ? 'cursor-pointer hover:border-blue-500 transition-colors' : ''}`}
        onClick={handleContainerClick}
      >
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="object-contain w-full h-full" />
        ) : (
          !isLoading && (
            <div className="text-gray-500 flex flex-col items-center p-4">
              {isUploader && <UploadIcon className="w-12 h-12" />}
              <span className="mt-2 text-center">
                {isUploader ? 'Click to upload image' : 'Edited image will appear here'}
              </span>
            </div>
          )
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-4">
            <SpinnerIcon className="w-16 h-16 animate-spin" />
            <p className="mt-4 text-lg text-center">{isUploader ? 'Loading initial image...' : 'Generating your edit...'}</p>
          </div>
        )}

        {isUploader && imageSrc && (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white flex flex-col items-center">
                <UploadIcon className="w-12 h-12" />
                <span className="mt-2 font-semibold">Change Image</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
};

export { ImageContainer };
