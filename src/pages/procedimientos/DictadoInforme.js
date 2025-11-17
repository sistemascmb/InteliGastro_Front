import React from 'react';
import { Container, Paper, Breadcrumbs, Link, Box, Typography, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, ImageList, ImageListItem, CircularProgress } from '@mui/material';
import { NavigateNext, Assignment, ExpandMore } from '@mui/icons-material';
import { RichTextEditor } from '../administracion/Plantillas';
import { plantillaService } from 'services/plantillasService';
import { archivodigitalService } from 'services/archivodigitalService';

const FALLBACK_INFORME_HTML = '<p><strong>Dictado de informe</strong></p><p>Inicie el dictado aquí...</p>';
const ITEM_HEIGHT = 100;

export default class DictadoInforme extends React.Component {
  constructor(props) {
    super(props);
    const sp = new URLSearchParams(window.location.search);

    this.state = {
      html: '',
      datos: {
        nombrePaciente: sp.get('nombre') || props.nombrePaciente || '',
        numeroEstudio: sp.get('numero') || props.numeroEstudio || '',
        edad: sp.get('edad') || props.edad || '',
        fecha: sp.get('fecha') || props.fecha || '',
        estudio: sp.get('estudio') || props.estudio || '',
        procedimiento: sp.get('procedimiento') || props.procedimiento || '',
        medico: sp.get('medico') || props.medico || '',
        plantilla: ''
      },
      images: [],
      selected: null,
      editorInst: null,
      plantillasAll: [],
      previewOpen: false,
      previewPlantilla: null,
      accordionImagesExpanded: true,
      accordionTemplatesExpanded: true,
      mediaPreviewOpen: false,
      mediaPreviewItem: null,
      imagesLoading: false
    };
  }

