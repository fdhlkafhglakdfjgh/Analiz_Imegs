import React, { useState, useEffect } from 'react';
import { ImageContainer } from './components/ImageContainer';
import { PromptForm } from './components/PromptForm';
import { editImage } from './services/geminiService';
import { fileToBase64, parseDataUrl } from './utils/fileUtils';

const DEFAULT_IMAGE_URL = 'https://picsum.photos/id/1018/1024/1024';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefaultImage = async () => {
      try {
        const response = await fetch(DEFAULT_IMAGE_URL);
        if (!response.ok) throw new Error('Failed to fetch default image');
        const blob = await response.blob();
        const dataUrl = await fileToBase64(new File([blob], "default.jpg", { type: blob.type }));
        setOriginalImage(dataUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred fetching the default image.';
        setError(message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchDefaultImage();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setError(null);
        setEditedImage(null);
        const dataUrl = await fileToBase64(file);
        setOriginalImage(dataUrl);
      } catch (err) {
        setError('Failed to read the uploaded image.');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalImage || !prompt.trim() || isLoading) {
      return;
    }

    const parsedData = parseDataUrl(originalImage);
    if (!parsedData) {
      setError("Invalid image format. Could not parse image data.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImage({
        base64Image: parsedData.base64Data,
        mimeType: parsedData.mimeType,
        prompt: prompt,
      });
      setEditedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Gemini Image Editor
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Describe your edit. Let AI bring your vision to life.
        </p>
      </header>
      
      <main className="w-full max-w-7xl flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageContainer
            title="Original Image"
            imageSrc={originalImage}
            isUploader={true}
            onFileChange={handleFileChange}
            isLoading={!originalImage && isLoading}
          />
          <ImageContainer
            title="Edited Image"
            imageSrc={editedImage}
            isLoading={isLoading && !!originalImage && !editedImage}
          />
        </div>

        <div className="w-full max-w-3xl mt-6">
            <PromptForm 
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                disabled={!originalImage}
            />
            {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-center">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500">
          <p>Powered by Google Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
};

export default App;
