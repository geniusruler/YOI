import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Check, Sparkles, Camera, User, X, Type, Wand2 } from 'lucide-react';
import { AvatarDescriptionExamples } from '../AvatarDescriptionExamples';

interface AvatarCreationPageProps {
  signupData: {
    email: string;
    password: string;
    name: string;
  };
}

export function AvatarCreationPage({ signupData }: AvatarCreationPageProps) {
  const { signUp, updateAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarCreated, setAvatarCreated] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [creationMode, setCreationMode] = useState<'select' | 'photo' | 'text' | 'default'>('select');
  const [textDescription, setTextDescription] = useState('');
  const [generationStatus, setGenerationStatus] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup webcam stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startWebcam = async () => {
    try {
      setCreationMode('photo');
      setCapturing(true);
      setError('');
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setCapturing(false);
      
      // Handle specific error types (errors are expected when user denies permission)
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings, or use a default avatar instead.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. You can continue with a default avatar.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application. You can continue with a default avatar.');
      } else {
        setError('Unable to access camera. You can continue with a default avatar.');
      }
      
      // Don't log permission denials as errors since they're expected user behavior
      if (err.name !== 'NotAllowedError') {
        console.error('Webcam error:', err);
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      setPhotoTaken(true);
      
      // Stop the webcam stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setCapturing(false);
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    startWebcam();
  };

  const generateAvatar = async () => {
    if (!canvasRef.current) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create image blob'));
        }, 'image/jpeg', 0.95);
      });

      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'avatar.jpg');

      // Call Avatarun API (using our server as proxy to keep API key secure)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d4db93d1/generate-avatar`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate avatar');
      }

      const data = await response.json();
      setCurrentAvatarUrl(data.avatarUrl);
      setAvatarCreated(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate 3D avatar');
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Sign up the user
      await signUp(signupData.email, signupData.password, signupData.name);

      // Update avatar if one was created
      if (currentAvatarUrl) {
        await updateAvatar(currentAvatarUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete signup');
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setError('');

    try {
      await signUp(signupData.email, signupData.password, signupData.name);
      // User will get a default avatar assigned
    } catch (err: any) {
      setError(err.message || 'Failed to complete signup');
      setLoading(false);
    }
  };

  const useDefaultAvatar = async () => {
    setLoading(true);
    setError('');
    setCreationMode('default');

    try {
      // Create a default avatar URL
      const defaultAvatarUrl = `default-avatar-${Date.now()}`;
      setCurrentAvatarUrl(defaultAvatarUrl);
      setAvatarCreated(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create default avatar');
      setLoading(false);
    }
  };

  const generateAvatarFromText = async () => {
    if (!textDescription.trim()) {
      setError('Please enter a description for your avatar');
      return;
    }

    setLoading(true);
    setError('');
    setGenerationStatus('Enhancing your description with AI...');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d4db93d1/generate-avatar-from-text`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description: textDescription }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate avatar');
      }

      setGenerationStatus('Creating your 3D avatar...');
      
      const data = await response.json();
      setCurrentAvatarUrl(data.avatarUrl);
      setAvatarCreated(true);
      setGenerationStatus('');
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate 3D avatar from text');
      setGenerationStatus('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-slate-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
              <Sparkles className="text-orange-400" size={32} />
            </div>
            <h1 className="text-white mb-2">Create Your 3D Avatar</h1>
            <p className="text-white/60">Take a photo to generate your personalized 3D avatar for the virtual campus</p>
          </div>

          {error && (
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-orange-300 text-sm">{error}</p>
                  {error.includes('permission') && (
                    <p className="text-orange-400/70 text-xs mt-2">
                      Tip: Click the camera icon in your browser's address bar to allow access
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                  aria-label="Dismiss error"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg relative overflow-hidden">
              {creationMode === 'select' && !avatarCreated && (
                <div className="text-center px-6 w-full max-w-md">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-orange-400" size={40} />
                  </div>
                  <p className="text-white mb-2">Create your 3D avatar</p>
                  <p className="text-white/60 text-sm mb-6">
                    Choose how you'd like to create your personalized avatar
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={startWebcam}
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-3 group"
                    >
                      <Camera className="group-hover:scale-110 transition-transform" size={24} />
                      <div className="text-left">
                        <div className="font-medium">Create from Photo</div>
                        <div className="text-xs text-orange-200">Use your webcam for realistic avatar</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setCreationMode('text')}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-600/50 disabled:to-blue-600/50 text-white px-6 py-4 rounded-lg transition-all flex items-center justify-center gap-3 group"
                    >
                      <Wand2 className="group-hover:scale-110 transition-transform" size={24} />
                      <div className="text-left">
                        <div className="font-medium flex items-center gap-2">
                          AI-Powered Text-to-3D
                          <Sparkles size={16} className="text-yellow-300" />
                        </div>
                        <div className="text-xs text-purple-200">Describe your avatar, AI creates it</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={useDefaultAvatar}
                      disabled={loading}
                      className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-3 group"
                    >
                      <User className="group-hover:scale-110 transition-transform" size={24} />
                      <div className="text-left">
                        <div className="font-medium">Use Default Avatar</div>
                        <div className="text-xs text-white/60">Quick start with generic model</div>
                      </div>
                    </button>
                  </div>
                  <p className="text-white/40 text-xs mt-4">
                    💡 You can customize your avatar anytime in profile settings
                  </p>
                </div>
              )}

              {creationMode === 'text' && !avatarCreated && (
                <div className="text-center px-6 w-full max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="text-purple-400" size={40} />
                  </div>
                  <p className="text-white mb-2">Describe Your Avatar</p>
                  <p className="text-white/60 text-sm mb-6">
                    Our AI will enhance your description and generate a unique 3D model
                  </p>
                  
                  <div className="space-y-4">
                    <textarea
                      value={textDescription}
                      onChange={(e) => setTextDescription(e.target.value)}
                      placeholder="Example: A friendly college student with curly brown hair, wearing a Princeton hoodie and jeans, with a confident smile..."
                      className="w-full h-32 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      disabled={loading}
                    />
                    
                    {generationStatus && (
                      <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
                          <p className="text-purple-300 text-sm">{generationStatus}</p>
                        </div>
                      </div>
                    )}
                    
                    <AvatarDescriptionExamples 
                      onSelectExample={(desc) => setTextDescription(desc)}
                    />
                    
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setCreationMode('select');
                          setTextDescription('');
                          setError('');
                        }}
                        disabled={loading}
                        className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={generateAvatarFromText}
                        disabled={loading || !textDescription.trim()}
                        className="flex-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-purple-600/50 disabled:to-blue-600/50 text-white px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} />
                            Generate Avatar
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="text-white/40 text-xs">
                      ⚡ Generation takes 2-5 minutes using AI and 3D rendering
                    </p>
                  </div>
                </div>
              )}

              {creationMode === 'photo' && capturing && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="max-w-full max-h-[350px] rounded-lg"
                  />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors shadow-lg"
                  >
                    <Camera className="inline mr-2" size={20} />
                    Capture Photo
                  </button>
                </div>
              )}

              {creationMode === 'photo' && photoTaken && !avatarCreated && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[350px] rounded-lg"
                  />
                  <div className="absolute bottom-4 flex gap-3">
                    <button
                      onClick={retakePhoto}
                      disabled={loading}
                      className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Retake
                    </button>
                    <button
                      onClick={generateAvatar}
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline mr-2"></div>
                          Generating Avatar...
                        </>
                      ) : (
                        'Generate 3D Avatar'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {avatarCreated && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-400" size={40} />
                  </div>
                  <p className="text-white mb-2">Avatar created successfully!</p>
                  <p className="text-white/60 text-sm">
                    Your 3D avatar is ready to explore Princeton
                  </p>
                </div>
              )}
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="text-center text-white/60 text-sm mb-6">
            <p>Your avatar will be visible to other students in the virtual campus and can be customized later.</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white py-3 rounded-lg transition-colors"
            >
              Continue without avatar
            </button>
            
            <button
              onClick={handleComplete}
              disabled={loading || !avatarCreated}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Complete & Enter Campus</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
