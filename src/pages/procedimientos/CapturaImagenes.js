import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Paper, Box, Typography, Divider, Grid, Button, ImageList, ImageListItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PhotoCamera, FiberManualRecord, Stop, Delete as DeleteIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { List } from 'react-window';

// Componente de header de sección, siguiendo patrón existente
const SectionHeader = ({ title }) => (
  <Box
    sx={{
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      padding: '12px 20px',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <Typography variant="h6" fontWeight="bold">{title}</Typography>
  </Box>
);

const useQuery = () => new URLSearchParams(useLocation().search);

const CapturaImagenes = () => {
  const query = useQuery();
  const paciente = query.get('paciente') || '';
  const procedimiento = query.get('procedimiento') || '';
  const codigo = query.get('codigo') || '';
  const centro = query.get('centro') || '';
  const sala = query.get('sala') || '';
  const gastro = query.get('gastro') || '';
  const fechaEstudio = query.get('fechaEstudio') || '';
  const edadPaciente = query.get('edadPaciente') || '';
  const theme = useTheme();

  // Ruta base de almacenamiento (configurable por .env)
  const storageBasePath = process.env.REACT_APP_ALMACENAMIENTO_URL || 'D\\\\GastroProcedures\\Capturas';
  const [storageFolderPath, setStorageFolderPath] = useState('');
  const [storageFolderName, setStorageFolderName] = useState('');
  // File System Access API
  const [baseDirHandle, setBaseDirHandle] = useState(null);
  const [studyDirHandle, setStudyDirHandle] = useState(null);
  const isFSAccessSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  // Estado de permiso de guardado
  const [canSaveLocally, setCanSaveLocally] = useState(false);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  // Persistencia de carpeta base (IndexedDB)
  const openIDB = () => new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open('ig-fs', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('handles')) {
          db.createObjectStore('handles');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) { reject(e); }
  });
  const idbGet = async (key) => {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction('handles', 'readonly');
        const store = tx.objectStore('handles');
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      } catch (e) { reject(e); }
    });
  };
  const idbSet = async (key, value) => {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction('handles', 'readwrite');
        const store = tx.objectStore('handles');
        const req = store.put(value, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      } catch (e) { reject(e); }
    });
  };
  const idbDel = async (key) => {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction('handles', 'readwrite');
        const store = tx.objectStore('handles');
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      } catch (e) { reject(e); }
    });
  };
  const [savedHandleAvailable, setSavedHandleAvailable] = useState(false);
  useEffect(() => {
    if (!isFSAccessSupported) return;
    (async () => {
      try {
        const h = await idbGet('baseDir');
        setSavedHandleAvailable(!!h);
        if (h) {
          const perm = await h.queryPermission({ mode: 'readwrite' });
          if (perm === 'granted') {
            setBaseDirHandle(h);
            const dir = await h.getDirectoryHandle(storageFolderName, { create: true });
            setStudyDirHandle(dir);
          }
        }
      } catch (e) {
        console.warn('No se pudo restaurar carpeta guardada:', e);
      }
    })();
  }, [isFSAccessSupported, storageFolderName]);
  // Actualizar estado de permiso y abrir diálogo si falta
  useEffect(() => {
    if (!isFSAccessSupported) { setCanSaveLocally(false); setPermDialogOpen(false); return; }
    (async () => {
      try {
        const h = baseDirHandle || await idbGet('baseDir');
        const perm = h ? await h.queryPermission({ mode: 'readwrite' }) : 'denied';
        const granted = perm === 'granted';
        setCanSaveLocally(granted);
        setPermDialogOpen(!granted);
      } catch {
        setCanSaveLocally(false);
        setPermDialogOpen(true);
      }
    })();
  }, [isFSAccessSupported, baseDirHandle]);
  const useSavedBaseDir = async () => {
    try {
      const h = await idbGet('baseDir');
      if (!h) {
        alert('No hay carpeta recordada');
        return;
      }
      let perm = await h.queryPermission({ mode: 'readwrite' });
      if (perm !== 'granted') {
        perm = await h.requestPermission({ mode: 'readwrite' });
      }
      if (perm === 'granted') {
        setBaseDirHandle(h);
        const dir = await h.getDirectoryHandle(storageFolderName, { create: true });
        setStudyDirHandle(dir);
        setSavedHandleAvailable(true);
        setCanSaveLocally(true);
        setPermDialogOpen(false);
      } else {
        alert('Permiso denegado para la carpeta recordada');
      }
    } catch (e) {
      console.warn('No se pudo usar la carpeta recordada:', e);
    }
  };
  const forgetSavedBaseDir = async () => {
    try {
      await idbDel('baseDir');
      setSavedHandleAvailable(false);
      setBaseDirHandle(null);
      setStudyDirHandle(null);
      setCanSaveLocally(false);
      setPermDialogOpen(true);
    } catch (e) {
      console.warn('No se pudo olvidar carpeta:', e);
    }
  };

  // Utilidades para componer nombre de carpeta
  const sanitizeSegment = (s) => (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-zA-Z0-9-_\s]/g, '') // caracteres inválidos
    .trim()
    .replace(/\s+/g, '_');

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const ensureStorageFolder = async (fullPath) => {
    // Uso local: la carpeta se maneja vía File System Access en tiempo de guardado
    return true;
  };

  // Al montar, componer y crear/verificar carpeta paciente+estudio+fecha
  useEffect(() => {
    const studyDate = fechaEstudio ? new Date(fechaEstudio) : new Date();
    const folderName = `${sanitizeSegment(paciente)}_${formatDate(studyDate)}_${sanitizeSegment(codigo)}`;
    const fullPath = `${storageBasePath}\\${folderName}`;
    setStorageFolderName(folderName);
    setStorageFolderPath(fullPath);
    ensureStorageFolder(fullPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toRgba = (hex, alpha = 0.85) => {
    try {
      const clean = (hex || '#2184be').replace('#', '');
      const bigint = parseInt(clean, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return `rgba(33, 132, 190, ${alpha})`;
    }
  };

  // Helpers para nombres y conversión
  const getImageFileName = () => {
    const stamp = Date.now();
    return `IMG_${sanitizeSegment(codigo)}_${stamp}.jpg`;
  };
  const getVideoExt = (mt) => (mt && mt.includes('mp4')) ? 'mp4' : 'webm';
  const getVideoFileName = (mt) => {
    const stamp = Date.now();
    return `VID_${sanitizeSegment(codigo)}_${stamp}.${getVideoExt(mt)}`;
  };
  const dataUrlToBase64 = (dataUrl) => {
    try { return (dataUrl || '').split(',')[1] || ''; } catch { return ''; }
  };
  const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result || '').toString().split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    } catch (e) {
      reject(e);
    }
  });
  const deleteFileFromStorage = async (fullPathOrName) => {
    try {
      if (!studyDirHandle) return;
      const name = (fullPathOrName || '').split('\\').pop();
      if (!name) return;
      await studyDirHandle.removeEntry(name);
    } catch (err) {
      console.warn('No se pudo borrar archivo local:', err);
    }
  };

  const [capturedImages, setCapturedImages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // cámara: referencia y estado
  const videoRef = useRef(null);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const viewerRef = useRef(null);
  const [viewerHeight, setViewerHeight] = useState(0);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  useEffect(() => {
    const update = () => {
      if (viewerRef.current) setViewerHeight(viewerRef.current.clientHeight || 0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Handlers de preview y guardado de imágenes
  const handleOpenPreview = (img) => {
    setSelectedImage(img);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedImage(null);
  };

  const handleDescargar = (item) => {
    try {
      if (item?.kind === 'video') {
        const a = document.createElement('a');
        a.href = item.videoSrc;
        a.download = `captura-${item.id}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      const a = document.createElement('a');
      a.href = item.fullSrc || item.src;
      a.download = `captura-${item.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {}
  };

  // Conversión a Blob para guardado local
  const dataUrlToBlob = (dataUrl) => {
    try {
      const arr = (dataUrl || '').split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1] || '');
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new Blob([u8arr], { type: mime });
    } catch {
      return new Blob([], { type: 'application/octet-stream' });
    }
  };
  
  // Seleccionar carpeta base para guardado local
  const pickBaseDir = async () => {
    if (!isFSAccessSupported) {
      alert('Este navegador no soporta guardado local automático.');
      return;
    }
    try {
      const base = await window.showDirectoryPicker();
      setBaseDirHandle(base);
      await idbSet('baseDir', base);
      setSavedHandleAvailable(true);
      const dir = await base.getDirectoryHandle(storageFolderName, { create: true });
      setStudyDirHandle(dir);
      setCanSaveLocally(true);
      setPermDialogOpen(false);
    } catch (e) {
      console.warn('Selección de carpeta base cancelada o fallida:', e);
    }
  };
  
  // Asegurar carpeta del estudio dentro de la base
  const ensureLocalDirReady = async () => {
    if (!isFSAccessSupported) return false;
    try {
      let base = baseDirHandle;
      if (!base) {
        // Intentar restaurar carpeta recordada de IndexedDB
        const h = await idbGet('baseDir');
        if (h) {
          let perm = await h.queryPermission({ mode: 'readwrite' });
          if (perm !== 'granted') {
            perm = await h.requestPermission({ mode: 'readwrite' });
          }
          if (perm === 'granted') {
            base = h;
            setBaseDirHandle(h);
            setSavedHandleAvailable(true);
            setCanSaveLocally(true);
          }
        }
      }
      if (!base) {
        // Solicitar una única vez permiso de carpeta: elige D:\\GastroProcedures\\Capturas
        alert('Seleccione D:\\\GastroProcedures\\\Capturas para guardar automáticamente las capturas');
        try {
          base = await window.showDirectoryPicker();
          setBaseDirHandle(base);
          await idbSet('baseDir', base);
          setSavedHandleAvailable(true);
        } catch (e) {
          console.warn('Selección de carpeta cancelada o fallida:', e);
          return false;
        }
      }
      const dir = studyDirHandle || await base.getDirectoryHandle(storageFolderName, { create: true });
      setStudyDirHandle(dir);
      return true;
    } catch (e) {
      console.warn('No se pudo asegurar carpeta del estudio:', e);
      return false;
    }
  };

  const handleGuardarImagen = async (img) => {
    try {
      const fileName = img.fileName || getImageFileName();
      if (await ensureLocalDirReady()) {
        const blob = dataUrlToBlob(img.fullSrc || img.src || '');
        const fh = await studyDirHandle.getFileHandle(fileName, { create: true });
        const writable = await fh.createWritable();
        await writable.write(blob);
        await writable.close();
        const storedPath = `${storageFolderPath}\\${fileName}`;
        setCapturedImages((prev) => prev.map((i) => i.id === img.id ? { ...i, saved: true, fileName, storedPath } : i));
      } else {
        // Fallback: descarga automática si no hay permisos
        const a = document.createElement('a');
        a.href = img.fullSrc || img.src;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setCapturedImages((prev) => prev.map((i) => i.id === img.id ? { ...i, saved: true, fileName } : i));
      }
    } catch (err) {
      console.error('Error al guardar imagen local:', err);
    }
  };

  // Guardado local de video (sin API)
  const handleGuardarVideo = async (item) => {
    try {
      const fileName = item.fileName || getVideoFileName(item.mimeType);
      if (await ensureLocalDirReady()) {
        const fh = await studyDirHandle.getFileHandle(fileName, { create: true });
        const writable = await fh.createWritable();
        await writable.write(item.videoBlob);
        await writable.close();
        const storedPath = `${storageFolderPath}\\${fileName}`;
        setCapturedImages((prev) => prev.map((i) => i.id === item.id ? { ...i, saved: true, fileName, storedPath } : i));
      } else {
        const url = item.videoSrc || URL.createObjectURL(item.videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setCapturedImages((prev) => prev.map((i) => i.id === item.id ? { ...i, saved: true, fileName } : i));
      }
    } catch (err) {
      console.error('Error al guardar video local:', err);
    }
  };

  const handleGuardarTodas = async () => {
    for (const img of capturedImages.filter((i) => i.kind !== 'video' && !i.saved)) {
      await handleGuardarImagen(img);
    }
  };
  const handleEliminarImagen = async (id) => {
    const item = capturedImages.find((i) => i.id === id);
    try {
      const fullPath = item?.storedPath || (item?.fileName && storageFolderPath ? `${storageFolderPath}\\${item.fileName}` : null);
      if (fullPath) await deleteFileFromStorage(fullPath);
      setCapturedImages((prev) => prev.filter((i) => i.id !== id));
    } catch {}
  };

  const handleBorrarTodas = async () => {
    if (capturedImages.length === 0) return;
    try {
      for (const item of capturedImages) {
        const fullPath = item?.storedPath || (item?.fileName && storageFolderPath ? `${storageFolderPath}\\${item.fileName}` : null);
        if (fullPath) {
          try { await deleteFileFromStorage(fullPath); } catch {}
        }
        if (item?.kind === 'video' && item.videoSrc?.startsWith('blob:')) {
          try { URL.revokeObjectURL(item.videoSrc); } catch {}
        }
      }
    } catch {}
    setCapturedImages([]);
  };

  useEffect(() => {
    let currentStream = null;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraAvailable(false);
          setCameraError('Dispositivo no disponible');
          return;
        }
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
          await videoRef.current.play();
        }
        streamRef.current = currentStream;
        setCameraAvailable(true);
        setCameraError(null);
      } catch (err) {
        setCameraAvailable(false);
        const msg = err?.name === 'NotAllowedError'
          ? 'Permiso de cámara denegado'
          : err?.name === 'NotFoundError'
          ? 'No se encontró cámara conectada'
          : 'Dispositivo no disponible';
        setCameraError(msg);
      }
    };
    startCamera();
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
      streamRef.current = null;
    };
  }, []);

  const handleCapturar = () => {
    try {
      const video = videoRef.current;
      if (!video || !cameraAvailable) {
        const sampleUrl = `https://via.placeholder.com/600x400.png?text=Sin+camara+${capturedImages.length + 1}`;
        setCapturedImages((prev) => [...prev, { id: Date.now(), src: sampleUrl, fullSrc: sampleUrl, thumbSrc: sampleUrl }]);
        return;
      }
      const width = video.videoWidth || video.clientWidth || 1280;
      const height = video.videoHeight || video.clientHeight || 720;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);

      /*
       * Anotaciones/overlay de captura deshabilitadas temporalmente para reuso futuro.
       * Se conserva el código comentado para poder reactivarlo más adelante.
       
      // Overlay: fondo semitransparente y textos con colores del tema
      const now = new Date();
      const timestamp = now.toLocaleString();
      //const line1 = `Examen Nº ${codigo || '—'}`;
      //const line2 = `Dr: ${gastro || '—'}`;
      //const line3 = `Centro: ${centro || '—'}${sala ? ` (${sala})` : ''}`;

      const padding = 16;
      const lineHeight = 22;
      const boxHeight = padding * 2 + lineHeight * (storageFolderName ? 4 : 3);

      // Usar tipografía del tema para medición y render
      ctx.font = `16px ${theme.typography?.fontFamily || 'sans-serif'}`;
      ctx.textBaseline = 'top';

      // Banda inferior a ancho completo
      ctx.fillStyle = toRgba(theme.palette?.primary?.main, 0.85);
      ctx.fillRect(0, height - boxHeight, width, boxHeight);

      // Texto con contraste del tema
      //ctx.fillStyle = theme.palette?.primary?.contrastText || '#fff';
      //let y = height - boxHeight + padding;
      //ctx.fillText(line1, padding, y); y += lineHeight;
      //ctx.fillText(line2, padding, y); y += lineHeight;
      //ctx.fillText(line3, padding, y);

      // timestamp arriba derecha con chip del tema
      const tsPadding = 12;
      const tsText = timestamp;
      const tsWidth = ctx.measureText(tsText).width + tsPadding * 2;
      const tsHeight = 28;
      ctx.fillStyle = toRgba(theme.palette?.primary?.main, 0.85);
      ctx.fillRect(width - tsWidth - tsPadding, tsPadding, tsWidth, tsHeight);
      //ctx.fillStyle = theme.palette?.primary?.contrastText || '#fff';
      //ctx.fillText(tsText, width - tsWidth - tsPadding + tsPadding, tsPadding + 6);
      */

      const fullDataUrl = canvas.toDataURL('image/jpeg', 0.92);

      // Generar miniatura ligera manteniendo proporción
      const thumbMaxWidth = 320;
      const scale = Math.min(1, thumbMaxWidth / width);
      const thumbW = Math.round(width * scale);
      const thumbH = Math.round(height * scale);
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = thumbW;
      thumbCanvas.height = thumbH;
      const tctx = thumbCanvas.getContext('2d');
      tctx.drawImage(canvas, 0, 0, width, height, 0, 0, thumbW, thumbH);
      const thumbDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.85);

      const newImage = { id: Date.now(), src: fullDataUrl, fullSrc: fullDataUrl, thumbSrc: thumbDataUrl };
      setCapturedImages((prev) => [...prev, newImage]);
      handleGuardarImagen(newImage);
    } catch (e) {
      const sampleUrl = `https://via.placeholder.com/600x400.png?text=Captura+${capturedImages.length + 1}`;
      setCapturedImages((prev) => [...prev, { id: Date.now(), src: sampleUrl, fullSrc: sampleUrl, thumbSrc: sampleUrl }]);
    }
  };

  const handleGrabar = () => {
    try {
      if (!cameraAvailable || !streamRef.current) {
        alert('No hay cámara disponible para grabar');
        return;
      }
      const candidates = [
        'video/mp4;codecs=avc1',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      const mimeType = (window.MediaRecorder && candidates.find((t) => MediaRecorder.isTypeSupported(t))) || '';
      const rec = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
      recordedChunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const newVideo = { id: Date.now(), kind: 'video', videoSrc: url, mimeType: mimeType || 'video/webm', videoBlob: blob };
        setCapturedImages((prev) => [...prev, newVideo]);
        handleGuardarVideo(newVideo);
        recordedChunksRef.current = [];
      };
      recorderRef.current = rec;
      rec.start();
      setIsRecording(true);
    } catch (err) {
      console.error('No se pudo iniciar grabación:', err);
      alert('No se pudo iniciar la grabación');
    }
  };

  const handleTerminar = () => {
    try {
      if (recorderRef.current && isRecording) {
        recorderRef.current.stop();
      }
    } finally {
      setIsRecording(false);
    }
  };

  const handleTerminarExamen = () => {
    setIsRecording(false);
    window.close();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1, px: 2, maxWidth: '100% !important' }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <SectionHeader title="Captura de Imágenes" />
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mb: 1 }}>

            {/* Información superior: 2 filas */}
            <Grid item xs={12} md={4}>

              <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>Examen Nº {codigo || '—'} Dr: {gastro || '—'}</Typography>

            </Grid>
            <Grid item xs={12} md={4}>

              <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}></Typography>

            </Grid>
            <Grid item xs={12} md={6} sx={{ pr: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                  <Button aria-label="Terminar Examen" variant="contained" color="error" startIcon={<Stop />} onClick={handleTerminarExamen}>
                     <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>Terminar Examen</Box>
                   </Button>
                </Box>
              </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />

          {/* Fila 1 */}
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Paciente</Typography>
              <Typography variant="h6" fontWeight="bold">{paciente || '—'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Procedimiento</Typography>
              <Typography variant="h6" fontWeight="bold">{procedimiento || '—'}</Typography>
            </Grid>
          </Grid>
          {/* Fila 2 */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Centro (Sala) */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary">Centro (Sala)</Typography>
                <Typography variant="h6" fontWeight="bold">{centro || '—'}{sala ? ` (${sala})` : ''}</Typography>
              </Box>
            </Grid>
            {/* Fecha de Estudio */}
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Fecha de Estudio</Typography>
              <Typography variant="h6" fontWeight="bold">{fechaEstudio ? new Date(fechaEstudio).toLocaleDateString('es-ES') : '—'}</Typography>
            </Grid>
            {/* Edad del Paciente */}
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Edad</Typography>
              <Typography variant="h6" fontWeight="bold">{edadPaciente ? `${edadPaciente} años` : '—'}</Typography>
            </Grid>
            {/* Ruta de guardado 
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Ruta de guardado</Typography>
              <Typography variant="h6" fontWeight="bold">{storageFolderPath || '—'}</Typography>
              <Typography variant="body2" color="text.secondary">Ruta base establecida</Typography>
              <Typography variant="h6" fontWeight="bold">{storageBasePath || '—'}</Typography>
            </Grid>*/}
           </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Sección principal: 2 columnas */}
          <Grid container spacing={2}>
            {/* Izquierda: recuadro grande para visualizar imagen a capturar */}
            <Grid item xs={12} md={8}>
              <Paper variant="outlined" sx={{ height: 600, width: '100%', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa' }}>
                {cameraAvailable ? (
                  <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {cameraError || 'Dispositivo no disponible'}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Derecha: columna dividida en 2 filas */}
            <Grid item xs={10} md={4} sx={{ height: { xs: 'auto', md: 600 } }}>
              <Grid container direction="column" spacing={2} sx={{ height: '100%' }}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, rowGap: 0.5, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                      <Button aria-label="Capturar" size="small" variant="contained" color="primary" startIcon={<PhotoCamera />} onClick={handleCapturar} disabled={!cameraAvailable} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>CAPTURAR</Box>
                      </Button>
                      <Button aria-label="Grabar" size="small" variant="contained" color="success" startIcon={<FiberManualRecord />} onClick={handleGrabar} disabled={isRecording} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>GRABAR</Box>
                      </Button>
                      <Button aria-label="Terminar" size="small" variant="contained" color="error" startIcon={<Stop />} onClick={handleTerminar} disabled={!isRecording} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>DETENER</Box>
                      </Button>
                      <Button aria-label="Guardar todas" size="small" variant="outlined" color="primary" onClick={handleGuardarTodas} disabled={capturedImages.length === 0 || !canSaveLocally} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>Guardar todas</Box>
                      </Button>
                       <Button size="small" variant="outlined" color="error" onClick={handleBorrarTodas} disabled={capturedImages.length === 0} sx={{ minWidth: 0, px: 1 }}>
                         Borrar todas
                       </Button>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={10} sx={{ flexGrow: 1 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '90%', display: 'flex', flexDirection: 'column' }}>
                    
                    <Box sx={{ position: { xs: 'sticky', sm: 'sticky', md: 'static' }, top: { xs: 0, sm: 0, md: 'auto' }, zIndex: 1, bgcolor: 'background.paper', borderBottom: '1px solid #eee', pb: 1, mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#666' }}>Visor de Imágenes ({capturedImages.length})</Typography>
                    </Box>
                    <Box ref={viewerRef} sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
                      {capturedImages.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                          <Typography variant="body2">Aún no hay capturas</Typography>
                        </Box>
                      ) : (
                        <List
                           rowCount={capturedImages.length}
                           rowHeight={112}
                           rowProps={{ images: capturedImages }}
                           rowComponent={({ index, style, images }) => {
                             const item = images?.[index];
                             if (!item) return null;
                             return (
                               <Box style={style} sx={{ position: 'relative', px: 0.5 }}>
                                  {item.kind === 'video' ? (
                                    <video
                                      src={item.videoSrc}
                                      controls
                                      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                                      onClick={() => handleOpenPreview(item)}
                                    />
                                  ) : (
                                    <img
                                      src={item.thumbSrc || item.src}
                                      alt={`Captura-${item.id}`}
                                      loading="lazy"
                                      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                                      onClick={() => handleOpenPreview(item)}
                                    />
                                  )}
                                  <Button
                                 size="small"
                                 variant="outlined"
                                 color="error"
                                 startIcon={<DeleteIcon />}
                                 onClick={() => handleEliminarImagen(item.id)}
                                 sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'background.paper' }}
                               >
                                 Eliminar
                               </Button>
                             </Box>
                           );
                         }}
                         style={{ height: viewerHeight || 400 }}
                         overscanCount={3}
                       />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Modal de preview */}
          <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="md" fullWidth>
            <DialogTitle>Vista previa</DialogTitle>
            <DialogContent dividers>
              {selectedImage && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {selectedImage.kind === 'video' ? (
                    <video src={selectedImage.videoSrc} controls style={{ maxWidth: '100%', maxHeight: '70vh' }} />
                  ) : (
                    <img src={selectedImage.fullSrc || selectedImage.src} alt="vista-previa" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreview}>Cerrar</Button>
              {selectedImage && (
                <>
                  <Button onClick={() => handleDescargar(selectedImage)} variant="outlined" color="primary">Descargar</Button>
                  {selectedImage.kind === 'video' ? (
                    <Button onClick={() => handleGuardarVideo(selectedImage)} variant="contained" color="primary" disabled={!!selectedImage?.saved || !canSaveLocally}>Guardar</Button>
                  ) : (
                    <Button onClick={() => handleGuardarImagen(selectedImage)} variant="contained" color="primary" disabled={!!selectedImage?.saved || !canSaveLocally}>Guardar</Button>
                  )}
                </>
              )}
            </DialogActions>
          </Dialog>

          {/* Diálogo de permiso para carpeta base */}
          <Dialog open={permDialogOpen} onClose={() => {}} maxWidth="sm" fullWidth>
            <DialogTitle>Configurar carpeta de guardado</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2">
                Para guardar automáticamente las capturas, selecciona la carpeta raíz:
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                D:\\GastroProcedures\\Capturas
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Esta acción se realiza una sola vez. Después, se crearán subcarpetas por estudio de forma automática.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={pickBaseDir}>Seleccionar carpeta</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default CapturaImagenes;