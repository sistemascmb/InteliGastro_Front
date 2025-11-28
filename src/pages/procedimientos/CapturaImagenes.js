import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Paper, Box, Typography, Divider, Grid, Button, ImageList, ImageListItem, Dialog, DialogTitle, DialogContent, DialogActions, ToggleButtonGroup, ToggleButton, FormControl, Select, MenuItem, InputLabel, FormControlLabel, Switch, IconButton, CircularProgress } from '@mui/material';
import { PhotoCamera, FiberManualRecord, Stop, Delete as DeleteIcon, Fullscreen, FullscreenExit, ExitToApp } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { archivodigitalService } from 'services/archivodigitalService';
import { fileUtils as itemToBlob } from 'services/fileUtils';
import { useTheme } from '@mui/material/styles';
import { List } from 'react-window';
import apiService from '../../shared/services/api-client';

function getExtensionFromMime(mimeType) {
  if (!mimeType) return 'bin';

  const mimeToExt = {
    // Imágenes
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    
    // Videos
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    'video/quicktime': 'mov',
    
    // PDF y documentos
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    
    // Otros
    'application/octet-stream': 'bin',
    'application/zip': 'zip',
  };

  return mimeToExt[mimeType.toLowerCase()] || 'bin';
}
//base 16
function toHexFromUint8(u8Array) {
  if (!u8Array || u8Array.length === 0) return '';
  return Array.from(u8Array, byte => byte.toString(16).padStart(2, '0')).join('');
}


/**
 * Convierte Uint8Array → Base64 (cadena pura, sin prefijo)
 */
function toBase64FromUint8(u8) {
  if (!u8 || u8.length === 0) return '';
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < u8.length; i += CHUNK) {
    const sub = u8.subarray(i, Math.min(i + CHUNK, u8.length));
    binary += String.fromCharCode.apply(null, sub);
  }
  return btoa(binary);
}

/**
 * Convierte Base64 (puro) → Uint8Array
 */
