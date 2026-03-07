import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const CameraCapture = ({ onCapture, onCancel }) => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(false);
    setCameraReady(false);
    setErrorMsg('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(true);
      setErrorMsg(t('photo.noBrowserSupport'));
      return;
    }

    // Check if any video input devices exist
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      if (videoDevices.length === 0) {
        setCameraError(true);
        setErrorMsg(t('photo.noCameraFound'));
        return;
      }
    } catch (e) {
      // enumerateDevices not supported, continue anyway
    }

    // Try multiple constraint sets from specific to lenient
    const constraintOptions = [
      { video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } },
      { video: { facingMode: 'user' } },
      { video: true }
    ];

    let lastError = null;
    for (const constraints of constraintOptions) {
      try {
        stopStream(); // stop any previous stream before retrying
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
          return;
        }
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    // All attempts failed — show the real error
    setCameraError(true);
    if (lastError) {
      const name = lastError.name;
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setErrorMsg(t('photo.permissionDenied'));
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setErrorMsg(t('photo.noDeviceFound'));
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setErrorMsg(t('photo.cameraInUse'));
      } else if (name === 'OverconstrainedError') {
        setErrorMsg(t('photo.overconstrained'));
      } else {
        setErrorMsg(t('photo.genericError', { error: lastError.message || name }));
      }
    } else {
      setErrorMsg(t('photo.notAvailable'));
    }
  }, [stopStream, t]);

  useEffect(() => {
    startCamera();
    return () => stopStream();
  }, [startCamera, stopStream]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL('image/png');
    setPreviewImg(imageSrc);
    stopStream();
  };

  const confirmCapture = () => {
    if (previewImg) {
      onCapture(previewImg);
    }
  };

  const retake = () => {
    setPreviewImg(null);
    startCamera();
  };

  // Fallback: let user upload a photo if camera is unavailable
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onCapture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-white">{t('photo.captureTitle')}</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('photo.captureDesc')}</p>
      </div>

      {cameraError ? (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">
            {errorMsg}
          </div>
          <button onClick={startCamera} className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-colors">
            {t('photo.retryCamera')}
          </button>
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('photo.orUpload')}</label>
            <input type="file" accept="image/*" capture="user" onChange={handleFileUpload}
              className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-500/10 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100" />
          </div>
        </div>
      ) : previewImg ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={previewImg} alt="Preview" className="max-w-sm w-full rounded-xl border-2 border-surface-200 dark:border-surface-700" />
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={confirmCapture} className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-colors">
              {t('photo.confirmPhoto')}
            </button>
            <button onClick={retake} className="px-6 py-2.5 rounded-xl bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors">
              {t('photo.retake')}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: 400, maxWidth: '100%' }}
              className="rounded-xl border-2 border-surface-200 dark:border-surface-700 bg-black"
            />
          </div>
          {!cameraReady && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-sm text-surface-500">{t('photo.waitingCamera')}</p>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={capture} disabled={!cameraReady} className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-colors">
              {t('photo.captureBtn')}
            </button>
            <button onClick={onCancel} className="px-6 py-2.5 rounded-xl bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors">
              {t('photo.cancel')}
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
