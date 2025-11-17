import React from 'react';
import { Container, Paper, Breadcrumbs, Link, Box, Typography, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
      mediaPreviewItem: null
    };
  }

  resolveImageSrc = (item) => {
    const sRaw = item && item.archive ? String(item.archive) : '';
    const t = item && item.typeArchive ? String(item.typeArchive).toLowerCase() : '';
    if (!sRaw) return '';
    if (sRaw.startsWith('data:') || sRaw.startsWith('blob:') || sRaw.startsWith('http') || sRaw.startsWith('/')) return sRaw;
    const mime = this.getMimeFromItem(item);
    const isBase64Likely = sRaw.startsWith('/9j/') || sRaw.startsWith('iVBOR') || sRaw.startsWith('R0lGOD') || /^[A-Za-z0-9+/=]+$/.test(sRaw);
    if (isBase64Likely) return `data:${mime};base64,${sRaw}`;
    const cleanedHex = sRaw.replace(/[^0-9a-fA-F]/g, '');
    const isHex = cleanedHex.length > 16 && /^[0-9a-fA-F]+$/.test(cleanedHex);
    if (isHex) {
      const b64 = this.hexToBase64(cleanedHex);
      return `data:${mime};base64,${b64}`;
    }
    return sRaw;
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

  handleMediaError = (idx) => {
    try {
      const list = [...this.state.images];
      const it = list[idx];
      if (!it) return;
      const mime = this.getMimeFromItem(it);
      const s = String(it.archive || '').replace(/[^0-9a-fA-F]/g, '');
      if (s.length > 16) {
        const b64 = this.hexToBase64(s);
        list[idx] = { ...it, _src: `data:${mime};base64,${b64}` };
        this.setState({ images: list });
      }
    } catch {}
  };

  insertMediaItem = (item) => {
    try {
      const inst = this.state.editorInst;
      if (!inst || !item) return;
      const src = this.resolveImageSrc(item);
      if (!src) return;
      const isVideo = String(item.typeArchive || '').toLowerCase().startsWith('video/');
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
        const resImg = await archivodigitalService.searchByEstudioId(id);
        const imgsRaw = Array.isArray(resImg) ? resImg : (resImg?.data || []);
        const imgs = await Promise.all((imgsRaw || []).map(async (it) => {
          let src = this.resolveImageSrc(it);
          if (!src || src.length < 50) {
            try {
              const d = await archivodigitalService.getById(it.id);
              src = this.resolveImageSrc(d?.data || {});
            } catch {}
          }
          return { ...it, _src: src };
        }));
        this.setState({ images: imgs });
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
            <Box sx={{ minHeight: 400 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Editor del informe</Typography>
              <RichTextEditor value={html} onChange={(v) => this.setState({ html: v })} onReady={(inst) => { this.setState({ editorInst: inst }, () => { try { if (this.state.html) inst.value = this.state.html; } catch {} }); }} />
            </Box>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 0, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', minHeight: 0 }}>
              <Accordion expanded={this.state.accordionTemplatesExpanded} onChange={(_, exp) => this.setState({ accordionTemplatesExpanded: exp })} disableGutters sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', flex: (this.state.accordionImagesExpanded && this.state.accordionTemplatesExpanded) ? '1 1 0' : (this.state.accordionTemplatesExpanded ? '1 1 auto' : '0 0 auto') }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 44, '& .MuiAccordionSummary-content': { my: 0 } }}>
                  <Typography variant="subtitle2">Plantillas disponibles</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {this.state.plantillasAll.map((p) => (
                      <Box key={p.id || p.examsId || p.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ mr: 1 }}>
                          <Typography variant="body2" fontWeight="bold">{p.name || 'Sin nombre'}</Typography>
                          {p.description && <Typography variant="caption" color="text.secondary">{p.description}</Typography>}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" onClick={() => this.setState({ previewPlantilla: p, previewOpen: true })}>Visualizar</Button>
                          <Button size="small" variant="contained" onClick={() => this.setState({ html: String(p.plantilla || '') }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} })}>Seleccionar</Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={this.state.accordionImagesExpanded} onChange={(_, exp) => this.setState({ accordionImagesExpanded: exp })} disableGutters sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', flex: (this.state.accordionImagesExpanded && this.state.accordionTemplatesExpanded) ? '1 1 0' : (this.state.accordionImagesExpanded ? '1 1 auto' : '0 0 auto') }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 44, '& .MuiAccordionSummary-content': { my: 0 } }}>
                  <Typography variant="subtitle2">Imágenes del estudio</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button size="small" variant="contained" disabled={!this.state.selected || !this.state.editorInst} onClick={() => this.insertMediaItem(this.state.selected)}>Insertar</Button>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                    {this.state.images.map((item, idx) => (
                      <Box key={item.id} onClick={() => this.setState({ selected: item })} sx={{ border: (this.state.selected && this.state.selected.id === item.id) ? '2px solid #2184be' : '1px solid #ccc', borderRadius: 1, p: 1, cursor: 'pointer' }}>
                        {(() => { const t = String(item.typeArchive || '').toLowerCase(); const d = String(item.description || '').toLowerCase(); const isVid = t.includes('video') || /\.(mp4|webm|ogg)$/i.test(d); return isVid; })() ? (
                          <video src={item._src || this.resolveImageSrc(item)} controls style={{ width: '100%', height: ITEM_HEIGHT, objectFit: 'contain', borderRadius: 4 }} onError={() => this.handleMediaError(idx)} />
                        ) : (
                          <img src={item._src || this.resolveImageSrc(item)} alt={item.description || ''} style={{ width: '100%', height: ITEM_HEIGHT, objectFit: 'contain', display: 'block', borderRadius: 4 }} loading="lazy" onError={() => this.handleMediaError(idx)} />
                        )}
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>{item.description || item.typeArchive}</Typography>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Paper>
        <Dialog open={this.state.mediaPreviewOpen} onClose={() => this.setState({ mediaPreviewOpen: false, mediaPreviewItem: null })} maxWidth="md" fullWidth>
          <DialogTitle>Vista de archivo</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', bgcolor: '#000', borderRadius: 1 }}>
              {this.state.mediaPreviewItem && String(this.state.mediaPreviewItem.typeArchive || '').toLowerCase().startsWith('video/') ? (
                <video src={this.resolveImageSrc(this.state.mediaPreviewItem)} controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <img src={this.resolveImageSrc(this.state.mediaPreviewItem || {})} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
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