function toUint8FromBase64(base64) {
  if (!base64) return new Uint8Array(0);
  const binary = atob(base64);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

// Componente de header de sección, siguiendo patrón existente
const SectionHeader = ({ title, leftNode, rightNode }) => (
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {leftNode}
      <Typography variant="h6" fontWeight="bold">{title}</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{rightNode}</Box>
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
  const estudioTerminadoId = query.get('estudioTerminadoId') || '';
  const theme = useTheme();
  const studyTerminated = estudioTerminadoId === '1';

  const sectionRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerObjectFit = isFullscreen ? 'contain' : 'cover';

  // Ruta base de almacenamiento (configurable por .env)
   const storageBasePath = process.env.REACT_APP_ALMACENAMIENTO_URL || 'D\\\\GastroProcedures\\\\Capturas';
   // Puente de captura nativo (opcional)
   const defaultBridgeHost = process.env.REACT_APP_CAPTURE_BRIDGE_HOST || 'localhost:8765';
  const isHttpsApp = (typeof window !== 'undefined' && window?.location?.protocol === 'https:');
  const bridgeEnabled = String(process.env.REACT_APP_CAPTURE_BRIDGE_ENABLED || 'false').toLowerCase() === 'true';
  const [bridgeHostname, bridgePortFromHost] = String(defaultBridgeHost).split(':');
  const defaultHttpPort = Number(bridgePortFromHost || 8765);
  const httpsPortEnv = process.env.REACT_APP_CAPTURE_BRIDGE_PORT_HTTPS ? Number(process.env.REACT_APP_CAPTURE_BRIDGE_PORT_HTTPS) : (defaultHttpPort === 8765 ? 8766 : defaultHttpPort);
  const httpPortEnv = process.env.REACT_APP_CAPTURE_BRIDGE_PORT ? Number(process.env.REACT_APP_CAPTURE_BRIDGE_PORT) : defaultHttpPort;
  const bridgePort = isHttpsApp ? httpsPortEnv : httpPortEnv;
  const hostFallback = (typeof window !== 'undefined' && window.location?.hostname) ? window.location.hostname : '127.0.0.1';
  const captureBridgeBaseUrl = process.env.REACT_APP_CAPTURE_BRIDGE_URL || `${isHttpsApp ? 'https' : 'http'}://${bridgeHostname || hostFallback}:${bridgePort}`;
  const [storageFolderPath, setStorageFolderPath] = useState('');
  const [storageFolderName, setStorageFolderName] = useState('');
  // File System Access API
  const [baseDirHandle, setBaseDirHandle] = useState(null);
  const [studyDirHandle, setStudyDirHandle] = useState(null);
  const isFSAccessSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  // Estado de permiso de guardado
  const [canSaveLocally, setCanSaveLocally] = useState(false);
  const [permDialogOpen, setPermDialogOpen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (viewerRef.current) setViewerHeight(viewerRef.current.clientHeight || 0);
    };
    const onResize = () => { if (viewerRef.current) setViewerHeight(viewerRef.current.clientHeight || 0); };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('resize', onResize);
    // Inicial
    onResize();
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Selección de fuente de video: webcam vs otro dispositivo (videoinput)
  const [sourceType, setSourceType] = useState('webcam');
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

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
    } catch (err) {
      reject(err);
    }
  });

  const saveHandle = async (key, handle) => {
    const db = await openIDB();
    const tx = db.transaction('handles', 'readwrite');
    tx.objectStore('handles').put(handle, key);
    await tx.complete;
    db.close();
  };

  const loadHandle = async (key) => {
    const db = await openIDB();
    const tx = db.transaction('handles', 'readonly');
    const result = await new Promise((resolve) => {
      const req = tx.objectStore('handles').get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
    db.close();
    return result || null;
  };

  // ... existing code ...
  // Utilidad: refrescar lista de dispositivos de video
  const refreshVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const vids = devices.filter((d) => d.kind === 'videoinput');
      setVideoDevices(vids);
    } catch (err) {
      // ignore
    }
  };

  const enumerateAllMediaDevices = async () => {
    setMediaDevicesError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setMediaDevicesError('Tu navegador no soporta la enumeración de dispositivos.');
        setMediaDevicesInfo([]);
        return;
      }
      const isSecure = window.isSecureContext || (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost');
      if (!isSecure) {
        setMediaDevicesError('Se requiere ejecutar en HTTPS o localhost para acceder a cámara/micrófono.');
        setMediaDevicesInfo([]);
        return;
      }
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err1) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err2) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (err3) {
            if (err3 && (err3.name === 'NotAllowedError' || err3.name === 'SecurityError')) {
              setMediaDevicesError('Permisos no concedidos para cámara/micrófono o contexto inseguro. Autoriza en el navegador y reintenta.');
            }
          }
        }
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      setMediaDevicesInfo(devices || []);
      // Actualizar también HID y Gamepad
      try {
        if (hidSupported && navigator.hid) {
          const hidDevs = await navigator.hid.getDevices();
          setHidDevices(hidDevs || []);
        }
      } catch {}
      try {
        if (gamepadSupported && navigator.getGamepads) {
          const pads = Array.from(navigator.getGamepads()).filter(Boolean);
          setGamepadsInfo(pads || []);
        }
      } catch {}
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (err) {
      console.error('Error al enumerar dispositivos:', err);
      const name = (err && err.name) ? err.name : 'Error';
      setMediaDevicesError(`No se pudieron listar dispositivos: ${name}`);
      setMediaDevicesInfo([]);
    }
  };

  const pickDefaultCaptureDeviceId = (devices) => {
    const CE310B_REGEX = /avermedia.*ce310b|\bce310b\b/i;
    const cePref = devices.find((d) => CE310B_REGEX.test(d.label || ''));
    if (cePref) return cePref.deviceId;
    const CAPTURE_REGEX = /hdmi|capture|blackmagic|avermedia|aver|live gamer|lgx|extremecap|gc553|gc551|magewell|decklink|elgato|ce310b|pcie/i;
    const preferred = devices.find((d) => CAPTURE_REGEX.test(d.label || ''));
    return preferred?.deviceId || (devices[0]?.deviceId || '');
  };

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
            if (storageFolderName) {
              const dir = await h.getDirectoryHandle(storageFolderName, { create: true });
              setStudyDirHandle(dir);
            }
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
    const studyDate = new Date(fechaEstudio);
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
  const formatElapsed = (ms) => {
    const total = Math.max(0, Math.floor((ms || 0) / 1000));
    const mm = String(Math.floor(total / 60)).padStart(2, '0');
    const ss = String(total % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };
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
  const [isPaused, setIsPaused] = useState(false);
  const [recordingElapsedMs, setRecordingElapsedMs] = useState(0);
  const recordingStartRef = useRef(0);
  const recordingTimerRef = useRef(null);
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
  const [terminarPreviewOpen, setTerminarPreviewOpen] = useState(false);
  const [terminarPreviewItems, setTerminarPreviewItems] = useState([]);
  const [terminarSelected, setTerminarSelected] = useState(null);
  const [terminarProcessingOpen, setTerminarProcessingOpen] = useState(false);
  const [terminarSuccessOpen, setTerminarSuccessOpen] = useState(false);
  const [terminarSuccessInfo, setTerminarSuccessInfo] = useState({ codigo: '', guardados: 0, total: 0 });
  // Estado y refs para puente nativo (PCI/SDK)
  const [bridgeAvailable, setBridgeAvailable] = useState(false);
  const [bridgeStreamUrl, setBridgeStreamUrl] = useState('');
  const bridgeImgRef = useRef(null);
  const bridgeVideoRef = useRef(null);
  const [forceBridge, setForceBridge] = useState(false);
  const [devicesModalOpen, setDevicesModalOpen] = useState(false);
  const [mediaDevicesInfo, setMediaDevicesInfo] = useState([]);
  const [mediaDevicesError, setMediaDevicesError] = useState('');
  // Estado para pedal (WebHID) y gamepad
  const [hidSupported, setHidSupported] = useState(typeof navigator !== 'undefined' && 'hid' in navigator);
  const [hidDevices, setHidDevices] = useState([]);
  const [pedalDevice, setPedalDevice] = useState(null);
  const [pedalConnected, setPedalConnected] = useState(false);
  const [gamepadSupported, setGamepadSupported] = useState(typeof navigator !== 'undefined' && 'getGamepads' in navigator);
   const [gamepadsInfo, setGamepadsInfo] = useState([]);
   const pedalCooldownRef = useRef(0);
   const gamepadPollRef = useRef(null);
   const pedalCenterMask = parseInt(process.env.REACT_APP_PEDAL_CENTER_MASK || '2', 10);
   const pedalByteIndex = parseInt(process.env.REACT_APP_PEDAL_BYTE_INDEX || '0', 10);
   const pedalReportIdFilter = parseInt(process.env.REACT_APP_PEDAL_REPORT_ID || '', 10);
   const pedalKeycodes = (process.env.REACT_APP_PEDAL_CENTER_KEYCODES || '').split(',').map(s => parseInt(s.trim(), 10)).filter((n) => Number.isFinite(n));
   const [pedalFallbackAnyChange, setPedalFallbackAnyChange] = useState(false);
   const [hidLastReportHex, setHidLastReportHex] = useState('');
   const [hidLastReportAt, setHidLastReportAt] = useState(0);
    const [hidLastReportId, setHidLastReportId] = useState(null);
    const [keyboardPedalEnabled, setKeyboardPedalEnabled] = useState(true);
    const [lastKey, setLastKey] = useState('');
    const [lastCode, setLastCode] = useState('');
  useEffect(() => {
    const update = () => {
      if (viewerRef.current) setViewerHeight(viewerRef.current.clientHeight || 0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // HID/WebHID: listar y conectar dispositivos y pedal
  useEffect(() => {
    if (!hidSupported || !navigator.hid) return;
    (async () => {
      try {
        const devices = await navigator.hid.getDevices();
        setHidDevices(devices || []);
        const pedal = (devices || []).find((d) => (d.productName || '').toLowerCase().includes('pedal'));
        if (pedal) {
          try { await pedal.open(); } catch {}
          setPedalDevice(pedal);
          setPedalConnected(!!pedal.opened);
          const onReport = (e) => {
            try {
              const now = Date.now();
              if (now - (pedalCooldownRef.current || 0) < 400) return;
              const dv = e.data;
              const len = dv.byteLength;
              const bytes = [];
              for (let i = 0; i < len; i++) bytes.push(dv.getUint8(i));
              setHidLastReportHex(bytes.map((b) => b.toString(16).padStart(2, '0')).join(' '));
              setHidLastReportAt(now);
              setHidLastReportId(e.reportId);
              const matchesReportId = Number.isFinite(pedalReportIdFilter) ? (e.reportId === pedalReportIdFilter) : true;
              if (!matchesReportId) return;
              const idx = Math.max(0, Math.min(len - 1, pedalByteIndex));
              let centerPressed = len > 0 && ((dv.getUint8(idx) & pedalCenterMask) !== 0);
              if (!centerPressed && idx !== 0) {
                centerPressed = ((dv.getUint8(0) & pedalCenterMask) !== 0) || (len > 1 && ((dv.getUint8(1) & pedalCenterMask) !== 0));
              }
              if (!centerPressed && pedalKeycodes.length > 0 && len >= 3) {
                const keyBytes = bytes.slice(2);
                const pressedCenterViaKeycodes = keyBytes.some((b) => b !== 0 && pedalKeycodes.includes(b));
                if (pressedCenterViaKeycodes) centerPressed = true;
              }
              const anyChange = bytes.some((b) => b !== 0);
              if (!(centerPressed || (pedalFallbackAnyChange && anyChange))) return;
              if (!canCaptureNow()) return;
              pedalCooldownRef.current = now;
              handleCapturar();
            } catch {}
          };
          pedal.addEventListener('inputreport', onReport);
        }
      } catch {}
    })();
    const onConnect = (e) => {
      setHidDevices((prev) => [...(prev || []), e.device]);
    };
    const onDisconnect = (e) => {
      setHidDevices((prev) => (prev || []).filter((d) => d !== e.device));
      if (pedalDevice && e.device === pedalDevice) {
        setPedalDevice(null);
        setPedalConnected(false);
      }
    };
    navigator.hid.addEventListener('connect', onConnect);
    navigator.hid.addEventListener('disconnect', onDisconnect);
    return () => {
      navigator.hid.removeEventListener('connect', onConnect);
      navigator.hid.removeEventListener('disconnect', onDisconnect);
    };
  }, [hidSupported]);

  // Gamepad: listar y monitorear botones para accionar captura
  useEffect(() => {
    if (!gamepadSupported) return;
    const refresh = () => {
      try {
        const pads = Array.from(navigator.getGamepads ? navigator.getGamepads() : []).filter(Boolean);
        setGamepadsInfo(pads || []);
      } catch {}
    };
    const onConnect = () => refresh();
    const onDisconnect = () => refresh();
    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);
    refresh();
    return () => {
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
    };
  }, [gamepadSupported]);

  // Teclado: fallback para pedaleras que actúan como teclado HID
  useEffect(() => {
    const keyboardPedalKeys = (process.env.REACT_APP_PEDAL_KEYS || 'Enter,Space,c,KeyC').split(',').map(s => s.trim()).filter(Boolean);
    const onKeyDown = (e) => {
      try {
        setLastKey(e.key);
        setLastCode(e.code);
        // Tecla C: ejecutar exactamente la misma acción que el botón CAPTURAR
        if (e.key === 'c' || e.key === 'C' || e.code === 'KeyC') {
          const canClickButton = (cameraAvailable || (sourceType === 'device' && bridgeAvailable));
          if (!canClickButton) return;
          handleCapturar();
          return;
        }
        if (!keyboardPedalEnabled) return;
        // Evitar interferir con inputs
        const el = document.activeElement;
        if (el && ['INPUT','TEXTAREA','SELECT'].includes(el.tagName)) return;
        // Coincidencia por key o code (incluye Enter, Space, c, KeyC)
        const match = keyboardPedalKeys.includes(e.key) || keyboardPedalKeys.includes(e.code);
        if (!match) return;
        const now = Date.now();
        if (now - (pedalCooldownRef.current || 0) < 400) return;
        if (!canCaptureNow()) return;
        pedalCooldownRef.current = now;
        handleCapturar();
      } catch {}
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [keyboardPedalEnabled, cameraAvailable, bridgeAvailable, sourceType]);

  useEffect(() => {
    if (!gamepadSupported) return;
    if ((gamepadsInfo || []).length === 0) return;
    let frameId = null;
    const poll = () => {
      try {
        const pads = Array.from(navigator.getGamepads ? navigator.getGamepads() : []).filter(Boolean);
        const pressed = pads.some((gp) => (gp.buttons || []).some((b) => b.pressed));
        if (pressed) {
          const now = Date.now();
          if (now - (pedalCooldownRef.current || 0) >= 400) {
            if (!canCaptureNow()) {
              // No hay fuente disponible; no capturar (replica lógica del botón)
            } else {
              pedalCooldownRef.current = now;
              handleCapturar();
            }
          }
        }
      } catch {}
      frameId = requestAnimationFrame(poll);
    };
    frameId = requestAnimationFrame(poll);
    gamepadPollRef.current = frameId;
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      gamepadPollRef.current = null;
    };
  }, [gamepadsInfo, gamepadSupported, cameraAvailable, bridgeAvailable, sourceType]);

  const connectPedal = async () => {
    try {
      if (!hidSupported || !navigator.hid) {
        alert('Tu navegador no soporta WebHID (Chrome/Edge requerido).');
        return;
      }
      const devices = await navigator.hid.requestDevice({ filters: [] });
      const dev = devices && devices[0];
      if (!dev) return;
      try { await dev.open(); } catch {}
      setPedalDevice(dev);
      setPedalConnected(!!dev.opened);
      const onReport = (e) => {
        try {
          const now = Date.now();
          if (now - (pedalCooldownRef.current || 0) < 400) return;
          const dv = e.data;
          const len = dv.byteLength;
          const bytes = [];
          for (let i = 0; i < len; i++) bytes.push(dv.getUint8(i));
          setHidLastReportHex(bytes.map((b) => b.toString(16).padStart(2, '0')).join(' '));
          setHidLastReportAt(now);
          setHidLastReportId(e.reportId);
          const matchesReportId = Number.isFinite(pedalReportIdFilter) ? (e.reportId === pedalReportIdFilter) : true;
          if (!matchesReportId) return;
          const idx = Math.max(0, Math.min(len - 1, pedalByteIndex));
          let centerPressed = len > 0 && ((dv.getUint8(idx) & pedalCenterMask) !== 0);
          if (!centerPressed && idx !== 0) {
            centerPressed = ((dv.getUint8(0) & pedalCenterMask) !== 0) || (len > 1 && ((dv.getUint8(1) & pedalCenterMask) !== 0));
          }
          if (!centerPressed && pedalKeycodes.length > 0 && len >= 3) {
            const keyBytes = bytes.slice(2);
            const pressedCenterViaKeycodes = keyBytes.some((b) => b !== 0 && pedalKeycodes.includes(b));
            if (pressedCenterViaKeycodes) centerPressed = true;
          }
          const anyChange = bytes.some((b) => b !== 0);
          if (!(centerPressed || (pedalFallbackAnyChange && anyChange))) return;
          if (!canCaptureNow()) return;
          pedalCooldownRef.current = now;
          handleCapturar();
        } catch {}
      };
      dev.addEventListener('inputreport', onReport);
      setHidDevices((prev) => {
        const arr = prev || [];
        return arr.find((d) => d === dev) ? arr : [...arr, dev];
      });
    } catch (err) {
      console.warn('Conexión de pedal cancelada o fallida:', err);
    }
  };

  const disconnectPedal = async () => {
    try {
      if (pedalDevice?.opened) await pedalDevice.close();
    } catch {}
    setPedalConnected(false);
    setPedalDevice(null);
  };

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
    if (!isFSAccessSupported) return null;
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
        alert('Seleccione D:\\GastroProcedures\\Capturas para guardar automáticamente las capturas');
        try {
          base = await window.showDirectoryPicker();
          setBaseDirHandle(base);
          await idbSet('baseDir', base);
          setSavedHandleAvailable(true);
        } catch (e) {
          console.warn('Selección de carpeta cancelada o fallida:', e);
          return null;
        }
      }
      const dir = studyDirHandle || await base.getDirectoryHandle(storageFolderName, { create: true });
      setStudyDirHandle(dir);
      return dir;
    } catch (e) {
      console.warn('No se pudo asegurar carpeta del estudio:', e);
      return null;
    }
  };

  // Listar archivos existentes al abrir y precargar el visor
  const listExistingStudyFiles = async () => {
    if (!isFSAccessSupported || !studyDirHandle) return;
    try {
      const loaded = [];
      let idx = 0;
      for await (const [name, handle] of studyDirHandle.entries()) {
        if (handle.kind !== 'file') continue;
        const file = await handle.getFile();
        const lower = (name || '').toLowerCase();
        if ((file.type && file.type.startsWith('image/')) || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp')) {
          const url = URL.createObjectURL(file);
          loaded.push({ id: Date.now() + idx++, src: url, fullSrc: url, thumbSrc: url, fileName: name, saved: true, storedPath: `${storageFolderPath}\\${name}` });
        } else if ((file.type && file.type.startsWith('video/')) || lower.endsWith('.mp4') || lower.endsWith('.webm')) {
          const url = URL.createObjectURL(file);
          loaded.push({ id: Date.now() + idx++, kind: 'video', videoSrc: url, mimeType: file.type || (lower.endsWith('.mp4') ? 'video/mp4' : 'video/webm'), videoBlob: file, fileName: name, saved: true, storedPath: `${storageFolderPath}\\${name}` });
        }
      }
      if (loaded.length > 0) setCapturedImages(loaded);
    } catch (e) {
      console.warn('No se pudieron listar archivos existentes:', e);
    }
  };

  useEffect(() => {
    if (!isFSAccessSupported) return;
    if (!studyDirHandle) return;
    (async () => { await listExistingStudyFiles(); })();
  }, [studyDirHandle]);



  useEffect(() => {
    if (!isFSAccessSupported) return;
    if (!storageFolderName) return;
    if (baseDirHandle && !studyDirHandle) {
      (async () => {
        const ok = await ensureLocalDirReady();
        if (ok) await listExistingStudyFiles();
      })();
    }
  }, [isFSAccessSupported, storageFolderName, baseDirHandle, studyDirHandle]);

  const handleGuardarImagen = async (img) => {
    try {
      const fileName = img.fileName || getImageFileName();
      const dir = await ensureLocalDirReady();
      if (dir) {
        const blob = dataUrlToBlob(img.fullSrc || img.src || '');
        const fh = await dir.getFileHandle(fileName, { create: true });
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
      const dir = await ensureLocalDirReady();
      if (dir) {
        const fh = await dir.getFileHandle(fileName, { create: true });
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
    if (studyTerminated) return;
    const item = capturedImages.find((i) => i.id === id);
    try {
      const fullPath = item?.storedPath || (item?.fileName && storageFolderPath ? `${storageFolderPath}\\${item.fileName}` : null);
      if (fullPath) await deleteFileFromStorage(fullPath);
      // Revocar URLs blob
      try {
        if (item?.kind === 'video' && item?.videoSrc?.startsWith('blob:')) {
          URL.revokeObjectURL(item.videoSrc);
        } else {
          const imgUrl = item?.fullSrc || item?.src;
          if (imgUrl && imgUrl.startsWith('blob:')) URL.revokeObjectURL(imgUrl);
        }
      } catch {}
      setCapturedImages((prev) => prev.filter((i) => i.id !== id));
    } catch {}
  };

  const handleBorrarTodas = async () => {
    if (studyTerminated) return;
    if (capturedImages.length === 0) return;
    try {
      for (const item of capturedImages) {
        const fullPath = item?.storedPath || (item?.fileName && storageFolderPath ? `${storageFolderPath}\\${item.fileName}` : null);
        if (fullPath) {
          try { await deleteFileFromStorage(fullPath); } catch {}
        }
        // Revocar URLs blob para imágenes y videos
        try {
          if (item?.kind === 'video' && item.videoSrc?.startsWith('blob:')) {
            URL.revokeObjectURL(item.videoSrc);
          } else {
            const imgUrl = item?.fullSrc || item?.src;
            if (imgUrl && imgUrl.startsWith('blob:')) URL.revokeObjectURL(imgUrl);
          }
        } catch {}
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
          const v = videoRef.current;
          v.srcObject = currentStream;
          v.muted = true;
          v.playsInline = true;
          const tryPlay = async () => { try { await v.play(); } catch (e) {} };
          if (v.readyState >= 2) {
            tryPlay();
          } else {
            v.onloadedmetadata = () => tryPlay();
          }
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
      if (videoRef.current) {
        try { videoRef.current.srcObject = null; } catch {}
      }
    };
  }, []);

  // Refrescar dispositivos de vídeo cuando la cámara está disponible o se selecciona 'Otro dispositivo'
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    if (cameraAvailable || sourceType === 'device') refreshVideoDevices();
  }, [cameraAvailable, sourceType]);

  // Reiniciar stream según la selección de fuente/dispositivo
  useEffect(() => {
    const restart = async () => {
      try {
        // Skip getUserMedia when forcing bridge in device mode
        if (sourceType === 'device' && forceBridge) {
          if (streamRef.current) {
            try { streamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
            streamRef.current = null;
          }
          if (videoRef.current) {
            try { videoRef.current.srcObject = null; } catch {}
          }
          setCameraAvailable(false);
          setCameraError(null);
          return;
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
        const constraints = { video: sourceType === 'device' && selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true, audio: false };
        // Detener el stream actual si existe
        if (streamRef.current) {
          try { streamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
          streamRef.current = null;
          if (videoRef.current) {
            try { videoRef.current.srcObject = null; } catch {}
          }
        }
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = s;
        if (videoRef.current) {
          const v = videoRef.current;
          v.srcObject = s;
          v.muted = true;
          v.playsInline = true;
          const tryPlay = async () => { try { await v.play(); } catch (e) {} };
          if (v.readyState >= 2) {
            tryPlay();
          } else {
            v.onloadedmetadata = () => tryPlay();
          }
        }
        setCameraAvailable(true);
        setCameraError(null);
      } catch (err) {
        setCameraAvailable(false);
        const msg = err?.name === 'NotAllowedError'
          ? 'Permiso de cámara denegado'
          : err?.name === 'NotFoundError'
          ? (sourceType === 'device' ? 'Tarjeta no conectada' : 'No se encontró dispositivo de video')
          : 'Dispositivo no disponible';
        setCameraError(msg);
      }
    };
    // Evita correr si se selecciona "otro dispositivo" pero aún no hay deviceId
    if (sourceType === 'webcam' || (sourceType === 'device' && selectedDeviceId)) {
      restart();
    }
  }, [sourceType, selectedDeviceId, forceBridge]);

  // Selección automática de dispositivo cuando se elige "Otro dispositivo"
  useEffect(() => {
    if (sourceType === 'device' && videoDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(pickDefaultCaptureDeviceId(videoDevices));
    }
  }, [sourceType, videoDevices, selectedDeviceId]);

  // Mostrar mensaje específico cuando no se detecta dispositivo en modo 'Otro dispositivo'
  useEffect(() => {
    if (sourceType !== 'device') return;
    if (videoDevices.length === 0) {
      // Detener stream y limpiar visor
      if (streamRef.current) {
        try { streamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
        streamRef.current = null;
      }
      if (videoRef.current) {
        try { videoRef.current.srcObject = null; } catch {}
      }
      setSelectedDeviceId('');
      setCameraAvailable(false);
      setCameraError('Tarjeta no conectada');
    }
  }, [sourceType, videoDevices]);

  // Bridge: conectar a servicio nativo si no hay videoinputs en modo 'Otro dispositivo'
  useEffect(() => {
    const connectBridge = async () => {
      if (sourceType !== 'device') return;
      if (!bridgeEnabled) {
        setBridgeAvailable(false);
        setBridgeStreamUrl('');
        return;
      }
      if (!forceBridge && videoDevices.length > 0) {
        setBridgeAvailable(false);
        setBridgeStreamUrl('');
        return;
      }
      try {
        const resp = await fetch(`${captureBridgeBaseUrl}/status`, { method: 'GET' });
        if (resp.ok) {
          let status = {};
          try { status = await resp.json(); } catch {}
          const streamUrl = status?.streamUrl || `${captureBridgeBaseUrl}/stream.mjpeg`;
          setBridgeStreamUrl(streamUrl);
          setBridgeAvailable(true);
          setCameraError(null);
        } else {
          setBridgeAvailable(false);
          setBridgeStreamUrl('');
          setCameraError('Tarjeta no conectada');
        }
      } catch (e) {
        setBridgeAvailable(false);
        setBridgeStreamUrl('');
        setCameraError('Tarjeta no conectada');
      }
    };
    connectBridge();
  }, [sourceType, videoDevices, captureBridgeBaseUrl, forceBridge]);

  const canCaptureNow = () => (cameraAvailable || (sourceType === 'device' && bridgeAvailable));

  // Espera a que el video/imágen del visor esté listo para evitar capturas de placeholder
  const waitForVideoReady = (video, timeout = 1000) => new Promise((resolve) => {
    try {
      if (!video) return resolve(false);
      if ((video.readyState || 0) >= 2 && (video.videoWidth || 0) > 0) return resolve(true);
      let done = false;
      const cleanup = () => {
        video.removeEventListener('loadedmetadata', onReady);
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('playing', onReady);
      };
      const onReady = () => { if (!done) { done = true; cleanup(); resolve(true); } };
      video.addEventListener('loadedmetadata', onReady, { once: true });
      video.addEventListener('loadeddata', onReady, { once: true });
      video.addEventListener('canplay', onReady, { once: true });
      video.addEventListener('playing', onReady, { once: true });
      setTimeout(() => { if (!done) { done = true; cleanup(); resolve((video.videoWidth || 0) > 0); } }, timeout);
    } catch { resolve(false); }
  });
  const waitForImageReady = (img, timeout = 1000) => new Promise((resolve) => {
    try {
      if (!img) return resolve(false);
      if (img.complete && (img.naturalWidth || 0) > 0) return resolve(true);
      let done = false;
      const cleanup = () => { img.removeEventListener('load', onLoad); img.removeEventListener('error', onErr); };
      const onLoad = () => { if (!done) { done = true; cleanup(); resolve(true); } };
      const onErr = () => { if (!done) { done = true; cleanup(); resolve(false); } };
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onErr, { once: true });
      setTimeout(() => { if (!done) { done = true; cleanup(); resolve(img.complete && (img.naturalWidth || 0) > 0); } }, timeout);
    } catch { resolve(false); }
  });

  const handleCapturar = async () => {
    if (studyTerminated) return;
    try {
      // Modo dispositivo con puente: intentar primero snapshot del puente (más robusto)
      if (sourceType === 'device' && bridgeAvailable) {
        try {
          const resp = await fetch(`${captureBridgeBaseUrl}/snapshot.jpg`, { cache: 'no-store' });
          if (!resp.ok) throw new Error('snapshot_failed');
          const blob = await resp.blob();
          const fullDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          const img = new Image();
          img.crossOrigin = 'anonymous';
          const blobUrl = URL.createObjectURL(blob);
          await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = blobUrl; });
          try { URL.revokeObjectURL(blobUrl); } catch {}
          const width = img.naturalWidth || img.width || 1280;
          const height = img.naturalHeight || img.height || 720;
          const thumbMaxWidth = 320;
          const scale = Math.min(1, thumbMaxWidth / width);
          const thumbW = Math.round(width * scale);
          const thumbH = Math.round(height * scale);
          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = thumbW;
          thumbCanvas.height = thumbH;
          const tctx = thumbCanvas.getContext('2d');
          tctx.drawImage(img, 0, 0, width, height, 0, 0, thumbW, thumbH);
          const thumbDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.85);

          const newImage = { id: Date.now(), src: fullDataUrl, fullSrc: fullDataUrl, thumbSrc: thumbDataUrl };
          setCapturedImages((prev) => [...prev, newImage]);
          handleGuardarImagen(newImage);
          try { if (navigator.vibrate) navigator.vibrate(50); } catch {}
          return;
        } catch (snapshotErr) {
          // Fallback: capturar del visor (<img> con stream.mjpeg)
          const drawEl = bridgeImgRef.current;
          if (drawEl) {
            try {
              const isReady = await waitForImageReady(drawEl, 1000);
              if (!isReady) return;
              const width = drawEl.naturalWidth || drawEl.width || viewerRef.current?.clientWidth || 1280;
              const height = drawEl.naturalHeight || drawEl.height || viewerRef.current?.clientHeight || 720;
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(drawEl, 0, 0, width, height);
              const fullDataUrl = canvas.toDataURL('image/jpeg', 0.95);
              if (!fullDataUrl || fullDataUrl === 'data:,') throw new Error('tainted');
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
              try { if (navigator.vibrate) navigator.vibrate(50); } catch {}
              return;
            } catch (viewerErr) {
              // Continuar hacia captura de webcam si también falla el visor
            }
          }
        }
      }

      // Caso normal: cámara/webcam
      const video = videoRef.current;
      const drawEl = video;
      const videoReady = await waitForVideoReady(video, 1000);
      if (!videoReady) return;
      if (!drawEl || !cameraAvailable) {
        const sampleUrl = '/placeholder.svg';
        setCapturedImages((prev) => [...prev, { id: Date.now(), src: sampleUrl, fullSrc: sampleUrl, thumbSrc: sampleUrl }]);
        return;
      }
      const width = (drawEl?.videoWidth || drawEl?.clientWidth || 1280);
      const height = (drawEl?.videoHeight || drawEl?.clientHeight || 720);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(drawEl, 0, 0, width, height);

      const fullDataUrl = canvas.toDataURL('image/jpeg', 0.92);
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
      try { if (navigator.vibrate) navigator.vibrate(50); } catch {}
    } catch (e) {
      const sampleUrl = '/placeholder.svg';
      setCapturedImages((prev) => [...prev, { id: Date.now(), src: sampleUrl, fullSrc: sampleUrl, thumbSrc: sampleUrl }]);
    }
  };

  const handleGrabar = () => {
    if (studyTerminated) return;
    try {
      if (sourceType === 'device' && bridgeAvailable) {
        alert('Modo puente: la grabación de video no está disponible.');
        return;
      }
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
      setIsPaused(false);
      recordingStartRef.current = Date.now();
      setRecordingElapsedMs(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingElapsedMs(Date.now() - recordingStartRef.current);
      }, 1000);
    } catch (err) {
      console.error('No se pudo iniciar grabación:', err);
      alert('No se pudo iniciar la grabación');
    }
  };

  const handleTerminar = () => {
    if (studyTerminated) return;
    try {
      if (recorderRef.current && isRecording) {
        recorderRef.current.stop();
      }
    } finally {
      setIsRecording(false);
      setIsPaused(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingElapsedMs(0);
    }
  };

  const handleTerminarEstudio_old = async () => {
    try {
      const files = capturedImages.slice();
      if (files.length === 0) return;
      for (const item of files) {

        let nombre = item.fileName || `FILE_${codigo}_${Date.now()}`;
        let extension = 'jpg';
        let archivo = '';
        let blob;
        {/*
        if (item.kind === 'video') {
          let blob = item.videoBlob;
          if (!blob && item.videoSrc) {
            const resp = await fetch(item.videoSrc);
            blob = await resp.blob();
          }
          archivo = await blobToBase64(blob);
          extension = getExtensionFromMime(item.mimeType || blob.type || 'video/mp4');
          if (!/\.(mp4|webm)$/i.test(nombre)) nombre = `${nombre}.${extension}`;
        } else {
          const dataUrl = item.fullSrc || item.src || '';
          archivo = dataUrlToBase64(dataUrl);
          const mimeMatch = (dataUrl || '').match(/^data:(.+);base64,/);
          const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          extension = getExtensionFromMime(mime);
          if (!/\.(jpg|jpeg|png|gif)$/i.test(nombre)) nombre = `${nombre}.${extension}`;
        }
          */}

          if (item.kind === 'video') {
            blob = item.videoBlob;
            if (!blob && item.videoSrc) {
              const res = await fetch(item.videoSrc);
              blob = await res.blob();
            }
          } else {
            const dataUrl = item.fullSrc || item.src;
            if (!dataUrl) continue;
            blob = await fetch(dataUrl).then(r => r.blob());
          }

          if (!blob) continue;

          const mimeType = blob.type || (item.kind === 'image' ? 'image/jpeg' : 'video/mp4');
          extension = getExtensionFromMime(mimeType);
          const size = blob.size;
          const u8 = new Uint8Array(await blob.arrayBuffer());
          archivo = toHexFromUint8(u8); // o toBase64FromUint8(u8)

        const payload = { nombre, extension, archivo };
        try {
          await apiService.post('/ArchivoDigital/upload-file', payload);
        } catch (err) {
          console.log('Payload preparado para envío:', payload);
        }
      }
    } catch (e) {}
  };

  const handleTerminarEstudio = async () => {
    if (studyTerminated) return;
  try {
    setTerminarProcessingOpen(true);
    const files = capturedImages.slice();
    if (files.length === 0) return;
    const previewItems = [];
    let procesados = 0;
    let exitos = 0;


    for (const item of files) {
      // ✅ Conversión unificada a Blob
      const blob = await itemToBlob(item);

      // Ahora trabajas con el Blob (igual para imagen y video)
      const mimeType = blob.type || (item.kind === 'image' ? 'image/jpeg' : 'video/mp4');
      const extension = getExtensionFromMime(mimeType);
      const size = blob.size;

      // ✅ Convertir a Base64 puro (sin prefijo)
      const u8 = new Uint8Array(await blob.arrayBuffer());
      const archive = toBase64FromUint8(u8); // ← Base64 puro

      // Nombre
      let nombre = item.fileName || `FILE_${codigo}_${Date.now()}`;
        const validExts = item.kind === 'video' 
          ? ['mp4', 'webm'] 
          : ['jpg', 'jpeg', 'png', 'gif'];
      const hasValidExt = new RegExp(`\\.(${validExts.join('|')})$`, 'i').test(nombre);
        if (!hasValidExt) nombre = `${nombre}.${extension}`;

      const payload = {
        date: new Date().toISOString(),
        hour: new Date().getHours() + ':'+ new Date().getMinutes(),
        nombre,
        extension,
        archive,
        mimeType,
        size,
        kind: item.kind,
        estudioId: codigo || null,
        status: true,
        createdAt: new Date().toISOString(),
      };

      try {
        const nuevoUsuario = await archivodigitalService.create_CaptureImagenes(payload);
        console.log('✅ Usuario creado:', nuevoUsuario);
        exitos += 1;
        //await apiService.post('/ArchivoDigital/upload-file', payload);
      } catch (err) {
        console.log('Payload preparado para envío:', payload);
      }
      procesados += 1;

      //const dataUrl = `${mimeType ? `data:${mimeType};base64,` : 'data:application/octet-stream;base64,'}${archive}`;
      //previewItems.push({ nombre, extension, mimeType, kind: item.kind, dataUrl, size });
    }
    if (procesados === files.length && exitos === files.length) {
      setTerminarSuccessInfo({ codigo: codigo || '', guardados: exitos, total: files.length });
      setTerminarProcessingOpen(false);
      setTerminarSuccessOpen(true);
    } else {
      setTerminarProcessingOpen(false);
      alert(`Se guardaron ${exitos} de ${files.length} archivos. Verifique y reintente.`);
    }
    //setTerminarPreviewItems(previewItems);
    //setTerminarSelected(previewItems[0] || null);
    //setTerminarPreviewOpen(true);
  } catch (error) {
    console.error('Error en handleTerminarEstudio:', error);
  }
};

  useEffect(() => {
    if (terminarSuccessOpen) {
      const t = setTimeout(() => {
        try { localStorage.setItem('procedimientosUpdated', String(Date.now())); } catch {}
        try { if (window.opener) window.opener.postMessage({ type: 'EXAM_TERMINATED' }, window.location.origin); } catch {}
        setIsRecording(false);
        window.close();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [terminarSuccessOpen]);

  const handlePausarReanudar = () => {
    try {
      if (!recorderRef.current || !isRecording) return;
      if (!isPaused) {
        if (recorderRef.current.state === 'recording' && recorderRef.current.pause) {
          recorderRef.current.pause();
          setIsPaused(true);
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
          }
        }
      } else {
        if (recorderRef.current.state === 'paused' && recorderRef.current.resume) {
          recorderRef.current.resume();
          setIsPaused(false);
          recordingStartRef.current = Date.now() - recordingElapsedMs;
          if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = setInterval(() => {
            setRecordingElapsedMs(Date.now() - recordingStartRef.current);
          }, 1000);
        }
      }
    } catch {}
  };

  const handleTerminarExamen = () => {
    setIsRecording(false);
    window.close();
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && sectionRef.current?.requestFullscreen) {
        await sectionRef.current.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {}
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1, px: 2, maxWidth: '100% !important' }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }} ref={sectionRef}>
        <SectionHeader title="Captura de Imágenes" leftNode={(
          <IconButton size="small" onClick={toggleFullscreen} sx={{ color: 'primary.contrastText' }} aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Maximizar sección'}>
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        )} rightNode={(
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={sourceType}
              onChange={(e, val) => { if (val) setSourceType(val); }}
            >
              <ToggleButton value="webcam">Cámara web</ToggleButton>
              <ToggleButton value="device">Otro dispositivo</ToggleButton>
            </ToggleButtonGroup>
            {sourceType === 'device' && (
              <FormControlLabel
                control={<Switch size="small" checked={forceBridge} onChange={(e) => setForceBridge(e.target.checked)} />}
                label="Forzar puente"
              />
            )}
            {sourceType === 'device' && (
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id="dev-select-label">Dispositivo</InputLabel>
                <Select
                  labelId="dev-select-label"
                  label="Dispositivo"
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  disabled={forceBridge}
                >
                  {videoDevices.length === 0 ? (
                    <MenuItem value="" disabled>Sin dispositivos de video</MenuItem>
                  ) : (
                    [...videoDevices].sort((a, b) => {
                      const re = /hdmi|capture|blackmagic|avermedia|aver|live gamer|lgx|extremecap|gc553|gc551|magewell|decklink|elgato|ce310b|pcie/i;
                      const ca = re.test(a.label || '');
                      const cb = re.test(b.label || '');
                      if (ca && !cb) return -1;
                      if (!ca && cb) return 1;
                      return (a.label || '').localeCompare(b.label || '');
                    }).map((d) => (
                      <MenuItem key={d.deviceId} value={d.deviceId}>
                        {(() => {
                          const lbl = d.label || `Dispositivo ${d.deviceId.slice(-4)}`;
                          const isCapture = /hdmi|capture|blackmagic|avermedia|aver|live gamer|lgx|extremecap|gc553|gc551|magewell|decklink|elgato|ce310b|pcie/i.test(d.label || '');
                          return isCapture ? `${lbl} (capturadora)` : lbl;
                        })()}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
          </Box>
        )} />
        <Dialog open={devicesModalOpen} onClose={() => setDevicesModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Dispositivos de sonido y video</DialogTitle>
          <DialogContent dividers>
            {mediaDevicesError ? (
              <Box>
                <Typography variant="body2" color="error">{mediaDevicesError}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Si abres desde otra PC vía IP, usa HTTPS o autoriza cámara/micrófono en el navegador y vuelve a intentar.
                </Typography>
              </Box>
            ) : mediaDevicesInfo.length === 0 ? (
              <Typography variant="body2">No se pudieron listar dispositivos o no hay permisos.</Typography>
            ) : (
              <Box>
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>Video (videoinput)</Typography>
                {mediaDevicesInfo.filter((d) => d.kind === 'videoinput').map((d) => (
                  <Typography key={`${d.kind}-${d.deviceId}`} variant="body2">• {(d.label || 'Sin nombre')} — id: {String(d.deviceId || '').slice(-8) || '—'}</Typography>
                ))}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Audio de entrada (audioinput)</Typography>
                {mediaDevicesInfo.filter((d) => d.kind === 'audioinput').map((d) => (
                  <Typography key={`${d.kind}-${d.deviceId}`} variant="body2">• {(d.label || 'Sin nombre')} — id: {String(d.deviceId || '').slice(-8) || '—'}</Typography>
                ))}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Audio de salida (audiooutput)</Typography>
                {mediaDevicesInfo.filter((d) => d.kind === 'audiooutput').map((d) => (
                  <Typography key={`${d.kind}-${d.deviceId}`} variant="body2">• {(d.label || 'Sin nombre')} — id: {String(d.deviceId || '').slice(-8) || '—'}</Typography>
                ))}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Otros (HID)</Typography>
                {hidSupported ? (
                  hidDevices.length === 0 ? (
                    <Typography variant="body2">• Ningún dispositivo HID listado</Typography>
                  ) : (
                    hidDevices.map((d, idx) => (
                      <Typography key={`hid-${idx}`} variant="body2">• {(d.productName || 'HID sin nombre')} — vid: {d.vendorId?.toString(16) || '—'} pid: {d.productId?.toString(16) || '—'}</Typography>
                    ))
                  )
                ) : (
                  <Typography variant="body2">Tu navegador no soporta WebHID</Typography>
                )}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Gamepad</Typography>
                {gamepadSupported ? (
                  (gamepadsInfo.length === 0 ? (
                    <Typography variant="body2">• Ningún gamepad conectado</Typography>
                  ) : (
                    gamepadsInfo.map((gp, idx) => (
                      <Typography key={`gp-${idx}`} variant="body2">• {(gp.id || 'Gamepad')} — botones: {gp.buttons?.length || 0}</Typography>
                    ))
                  ))
                ) : (
                  <Typography variant="body2">Tu navegador no soporta Gamepad API</Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel control={<Switch size="small" checked={pedalFallbackAnyChange} onChange={(e) => setPedalFallbackAnyChange(e.target.checked)} />} label="Compatibilidad: disparar ante cualquier cambio" />
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Último reporte HID: {hidLastReportHex || '—'}</Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>Último reportId: {hidLastReportId ?? '—'}</Typography>
                  <FormControlLabel sx={{ mt: 1 }} control={<Switch size="small" checked={keyboardPedalEnabled} onChange={(e) => setKeyboardPedalEnabled(e.target.checked)} />} label="Usar teclado como pedal" />
                  <Typography variant="caption" sx={{ display: 'block' }}>Última tecla: {lastKey || '—'} ({lastCode || '—'})</Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDevicesModalOpen(false)}>Cerrar</Button>
            <Button variant="outlined" onClick={enumerateAllMediaDevices}>Actualizar</Button>
            {hidSupported && (
              <Button variant="contained" color="primary" onClick={connectPedal}>
                Conectar pedal (HID)
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mb: 1 }}>

            {/* Información superior: 2 filas */}
            <Grid item xs={12} md={4}>

              <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>Examen Nº {codigo || '—'} Dr: {gastro || '—'}</Typography>

            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button size="small" variant="outlined" onClick={() => { enumerateAllMediaDevices(); setDevicesModalOpen(true); }}>
                  oo
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ pr: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                  <Button aria-label="TERMINAR ESTUDIO" variant="contained" color="warning" startIcon={<Stop />} onClick={handleTerminarEstudio} disabled={capturedImages.length === 0 || studyTerminated} sx={{ minWidth: 0, px: 1 }}>
                     <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>TERMINAR ESTUDIO</Box>
                   </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ pr: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                  <Button aria-label="Cerrar Examen" variant="contained" color="secondary" startIcon={<ExitToApp />} onClick={handleTerminarExamen}>
                     <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>Cerrar Examen</Box>
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
    <Grid item xs={12} md={4}>
      <Typography variant="body2" color="text.secondary">Estudio Terminado</Typography>
      <Typography variant="h6" fontWeight="bold">{estudioTerminadoId === '1' ? 'Sí' : (estudioTerminadoId === '0' ? 'No' : (estudioTerminadoId || '—'))}</Typography>
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
              <Paper variant="outlined" sx={{ height: { xs: 260, md: isFullscreen ? '72vh' : 600 }, width: 1000, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa' }}>
                {sourceType === 'device' && bridgeAvailable ? (
                   <img crossOrigin="anonymous" ref={bridgeImgRef} src={bridgeStreamUrl} style={{ width: '100%', height: '100%', objectFit: viewerObjectFit }} alt="stream-dispositivo" />
                 ) : cameraAvailable ? (
                   <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: viewerObjectFit }} muted playsInline />
                 ) : (
                   <Typography variant="body1" color="text.secondary">
                     {cameraError || 'Dispositivo no disponible'}
                   </Typography>
                 )}
              </Paper>
            </Grid>

            {/* Derecha: columna dividida en 2 filas */}
            <Grid item xs={12} md={4} sx={{ height: { xs: 'auto', md: isFullscreen ? '72vh' : 600 } }}>
              <Grid container direction="column" spacing={1} sx={{ height: '100%' }}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, rowGap: 0.5, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                      <Button aria-label="Capturar" size="small" variant="contained" color="primary" startIcon={<PhotoCamera />} onClick={handleCapturar} disabled={!(cameraAvailable || (sourceType === 'device' && bridgeAvailable)) || studyTerminated} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>CAPTURAR</Box>
                      </Button>
                      <Button aria-label="Grabar" size="small" variant="contained" color="success" startIcon={<FiberManualRecord />} onClick={handleGrabar} disabled={isRecording || (sourceType === 'device' && bridgeAvailable) || studyTerminated} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>GRABAR</Box>
                      </Button>
                      {isRecording && (
                        <Button aria-label={isPaused ? 'Reanudar' : 'Pausar'} size="small" variant="contained" color={isPaused ? 'primary' : 'warning'} startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />} onClick={handlePausarReanudar} sx={{ minWidth: 0, px: 1 }}>
                          <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>{isPaused ? 'REANUDAR' : 'PAUSAR'}</Box>
                        </Button>
                      )}
                      <Button aria-label="Terminar" size="small" variant="contained" color="error" startIcon={<Stop />} onClick={handleTerminar} disabled={!isRecording || (sourceType === 'device' && bridgeAvailable) || studyTerminated} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>DETENER</Box>
                      </Button>
                      
                      {isRecording && (
                        <Typography variant="subtitle2" sx={{ alignSelf: 'center', ml: 1, fontWeight: 'bold', color: isPaused ? 'warning.main' : 'success.main' }}>
                          {formatElapsed(recordingElapsedMs)}
                        </Typography>
                      )}
                      {/*<Button aria-label="Guardar todas" size="small" variant="outlined" color="primary" onClick={handleGuardarTodas} disabled={capturedImages.length === 0 || !canSaveLocally} sx={{ minWidth: 0, px: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>Guardar todas</Box>
                      </Button>
                     <Button size="small" variant="outlined" color="error" onClick={handleBorrarTodas} disabled={capturedImages.length === 0 || studyTerminated} sx={{ minWidth: 0, px: 1 }}>
                         Borrar todas
                       </Button>*/}
                       {/*<Typography variant="caption" sx={{ alignSelf: 'center', ml: 1, color: pedalConnected ? 'success.main' : 'text.secondary' }}>Pedal: {pedalConnected ? 'Conectado' : 'No conectado'}</Typography>*/}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={10} sx={{ flexGrow: 1 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '94%', display: 'flex', flexDirection: 'column' }}>
                    
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
                            rowHeight={isFullscreen ? 140 : 112}
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
                                 disabled={studyTerminated}
                                 sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'background.paper' }}
                               >
                                  Eliminar
                                 </Button>
                             </Box>
                           );
                         }}
                         style={{ height: viewerHeight || (isFullscreen ? 500 : 400) }}
                         overscanCount={3}
                       />
                      )}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Button size="small" variant="outlined" color="error" onClick={handleBorrarTodas} disabled={capturedImages.length === 0 || studyTerminated} sx={{ minWidth: 0, px: 1 }}>
                         Borrar todas
                       </Button>
                  </Paper>
                                  <Typography variant="caption">Para capturar puede presionar el pedal o la tecla "C"</Typography>

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
                        <video src={selectedImage.videoSrc} controls style={{ maxWidth: '100%', maxHeight: isFullscreen ? '90vh' : '70vh', objectFit: 'contain' }} />
                      ) : (
                        <img src={selectedImage.fullSrc || selectedImage.src} alt="vista-previa" style={{ maxWidth: '100%', maxHeight: isFullscreen ? '90vh' : '70vh', objectFit: 'contain' }} />
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

          {/* Modal: Archivos codificados del Terminar Estudio */}
          <Dialog open={terminarPreviewOpen} onClose={() => setTerminarPreviewOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Archivos preparados (base64)</DialogTitle>
            <DialogContent dividers>
              {terminarPreviewItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No hay archivos para mostrar</Typography>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {terminarPreviewItems.map((it, idx) => (
                        <Button key={idx} variant={terminarSelected?.nombre === it.nombre ? 'contained' : 'outlined'} onClick={() => setTerminarSelected(it)} sx={{ justifyContent: 'flex-start' }}>
                          {it.nombre}
                        </Button>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {terminarSelected && (
                        terminarSelected.kind === 'video' ? (
                          <video src={terminarSelected.dataUrl} controls style={{ maxWidth: '100%', maxHeight: isFullscreen ? '90vh' : '70vh', objectFit: 'contain' }} />
                        ) : (
                          <img src={terminarSelected.dataUrl} alt={terminarSelected.nombre} style={{ maxWidth: '100%', maxHeight: isFullscreen ? '90vh' : '70vh', objectFit: 'contain' }} />
                        )
                      )}
                    </Box>
                    {terminarSelected && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">Nombre: {terminarSelected.nombre}</Typography>
                        <Typography variant="body2">Extensión: {terminarSelected.extension}</Typography>
                        <Typography variant="body2">MIME: {terminarSelected.mimeType}</Typography>
                        <Typography variant="body2">Tamaño: {terminarSelected.size} bytes</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTerminarPreviewOpen(false)}>Cerrar</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={terminarProcessingOpen} onClose={() => {}} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>Procesando estudio</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                <CircularProgress size={24} color="primary" />
                <Typography variant="body2">SE ESTA PROCESANDO LA CARGA DEL ESTUDIO A LA BASE DE DATOS, POR FAVOR ESPERE UN MOMENTO</Typography>
              </Box>
            </DialogContent>
          </Dialog>
          <Dialog open={terminarSuccessOpen} onClose={() => setTerminarSuccessOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>Guardado correctamente</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2">Estudio EX-Nº {terminarSuccessInfo.codigo || '—'}</Typography>
              <Typography variant="body2">Se guardaron {terminarSuccessInfo.guardados} de {terminarSuccessInfo.total} archivos.</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={() => setTerminarSuccessOpen(false)}>Aceptar</Button>
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