  resolveImageSrc = (item) => {
    const a = item && item.archive;
    const t = item && item.typeArchive ? String(item.typeArchive).toLowerCase() : '';
    if (!a && a !== 0) return '';
    if (typeof a === 'string') {
      const s0 = a.trim();
      if (!s0) return '';
      if (s0.startsWith('data:') || s0.startsWith('blob:') || s0.startsWith('http') || s0.startsWith('/')) return s0;
      const mime = this.getMimeFromItem(item);
      const sClean = s0.replace(/\s+/g, '');
      if (/^\s*\d+(?:\s*,\s*\d+)+\s*$/.test(s0)) {
        const nums = s0.split(',').map(x => parseInt(x.trim(), 10)).filter(n => !Number.isNaN(n));
        const bytes = new Uint8Array(nums);
        let binary = '';
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        const b64 = btoa(binary);
        return `data:${mime};base64,${b64}`;
      }
      const sHex = s0.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '');
      if (sHex.length > 16 && sHex.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(sHex)) {
        const b64 = this.hexToBase64(sHex);
        return `data:${mime};base64,${b64}`;
      }
      return `data:${mime};base64,${sClean}`;
    }
    if (Array.isArray(a)) {
      const mime = this.getMimeFromItem(item);
      const bytes = new Uint8Array(a);
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
      const b64 = btoa(binary);
      return `data:${mime};base64,${b64}`;
    }
    if (a && typeof a === 'object' && Array.isArray(a.data)) {
      const mime = this.getMimeFromItem(item);
      const bytes = new Uint8Array(a.data);
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
      const b64 = btoa(binary);
      return `data:${mime};base64,${b64}`;
    }
    return '';
  };

  normalizeSrc = (s, item) => {
    try {
      if (!s) return '';
      if (typeof s === 'string') {
        const v = s.trim();
        if (!v) return '';
        if (v.startsWith('data:') || v.startsWith('blob:') || v.startsWith('http') || v.startsWith('/')) return v;
        const mime = this.getMimeFromItem(item || {});
        const b = v.replace(/\s+/g, '');
        if (b.startsWith('/9j/') || b.startsWith('iVBOR') || b.startsWith('R0lGOD') || /^[A-Za-z0-9+/=]+$/.test(b)) return `data:${mime};base64,${b}`;
        return v;
      }
      return s;
    } catch { return ''; }
  };

  hexToBase64 = (hex) => {
    const len = hex.length;
    const bytes = new Uint8Array(len / 2);
    for (let i = 0; i < len; i += 2) bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  };

  getMimeFromItem = (item) => {
    const t = String(item?.typeArchive || '').toLowerCase();
    const d = String(item?.description || '').toLowerCase();
    if (t.includes('video') || /\.(mp4|webm|ogg)$/i.test(d)) {
      if (t.includes('webm') || d.endsWith('.webm')) return 'video/webm';
      if (t.includes('ogg') || d.endsWith('.ogg')) return 'video/ogg';
      return 'video/mp4';
    }
    if (t.includes('png') || d.endsWith('.png')) return 'image/png';
    if (t.includes('gif') || d.endsWith('.gif')) return 'image/gif';
    if (t.includes('bmp') || d.endsWith('.bmp')) return 'image/bmp';
    if (t.includes('webp') || d.endsWith('.webp')) return 'image/webp';
    return 'image/jpeg';
  };

  buildDataUrlFromItem = (item) => {
    try {
      const mime = this.getMimeFromItem(item || {});
      const a = item && item.archive;
      if (typeof a !== 'string') return '';
      const s = a.replace(/\s+/g, '').trim();
      if (!s) return '';
      if (s.startsWith('data:') || s.startsWith('blob:') || s.startsWith('http') || s.startsWith('/')) return s;
      return `data:${mime};base64,${s}`;
    } catch { return ''; }
  };

  handleMediaError = (idx) => {
    try {
      const list = [...this.state.images];
      const it = list[idx];
      if (!it) return;
      const mime = this.getMimeFromItem(it);
      const raw = it.archive;
      if (typeof raw === 'string') {
        const s0 = raw.trim();
        const sB64 = s0.replace(/\s+/g, '');
        if (/^[A-Za-z0-9+/=]+$/.test(sB64) || sB64.startsWith('/9j/') || sB64.startsWith('iVBOR') || sB64.startsWith('R0lGOD')) {
          list[idx] = { ...it, dataUrl: `data:${mime};base64,${sB64}`, mimeType: mime };
          this.setState({ images: list });
          return;
        }
        if (/^\s*\d+(?:\s*,\s*\d+)+\s*$/.test(s0)) {
          const nums = s0.split(',').map(x => parseInt(x.trim(), 10)).filter(n => !Number.isNaN(n));
          const bytes = new Uint8Array(nums);
          let binary = '';
          const chunk = 0x8000;
          for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
          const b64 = btoa(binary);
          list[idx] = { ...it, dataUrl: `data:${mime};base64,${b64}`, mimeType: mime };
          this.setState({ images: list });
          return;
        }
        const sHex = s0.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '');
        if (sHex.length > 16) {
          const b64 = this.hexToBase64(sHex);
          list[idx] = { ...it, dataUrl: `data:${mime};base64,${b64}`, mimeType: mime };
          this.setState({ images: list });
          return;
        }
      } else if (Array.isArray(raw)) {
        const bytes = new Uint8Array(raw);
        let binary = '';
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        const b64 = btoa(binary);
        list[idx] = { ...it, dataUrl: `data:${mime};base64,${b64}`, mimeType: mime };
        this.setState({ images: list });
        return;
      } else if (raw && typeof raw === 'object' && Array.isArray(raw.data)) {
        const bytes = new Uint8Array(raw.data);
        let binary = '';
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        const b64 = btoa(binary);
        list[idx] = { ...it, dataUrl: `data:${mime};base64,${b64}`, mimeType: mime };
        this.setState({ images: list });
        return;
      }
      try {
        archivodigitalService.getById(it.id).then((d) => {
          const src = this.buildDataUrlFromItem(d && d.data ? d.data : it) || this.resolveImageSrc(d && d.data ? d.data : it);
          const list2 = [...this.state.images];
          list2[idx] = { ...it, dataUrl: src, mimeType: this.getMimeFromItem(d && d.data ? d.data : it) };
          this.setState({ images: list2 });
        }).catch(() => {});
      } catch {}
    } catch {}
  };

  insertMediaItem = (item) => {
    try {
      const inst = this.state.editorInst;
      if (!inst || !item) return;
      const src = item?.dataUrl || this.buildDataUrlFromItem(item) || this.resolveImageSrc(item);
      if (!src) return;
      const isVideo = String(item.mimeType || item.typeArchive || '').toLowerCase().startsWith('video/');
      const htmlNode = isVideo ? `<video src="${src}" controls />` : `<img src="${src}" />`;
      if (inst.s && typeof inst.s.insertHTML === 'function') inst.s.insertHTML(htmlNode);
      else if (inst.selection && typeof inst.selection.insertHTML === 'function') inst.selection.insertHTML(htmlNode);
    } catch {}
  };

  async componentDidMount() {
    try {
      const res = await plantillaService.getAll();
      const list = Array.isArray(res) ? res : (res?.data || []);
      const sp = new URLSearchParams(window.location.search);
      const studiesIdRaw = sp.get('studiesId');
      let picked = '';
      if (studiesIdRaw) {
        const idNum = Number(studiesIdRaw);
        const foundExact = list.find(p => String(p.examsId) === studiesIdRaw || Number(p.examsId) === idNum);
        if (foundExact && foundExact.plantilla) picked = String(foundExact.plantilla || '');
      }
      if (!picked) {
        const estudioName = String(this.state.datos.estudio || '').toLowerCase();
        if (estudioName) {
          const foundByName = list.find(p => String(p.name || '').toLowerCase().includes(estudioName));
          if (foundByName && foundByName.plantilla) picked = String(foundByName.plantilla || '');
        }
      }
      if (!picked && list.length > 0 && list[0].plantilla) picked = String(list[0].plantilla || '');
      if (!picked) picked = FALLBACK_INFORME_HTML;
      this.setState({ html: picked, plantillasAll: list }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
    } catch {}

    try {
      const id = this.state.datos.numeroEstudio;
      if (id) {
        this.setState({ imagesLoading: true });
        const resImg = await archivodigitalService.searchByEstudioId(id);
        const imgsRaw = Array.isArray(resImg) ? resImg : (resImg?.data || []);
        const imgs = (imgsRaw || []).map((f) => ({
          id: f.id,
          description: f.description,
          mimeType: f.typeArchive,
          dataUrl: `data:${f.typeArchive};base64,${String(f.archive || '').replace(/\s+/g, '')}`,
          date: f.date,
          hour: f.hour,
          archive: f.archive,
          typeArchive: f.typeArchive,
          medical_ScheduleId: f.medical_ScheduleId
        }));
        this.setState({ images: imgs, imagesLoading: false });
      }
    } catch {}
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.html !== this.state.html && this.state.editorInst) {
      try { this.state.editorInst.value = this.state.html || ''; } catch {}
    }
  }

  render() {
    const { onClose } = this.props;
    const { html, datos } = this.state;
    return (
      <Container maxWidth="lg" sx={{ py: 1, px: 2, maxWidth: '100% !important' }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/" onClick={(e) => { e.preventDefault(); window.location.assign('/'); }}>
            Inicio
          </Link>
          <Link underline="hover" color="inherit" href="/procedimientos/dictadoproc" onClick={(e) => { e.preventDefault(); window.location.assign('/procedimientos/dictadoproc'); }}>
            Procedimientos
          </Link>
          <Typography color="text.primary">Dictado</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assignment sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
              Dictado de Informe
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <div><strong>N° Estudio:</strong> {datos.numeroEstudio}</div>
              <div><strong>Paciente:</strong> {datos.nombrePaciente}</div>
              <div><strong>Edad:</strong> {datos.edad}</div>
              <div><strong>Fecha:</strong> {datos.fecha}</div>
              {/*<div><strong>Estudio:</strong> {datos.estudio}</div>*/}
              <div><strong>Procedimiento:</strong> {datos.procedimiento}</div>
              <div><strong>Médico:</strong> {datos.medico}</div>
            </Box>
            <Button variant="contained" color="error" onClick={() => window.location.assign('/procedimientos/dictadoproc?refresh=1')}>Cerrar dictado</Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, height: 'calc(100vh - 240px)', minHeight: 0 }}>
            <Box sx={{ minHeight: 900 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Editor del informe</Typography>
              <RichTextEditor value={html} onChange={(v) => this.setState({ html: v })} onReady={(inst) => { this.setState({ editorInst: inst }, () => { try { if (this.state.html) inst.value = this.state.html; } catch {} }); }} />
            </Box>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 0, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', minHeight: 0, overflow: 'hidden' }}>
              <Accordion
                expanded={this.state.accordionTemplatesExpanded}
                onChange={(_, exp) => this.setState({ accordionTemplatesExpanded: exp })}
                disableGutters
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '0 0 auto',
                  overflow: 'hidden',
                  // Asegura que el acordeón no crezca ilimitadamente
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ minHeight: 44, '& .MuiAccordionSummary-content': { my: 0 } }}
                >
                  <Typography variant="subtitle2">Plantillas disponibles</Typography>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 300, // ← Altura máxima para activar el scroll
                    minHeight: 0,
                    p: 2,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    // Opcional: estilos de scrollbar personalizados (si deseas)
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-thumb': { 
                      backgroundColor: '#bdbdbd', 
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: '#9e9e9e' }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {this.state.plantillasAll.map((p) => (
                      <Box
                        key={p.id || p.examsId || p.name}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <Box sx={{ mr: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {p.name || 'Sin nombre'}
                          </Typography>
                          {p.description && (
                            <Typography variant="caption" color="text.secondary">
                              {p.description}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => this.setState({ previewPlantilla: p, previewOpen: true })}
                          >
                            Visualizar
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              this.setState({ html: String(p.plantilla || '') }, () => {
                                try {
                                  if (this.state.editorInst) {
                                    this.state.editorInst.value = this.state.html;
                                  }
                                } catch {}
                              });
                            }}
                          >
                            Seleccionar
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={this.state.accordionImagesExpanded} onChange={(_, exp) => this.setState({ accordionImagesExpanded: exp })} disableGutters sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', flex: '1 1 auto' }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 44, '& .MuiAccordionSummary-content': { my: 0 } }}>
                  <Typography variant="subtitle2">Imágenes del estudio</Typography>
                </AccordionSummary>
                <AccordionDetails 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 1 auto',
                    maxHeight: 900,
                    minHeight: 0,
                    p: 1,
                    overflow: 'hidden',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#bdbdbd transparent',
                    '&::-webkit-scrollbar': { width: '10px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { 
                      backgroundColor: '#bdbdbd', 
                      borderRadius: '8px', 
                      border: '2px solid transparent', 
                      backgroundClip: 'content-box' 
                    },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#9e9e9e' }
                  }}
                >


                  <Box sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
                    <ImageList cols={1} gap={8} sx={{ width: '70%', height: '70%' }}>
                      {this.state.images.map((img, idx) => (
                      <ImageListItem key={img.id || `${img.description || 'item'}-${idx}`} sx={{ border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden', p: 1 }}>
                        {img.mimeType?.startsWith('image/') ? (
                          <img src={img.dataUrl || this.buildDataUrlFromItem(img) || this.resolveImageSrc(img)} alt={img.description || ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => this.handleMediaError(idx)} />
                        ) : (
                          <video src={img.dataUrl || this.buildDataUrlFromItem(img) || this.resolveImageSrc(img)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => this.handleMediaError(idx)} />
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Button size="small" variant="outlined" onClick={() => this.setState({ mediaPreviewOpen: true, mediaPreviewItem: img })}>
                            Visualizar
                          </Button>
                          <Button size="small" variant="contained" disabled={!this.state.editorInst} onClick={() => this.insertMediaItem(img)}>
                            Insertar
                          </Button>
                        </Box>
                      </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Paper>
        <Dialog open={this.state.mediaPreviewOpen} onClose={() => this.setState({ mediaPreviewOpen: false, mediaPreviewItem: null })} maxWidth="md" fullWidth>
          <DialogTitle>Vista de archivo</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '2 / 1', bgcolor: '#000', borderRadius: 1 }}>
              {this.state.mediaPreviewItem && this.state.mediaPreviewItem.mimeType?.startsWith('image/') ? (
                <img src={this.state.mediaPreviewItem?.dataUrl || ''} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <video src={this.state.mediaPreviewItem?.dataUrl || ''} controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ mediaPreviewOpen: false, mediaPreviewItem: null })}>Cerrar</Button>
            <Button variant="contained" onClick={() => { const it = this.state.mediaPreviewItem; this.insertMediaItem(it); this.setState({ mediaPreviewOpen: false, mediaPreviewItem: null }); }}>Insertar</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.previewOpen} onClose={() => this.setState({ previewOpen: false, previewPlantilla: null })} maxWidth="lg" fullWidth>
          <DialogTitle>Vista de plantilla</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }} dangerouslySetInnerHTML={{ __html: (this.state.previewPlantilla && this.state.previewPlantilla.plantilla) || '' }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ previewOpen: false, previewPlantilla: null })}>Cerrar</Button>
            <Button variant="contained" onClick={() => {
              const p = this.state.previewPlantilla;
              this.setState({ previewOpen: false, html: String((p && p.plantilla) || '') }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
            }}>Usar esta</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}