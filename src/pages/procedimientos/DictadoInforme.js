import React from 'react';
import { Container, Paper, Breadcrumbs, Link, Box, Typography, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, ImageList, ImageListItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { NavigateNext, Assignment, ExpandMore } from '@mui/icons-material';
import { RichTextEditor } from '../administracion/Plantillas';
import { plantillaService } from 'services/plantillasService';
import { archivodigitalService } from 'services/archivodigitalService';
import { patientsService } from 'services/patientsService';
import { staffService } from 'services/staffService';
import { appointmentsService } from 'services';

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
        instrumento: sp.get('instrumento') || props.instrumento || '',
        aseguradora: sp.get('aseguradora') || props.aseguradora || '',
        preparacion: sp.get('preparacion') || props.preparacion || '',
        personalId: sp.get('personalId') || props.personalId || '-',
        plantilla: '',
        pacientId: sp.get('pacientId') || sp.get('pacienteId') || props.pacientId || '',

        estudioTeminadoId: sp.get('estudioTeminadoId') || sp.get('estudioTeminadoId') || props.estudioTeminadoId || '',
        pdfGeneradoId: sp.get('pdfGeneradoId') || sp.get('pdfGeneradoId') || props.pdfGeneradoId || '',
        estructuraHtml: sp.get('estructuraHtml') || sp.get('estructuraHtml') || props.estructuraHtml || '',
        informePdf: sp.get('informePdf') || sp.get('informePdf') || props.informePdf || '',
        dictadoGuardado: sp.get('dictadoGuardado') || sp.get('dictadoGuardado') || props.dictadoGuardado || '',

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
      imagesLoading: false,
      staffPhoto: null,
      staffFirma: null,
      staffCabeceraPlantilla: null,
      staffLoading: false,
      guardarProcessingOpen: false,
      terminarProcessingOpen: false,
      guardarPayload: null,
      terminarPayload: null,
      lastChangeSource: 'init',
      pacienteInfo: null,
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarSeverity: 'success',
      firmaDisabled: false,
      initialFromSaved: false
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

  toDataUrl = (raw) => {
    try {
      if (!raw) return '';
      const s = String(raw).trim();
      if (s.startsWith('data:')) return s;
      const mime = s.startsWith('/9j/') ? 'image/jpeg' : (s.startsWith('iVBOR') ? 'image/png' : (s.startsWith('R0lGOD') ? 'image/gif' : 'image/jpeg'));
      return `data:${mime};base64,${s.replace(/\s+/g, '')}`;
    } catch { return ''; }
  };

  getTemplateVariableMap = () => {
    const d = this.state.datos || {};
    const extra = this.templateVarExtra || {};
    const cabeceraHtml = this.state.staffCabeceraPlantilla ? `<img src="${this.state.staffCabeceraPlantilla}" style="max-width:100%; max-height:100%; width:auto; height:auto; display:block; margin:auto; object-fit:contain;" />` : '';
    return {
      nombres: d.nombrePaciente || '',
      nombrePaciente: d.nombrePaciente || '',
      numeroEstudio: d.numeroEstudio || '',
      edad: d.edad || '',
      fecha: d.fecha || '',
      fechaEstudio: d.fecha || '',
      estudio: d.estudio || '',
      procedimiento: d.procedimiento || '',
      titulo: d.procedimiento || '',
      medico: d.medico || '',
      instrumento: d.instrumento || '',
      aseguradora: d.aseguradora || '',
      preparacion: d.preparacion || '-',
      cabecera: cabeceraHtml,
      ...extra
    };
  };

  applyTemplateVariables = (tpl) => {
    try {
      const raw = String(tpl || '');
      const map = this.getTemplateVariableMap();
      const norm = {};
      Object.keys(map).forEach((k) => { norm[String(k).toLowerCase()] = map[k]; });
      const hasHclPh = /\{\{\s*(hcl|historiaclinica)\s*\}\}/i.test(raw);
      const hasSexoPh = /\{\{\s*(sexo|genero)\s*\}\}/i.test(raw);
      let out = raw.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (m, k) => {
        const key = String(k).toLowerCase();
        const alias = key === 'hcl' ? 'historiaclinica' : (key === 'sexo' ? 'genero' : key);
        let val = norm[alias];
        if (val === undefined) return m;
        if (alias === 'historiaclinica' || alias === 'genero' || alias === 'sexo') {
          return `<span style="font-weight: normal">${String(val)}</span>`;
        }
        return String(val);
      });
      const hval = norm['historiaclinica'];
      const sval = norm['genero'] !== undefined ? norm['genero'] : norm['sexo'];
      if (!hasHclPh && hval !== undefined) {
        out = out.replace(/<strong>\s*HCL:\s*<\/strong>/i, `<strong>HCL:</strong> <span style="font-weight: normal">${hval}</span>`);
        out = out.replace(/(HCL\s*:\s*)(?!\{)/i, `$1<span style="font-weight: normal">${hval}</span>`);
      }
      if (!hasSexoPh && sval !== undefined) {
        out = out.replace(/<strong>\s*Sexo:\s*<\/strong>/i, `<strong>Sexo:</strong> <span style="font-weight: normal">${sval}</span>`);
        out = out.replace(/(Sexo\s*:\s*)(?!\{)/i, `$1<span style="font-weight: normal">${sval}</span>`);
      }
      if (this.state.staffCabeceraPlantilla) {
        out = out.replace(/src=["']\s*\{\{\s*cabecera\s*\}\}\s*["']/gi, `src="${this.state.staffCabeceraPlantilla}" style="max-width:100%; max-height:100%; width:auto; height:auto; display:block; margin:auto; object-fit:contain;"`);
      }
      if (this.state.firmaDisabled) {
        out = out.replace(/\[##\s*FIRMA_MEDICO\s*##\]/gi, '');
        out = out.replace(/<img([^>]*?)src=["']\s*\[##\s*FIRMA_MEDICO\s*##\]\s*["']([^>]*?)>/gi, '');
      } else if (this.state.staffFirma) {
        out = out.replace(/\[##\s*FIRMA_MEDICO\s*##\]/gi, `<img data-role="firma-inline" src="${this.state.staffFirma}" style="max-width:100%; max-height:100%; width:auto; height:auto; display:block; margin:auto; object-fit:contain;" />`);
        out = out.replace(/<img([^>]*?)src=["']\s*\[##\s*FIRMA_MEDICO\s*##\]\s*["']([^>]*?)>/gi, (m, pre, post) => `<img${pre}src="${this.state.staffFirma}" data-role="firma-inline"${post}>`);
      }
      return out;
    } catch { return String(tpl || ''); }
  };

  registerTemplateVariables = (extra) => {
    try { this.templateVarExtra = { ...(this.templateVarExtra || {}), ...(extra || {}) }; } catch {}
  };

  insertMediaItem = (item) => {
    try {
      const inst = this.state.editorInst;
      if (!inst || !item) return;
      const src = item?.dataUrl || this.buildDataUrlFromItem(item) || this.resolveImageSrc(item);
      if (!src) return;
      const isVideo = String(item.mimeType || item.typeArchive || '').toLowerCase().startsWith('video/');
      if (inst.s && typeof inst.s.focus === 'function') inst.s.focus(); else if (typeof inst.focus === 'function') inst.focus();
      setTimeout(() => {
        try {
          const doc = inst.editorDocument || inst.iframe?.contentWindow?.document || inst.ownerDocument || document;
          let node;
          if (isVideo) {
            const v = doc.createElement('video');
            v.setAttribute('src', src);
            v.setAttribute('controls', 'true');
            v.style.maxWidth = '100%';
            v.style.maxHeight = '100%';
            v.style.display = 'block';
            v.style.margin = '0 auto';
            v.style.objectFit = 'contain';
            node = v;
          } else {
            const img = doc.createElement('img');
            img.setAttribute('src', src);
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            img.style.objectFit = 'contain';
            const fig = doc.createElement('figure');
            fig.style.lineHeight = '0';
            fig.style.margin = '0';
            fig.appendChild(img);
            node = fig;
          }
          if (inst.s && typeof inst.s.insertNode === 'function') { inst.s.insertNode(node); }
          else if (inst.selection && typeof inst.selection.insertNode === 'function') { inst.selection.insertNode(node); }
          else if (inst.s && typeof inst.s.insertHTML === 'function') { inst.s.insertHTML(node.outerHTML); }
          else if (inst.selection && typeof inst.selection.insertHTML === 'function') { inst.selection.insertHTML(node.outerHTML); }
          else if (typeof inst.execCommand === 'function') { inst.execCommand('insertHTML', node.outerHTML); }
          else {
            const sel = doc.getSelection();
            if (sel && sel.rangeCount) {
              const range = sel.getRangeAt(0);
              range.deleteContents();
              range.insertNode(node);
            } else {
              inst.value = (inst.value || '') + node.outerHTML;
            }
          }
          try { inst.events && inst.events.fire && inst.events.fire('change'); } catch {}
        } catch {}
      }, 0);
    } catch {}
  };

  initFirmaWatermarkDrag = () => {
    try {
      if (this.state.firmaDisabled) return;
      const inst = this.state.editorInst;
      if (!inst) return;
      const doc = inst.editorDocument || inst.iframe?.contentDocument || inst.ownerDocument || document;
      const body = doc.body || doc.documentElement;
      body.style.zIndex = 'auto';
      let mark = doc.querySelector('[data-role="firma-watermark"]');
      let handle = doc.querySelector('[data-role="firma-handle"]');
      let resize = doc.querySelector('[data-role="firma-resize"]');
      if (!mark || !handle || !resize) {
        const inline = doc.querySelector('img[data-role="firma-inline"]');
        if (inline) {
          const rect = inline.getBoundingClientRect();
          const brect = body.getBoundingClientRect();
          const left = rect.left - brect.left;
          const top = rect.top - brect.top;
          const wm = doc.createElement('div');
          wm.setAttribute('data-role', 'firma-watermark');
          wm.style.position = 'absolute';
          wm.style.zIndex = '0';
          wm.style.left = left + 'px';
          wm.style.top = top + 'px';
          {
            const rw = rect.width;
            const rh = rect.height;
            const ratio = rw && rh ? (rw / rh) : 1;
            let w = this.state.firmaW && this.state.firmaW > 0 ? this.state.firmaW : null;
            let h = this.state.firmaH && this.state.firmaH > 0 ? this.state.firmaH : null;
            const cellNode = inline.closest ? inline.closest('td,th') : (function(){ let p=inline.parentNode; for(let i=0;i<10 && p;i++){ if(p.tagName==='TD'||p.tagName==='TH') return p; p=p.parentNode;} return null; })();
            const cRect = cellNode && cellNode.getBoundingClientRect ? cellNode.getBoundingClientRect() : null;
            const SMALL_W = 180, SMALL_H = 90;
            const isSmallCell = !!cRect && (cRect.width <= SMALL_W && cRect.height <= SMALL_H);
            if (w && !h) h = Math.round(w / ratio);
            if (h && !w) w = Math.round(h * ratio);
            if (!w || !h) {
              if (!isSmallCell) {
                const baseW = 230;
                const baseH = Math.round(baseW / ratio);
                w = w || baseW;
                h = h || baseH;
              } else {
                w = w || rw;
                h = h || rh;
              }
            }
            wm.style.width = Math.max(40, Math.round(w)) + 'px';
            wm.style.height = Math.max(30, Math.round(h)) + 'px';
          }
          wm.style.pointerEvents = 'none';
          const img = doc.createElement('img');
          img.src = inline.src;

          img.style.objectFit = 'contain';
          img.style.display = 'block';
          img.style.mixBlendMode = 'multiply';
          //img.style.opacity = '0.25';
          wm.appendChild(img);
          const h = doc.createElement('div');
          h.setAttribute('data-role', 'firma-handle');
          h.style.position = 'absolute';
          h.style.zIndex = '999';
          h.style.left = left + 'px';
          h.style.top = top + 'px';
          h.style.width = '14px';
          h.style.height = '14px';
          h.style.background = '#2184be';
          h.style.borderRadius = '0%';
          h.style.cursor = 'move';

          const r = doc.createElement('div');
          r.setAttribute('data-role', 'firma-resize');
          r.style.position = 'absolute';
          r.style.zIndex = '999';
          r.style.width = '12px';
          r.style.height = '12px';
          r.style.background = '#2184be';
          r.style.borderRadius = '2px';
          r.style.cursor = 'se-resize';
          r.style.boxShadow = '0 0 0 2px #fff';
          r.style.left = (left + rect.width - 6) + 'px';
          r.style.top = (top + rect.height - 6) + 'px';

          body.appendChild(wm);
          body.appendChild(h);
          body.appendChild(r);
          inline.style.opacity = '0.001';
          inline.style.pointerEvents = 'none';
          mark = wm;
          handle = h;
          resize = r;
        }
      }
      if (!mark || !handle) return;
      let dragging = false;
      let startX = 0, startY = 0, baseLeft = parseFloat(mark.style.left || '0') || 0, baseTop = parseFloat(mark.style.top || '0') || 0;
      const onDown = (e) => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        baseLeft = parseFloat(mark.style.left || '0') || 0;
        baseTop = parseFloat(mark.style.top || '0') || 0;
        doc.addEventListener('mousemove', onMove);
        doc.addEventListener('mouseup', onUp);
      };
      const onMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const left = baseLeft + dx;
        const top = baseTop + dy;
        mark.style.left = left + 'px';
        mark.style.top = top + 'px';
        handle.style.left = left + 'px';
        handle.style.top = top + 'px';
        if (resize) {
          const rxLeft = left + (parseFloat(mark.style.width || '0') || 0) - 6;
          const rxTop = top + (parseFloat(mark.style.height || '0') || 0) - 6;
          resize.style.left = rxLeft + 'px';
          resize.style.top = rxTop + 'px';
        }
      };
      const onUp = () => {
        dragging = false;
        doc.removeEventListener('mousemove', onMove);
        doc.removeEventListener('mouseup', onUp);
      };
      handle.addEventListener('mousedown', onDown);

      let resizing = false;
      let startRX = 0, startRY = 0, baseW = 0, baseH = 0;
      const onResizeDown = (e) => {
        resizing = true;
        startRX = e.clientX;
        startRY = e.clientY;
        baseW = parseFloat(mark.style.width || '0') || 120;
        baseH = parseFloat(mark.style.height || '0') || 90;
        doc.addEventListener('mousemove', onResizeMove);
        doc.addEventListener('mouseup', onResizeUp);
      };
      const onResizeMove = (e) => {
        if (!resizing) return;
        const dx = e.clientX - startRX;
        const ratio = baseW && baseH ? (baseW / baseH) : 1;
        const scale = Math.max(0.2, (baseW + dx) / Math.max(1, baseW));
        const newW = Math.max(40, Math.round(baseW * scale));
        const newH = Math.max(30, Math.round(newW / ratio));
        mark.style.width = newW + 'px';
        mark.style.height = newH + 'px';
        const left = parseFloat(mark.style.left || '0') || 0;
        const top = parseFloat(mark.style.top || '0') || 0;
        resize.style.left = (left + newW - 6) + 'px';
        resize.style.top = (top + newH - 6) + 'px';
      };
      const onResizeUp = () => {
        resizing = false;
        doc.removeEventListener('mousemove', onResizeMove);
        doc.removeEventListener('mouseup', onResizeUp);
      };
      if (resize) resize.addEventListener('mousedown', onResizeDown);
    } catch {}
  };

  normalizeSavedHtmlMedia = (html) => {
    try {
      const div = document.createElement('div');
      div.innerHTML = String(html || '');
      const fixSrc = (s) => {
        if (!s) return s;
        const v = String(s).trim();
        if (!v) return v;
        if (v.startsWith('data:')) {
          const parts = v.split(',');
          if (parts.length >= 2) {
            const head = parts[0];
            const body = parts.slice(1).join(',').replace(/\s+/g, '');
            return head + ',' + body;
          }
          return v.replace(/\s+/g, '');
        }
        if (v.startsWith('blob:') || v.startsWith('http') || v.startsWith('/')) return v;
        const b = v.replace(/\s+/g, '');
        if (b.startsWith('/9j/')) return 'data:image/jpeg;base64,' + b;
        if (b.startsWith('iVBOR')) return 'data:image/png;base64,' + b;
        if (b.startsWith('R0lGOD')) return 'data:image/gif;base64,' + b;
        if (/^[A-Za-z0-9+/=]+$/.test(b) && b.length > 32) return 'data:image/jpeg;base64,' + b;
        return v;
      };
      div.querySelectorAll('img').forEach((img) => { const ns = fixSrc(img.getAttribute('src')); if (ns) img.setAttribute('src', ns); });
      div.querySelectorAll('video').forEach((vd) => { const ns = fixSrc(vd.getAttribute('src')); if (ns) vd.setAttribute('src', ns); });
      return div.innerHTML;
    } catch { return String(html || ''); }
  };

  getCleanEditorHtml = async () => {
    try {
      const inst = this.state.editorInst;
      const doc = inst && (inst.editorDocument || inst.iframe?.contentWindow?.document || inst.ownerDocument || document);
      const body = doc && doc.body;
      if (!body) return inst && inst.value ? inst.value : (this.state.html || '');
      const wm = body.querySelector('[data-role="firma-watermark"]');
      if (wm && !this.state.firmaDisabled) {
        const rect = wm.getBoundingClientRect();
        const w = parseFloat(wm.style.width || '') || rect.width;
        const h = parseFloat(wm.style.height || '') || rect.height;
        const imgWm = wm.querySelector('img');
        let inline = body.querySelector('img[data-role="firma-inline"]');
        if (!inline && imgWm) {
          inline = doc.createElement('img');
          inline.setAttribute('data-role', 'firma-inline');
          inline.src = imgWm.src || this.state.staffFirma || '';
          inline.style.display = 'block';
          inline.style.margin = '0 auto';
          inline.style.objectFit = 'contain';
          inline.style.maxWidth = '100%';
          inline.style.height = 'auto';
          const target = body.querySelector('td[style*="text-align: center"], th[style*="text-align: center"]') || body;
          target.appendChild(inline);
        }
        if (inline) {
          if (w) inline.style.width = Math.round(w) + 'px';
          if (h) inline.style.height = Math.round(h) + 'px';
          inline.style.opacity = '1';
          inline.style.pointerEvents = 'auto';
        }
      }
      const convertUrlToDataUrl = async (url) => {
        try {
          const resp = await fetch(url);
          const blob = await resp.blob();
          if (!blob) return url;
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(String(reader.result || '').replace(/\s+/g, ''));
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch { return url; }
      };
      const imgs = Array.from(body.querySelectorAll('img'));
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        const src = img.getAttribute('src') || '';
        if (src.startsWith('blob:') || src.startsWith('http') || src.startsWith('//') || src.startsWith('/')) {
          const dataUrl = await convertUrlToDataUrl(src);
          img.setAttribute('src', String(dataUrl || '').replace(/\s+/g, ''));
        }
      }
      const vids = Array.from(body.querySelectorAll('video'));
      for (let i = 0; i < vids.length; i++) {
        const vd = vids[i];
        const src = vd.getAttribute('src') || '';
        if (src.startsWith('blob:')) {
          const dataUrl = await convertUrlToDataUrl(src);
          vd.setAttribute('src', String(dataUrl || '').replace(/\s+/g, ''));
        }
      }
      ['[data-role="firma-watermark"]','[data-role="firma-handle"]','[data-role="firma-resize"]'].forEach((sel) => {
        body.querySelectorAll(sel).forEach((n) => { n.parentNode && n.parentNode.removeChild(n); });
      });
      Array.from(body.querySelectorAll('figure')).forEach((f) => { if (!f.querySelector('img,video,table') && f.textContent.trim() === '') f.parentNode && f.parentNode.removeChild(f); });
      Array.from(body.querySelectorAll('p')).forEach((p) => { if (p.textContent.trim() === '' && !p.querySelector('img,video,table')) p.parentNode && p.parentNode.removeChild(p); });
      const html = body.innerHTML;
      try { if (inst) inst.value = html; } catch {}
      return html;
    } catch { return this.state.html || ''; }
  };

  handleEliminarFirma = () => {
    try {
      const inst = this.state.editorInst;
      const doc = inst && (inst.editorDocument || inst.iframe?.contentWindow?.document || inst.ownerDocument || document);
      const body = doc && doc.body;
      if (!body) return;
      body.querySelectorAll('[data-role="firma-watermark"],[data-role="firma-handle"],[data-role="firma-resize"]').forEach((n) => { n.parentNode && n.parentNode.removeChild(n); });
      body.querySelectorAll('img[data-role="firma-inline"]').forEach((n) => { n.parentNode && n.parentNode.removeChild(n); });
      let html = body.innerHTML;
      html = html.replace(/\[##\s*FIRMA_MEDICO\s*##\]/gi, '');
      html = html.replace(/<img([^>]*?)src=["']\s*\[##\s*FIRMA_MEDICO\s*##\]\s*["']([^>]*?)>/gi, '');
      try { if (inst) { inst.value = html; inst.events && inst.events.fire && inst.events.fire('change'); } } catch {}
      this.setState({ firmaDisabled: true, html: html, lastChangeSource: 'system' });
    } catch {}
  };

  ensureHtml2Pdf = async () => {
    if (window.html2pdf) return window.html2pdf;
    return await new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
      s.onload = () => resolve(window.html2pdf || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
  };

  arrayBufferToBase64 = (buffer) => {
    try {
      const bytes = new Uint8Array(buffer || 0);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    } catch { return ''; }
  };
  
  waitForImages = async (root, timeoutMs = 4000) => {
    try {
      const imgs = Array.from((root || document).querySelectorAll('img'));
      if (imgs.length === 0) return;
      await new Promise((resolve) => {
        let pending = imgs.length;
        const done = () => { if (--pending <= 0) resolve(); };
        setTimeout(resolve, timeoutMs);
        imgs.forEach((img) => {
          if (img.complete) { done(); } else {
            img.addEventListener('load', done);
            img.addEventListener('error', done);
          }
        });
      });
    } catch {}
  };
  
  generatePdfTextBase64 = async (html) => {
    try {
      const h2pdf = await this.ensureHtml2Pdf();
      if (!h2pdf) throw new Error('lib');

      const mmToPx = (mm) => Math.round(mm * 96 / 25.4);
      const pageWidthPx = mmToPx(210);
      const pageHeightPx = mmToPx(297);
      const marginPx = 20;

      const container = document.createElement('div');
      const style = document.createElement('style');
      style.textContent = `@page{size:A4;margin:0} html,body{margin:0;padding:0} .page{width:${pageWidthPx}px;min-height:${pageHeightPx}px;margin:0 auto;background:#fff;color:#333;padding:${marginPx}px} img{max-width:100%;height:auto;display:block} .page table{border-collapse:collapse;table-layout:fixed;width:100%} .page th,.page td{border:1px solid #999} hr{border:0;border-top:1px solid #999} *{-webkit-print-color-adjust:exact; print-color-adjust:exact} *,*::before,*::after{box-sizing:border-box}`;
      container.appendChild(style);
      const page = document.createElement('div');
      page.className = 'page';
      page.innerHTML = String(html || '');
      container.appendChild(page);

      await this.waitForImages(container);

      const isSinglePage = page.scrollHeight <= pageHeightPx;
      const opt = { margin: 0, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['css','legacy'] } };

      return await new Promise((resolve, reject) => {
        h2pdf().from(container).set(opt).toPdf().get('pdf').then((pdf) => {
          try {
            if (isSinglePage && pdf.internal && typeof pdf.internal.getNumberOfPages === 'function') {
              const n = pdf.internal.getNumberOfPages();
              if (n > 1 && typeof pdf.deletePage === 'function') pdf.deletePage(n);
            }
            resolve(pdf.output('datauristring'));
          } catch {
            try { const buf = pdf.output('arraybuffer'); resolve('data:application/pdf;base64,' + this.arrayBufferToBase64(buf)); }
            catch (e) { reject(e); }
          }
        }).catch(reject);
      });
    } catch {
      try {
        const docHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>' + String(html || '') + '</body></html>';
        const b64 = btoa(unescape(encodeURIComponent(docHtml)));
        return 'data:text/html;base64,' + b64;
      } catch { return ''; }
    }
  };

  handleGuardarEstudio = async () => {
    try {
      const inst = this.state.editorInst;
      const contenido = await this.getCleanEditorHtml();
      const pdfText = await this.generatePdfTextBase64(contenido);
      const d = this.state.datos || {};
      const payload = { contenido, numeroEstudio: d.numeroEstudio || '', pacientId: d.pacientId || '', personalId: d.personalId || '', informePdf: pdfText };
      const procedimientoActualizado = await appointmentsService.update_estudio_dictado(d.numeroEstudio, payload);
      console.log('✅ Procedimiento guardado:', procedimientoActualizado);
      this.setState({ snackbarOpen: true, snackbarMessage: 'Dictado guardado correctamente', snackbarSeverity: 'success', datos: { ...d, dictadoGuardado: '1', informePdf: pdfText } });
    } catch (err) {
      this.setState({ snackbarOpen: true, snackbarMessage: 'Error al guardar el dictado', snackbarSeverity: 'error' });
    }
  };

  handleTerminarEstudio = async () => {
    try {
      const inst = this.state.editorInst;
      const contenido = await this.getCleanEditorHtml();
      const d = this.state.datos || {};
      const payload = { contenido, numeroEstudio: d.numeroEstudio || '', pacientId: d.pacientId || '', personalId: d.personalId || '' };
      this.setState({ terminarProcessingOpen: true, terminarPayload: payload });
    } catch {}
  };

  handleDescargarInformePdf = () => {
    try {
      const d = this.state.datos || {};
      let dataUrl = String(d.informePdf || '');
      const fileName = `Informe_${d.numeroEstudio || ''}.pdf`;
      if (!dataUrl) return;
      if (dataUrl.startsWith('data:text/html')) {
        try {
          const parts = dataUrl.split(',');
          const html = decodeURIComponent(escape(atob(parts[1] || '')));
          PdfTools.fromHtml(html, fileName).then((pdfUrl) => PdfTools.download(pdfUrl, fileName));
          return;
        } catch {}
      }
      PdfTools.download(dataUrl, fileName);
    } catch {}
  };

  handleCloseGuardarProcessing = () => { this.setState({ guardarProcessingOpen: false }); };
  handleCloseTerminarProcessing = () => { this.setState({ terminarProcessingOpen: false }); };
  handleCloseSnackbar = () => { this.setState({ snackbarOpen: false }); };

  async componentDidMount() {
    try {
      const res = await plantillaService.getAll();
      const list = Array.isArray(res) ? res : (res?.data || []);
      const dg = String(this.state.datos?.dictadoGuardado || '').trim();
      const savedHtmlRaw = this.state.datos?.estructuraHtml;
      const savedHtml = typeof savedHtmlRaw === 'string' ? savedHtmlRaw.trim() : '';
      if (dg === '1' && savedHtml && savedHtml.toLowerCase() !== 'null') {
        const normalizedSavedHtml = this.normalizeSavedHtmlMedia(savedHtml);
        this.setState({ html: normalizedSavedHtml, plantillasAll: list, templateRaw: '', lastChangeSource: 'system', initialFromSaved: true }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
      } else {
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
        const withVars = this.applyTemplateVariables(picked);
        this.setState({ html: withVars, plantillasAll: list, templateRaw: picked, lastChangeSource: 'system' }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
      }
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

    try {
      const pid = this.state.datos.pacientId;
      if (pid) {
        const resPac = await patientsService.getById(pid);
        const info = (resPac && resPac.data) || null;
        if (info) {
          const nombreCompleto = `${info.names || ''} ${info.lastNames || ''}`.trim();
          const datos = { ...this.state.datos, nombrePaciente: nombreCompleto || this.state.datos.nombrePaciente };
          const gCode = String(info.gender || '');
          const generoLabel = gCode === '10001' ? 'MASCULINO' : 'FEMENINO';
          this.registerTemplateVariables({
            nombres: datos.nombrePaciente,
            nombrePaciente: datos.nombrePaciente,
            documento: info.documentNumber || '',
            genero: generoLabel,
            sexo: generoLabel,
            fechaNacimiento: info.birthdate || '',
            historiaClinica: info.medicalHistory || ''
          });
          if (this.state.initialFromSaved && !this.state.templateRaw) {
            this.setState({ pacienteInfo: info, datos, lastChangeSource: 'system' }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
          } else {
            const baseTpl = this.state.templateRaw || this.state.html || '';
            const updatedHtml = this.applyTemplateVariables(baseTpl);
            this.setState({ pacienteInfo: info, datos, html: updatedHtml, lastChangeSource: 'system' }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
          }
        }
      }
    } catch {}

    try {
      const personalId = this.state.datos.personalId;
      if (personalId && personalId !== '-') {
        this.setState({ staffLoading: true });
        const resStaff = await staffService.getById(personalId);
        const d = (resStaff && resStaff.data) || {};
        const photoUrl = this.toDataUrl(d.photo);
        const firmaUrl = this.toDataUrl(d.firma);
        const headerUrl = this.toDataUrl(d.cabeceraPlantilla);
        this.setState({ staffPhoto: photoUrl || null, staffFirma: firmaUrl || null, staffCabeceraPlantilla: headerUrl || null, staffLoading: false }, () => {
          try {
            if (this.state.initialFromSaved && !this.state.templateRaw) {
              this.setState({ lastChangeSource: 'system' }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
            } else {
              const baseTpl = this.state.templateRaw || this.state.html || '';
              const updatedHtml = this.applyTemplateVariables(baseTpl);
              this.setState({ html: updatedHtml, lastChangeSource: 'system' }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
            }
          } catch {}
        });
      }
    } catch {
      this.setState({ staffLoading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.html !== this.state.html && this.state.editorInst) {
      const from = this.state.lastChangeSource;
      if (from === 'system') {
        try { this.state.editorInst.value = this.state.html || ''; } catch {}
        setTimeout(() => { try { this.initFirmaWatermarkDrag(); } catch {} }, 200);
      }
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
              {/*<div><strong>PDF:</strong> {datos.informePdf}</div>*/}

            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" color="primary" onClick={this.handleGuardarEstudio}>Guardar Dictado</Button>
              <Button variant="contained" color="success" onClick={this.handleDescargarInformePdf} disabled={!this.state.datos?.informePdf}>Descargar PDF</Button>
              {/*<Button variant="contained" color="secondary" onClick={this.handleEliminarFirma}>Eliminar firma</Button>*/}
              <Button variant="contained" color="warning" onClick={this.handleTerminarEstudio} disabled={String(this.state.datos?.dictadoGuardado || '') !== '1'}>Terminar Dictado</Button>
              <Button variant="contained" color="error" onClick={() => window.location.assign('/procedimientos/dictadoproc?refresh=1')}>Cerrar dictado</Button>
            </Box>

          </Box>
        </Paper>

        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gridTemplateRows: { xs: 'auto auto', md: '1fr' }, gap: { xs: 1.5, md: 2 }, height: { xs: 'calc(100vh - 240px)', md: 'calc(100vh - 240px)' }, minHeight: 0, minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Editor del informe</Typography>
              <Box sx={{ flex: '1 1 auto', minHeight: 0, minWidth: 0, overflow: 'auto' }}>
                <RichTextEditor value={html} applyValueUpdates={this.state.lastChangeSource !== 'user'} onChange={(v) => this.setState({ html: v, lastChangeSource: 'user' })} onReady={(inst) => { this.setState({ editorInst: inst }, () => { try { if (this.state.html) inst.value = this.state.html; } catch {} }); }} />
              </Box>
            </Box>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 0, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', minHeight: 0, overflow: 'hidden' }}>
              {/*
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be' }}>
                  Archivos del Personal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                      Foto
                    </Typography>
                    <Box sx={{ width: 120, height: 160, border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {this.state.staffLoading && !this.state.staffPhoto ? (
                        <CircularProgress size={24} />
                      ) : this.state.staffPhoto ? (
                        <img src={this.state.staffPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : null}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                      Cabecera de Plantilla
                    </Typography>
                    <Box sx={{ width: '100%', minWidth: 420, height: 160, border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden', bgcolor: '#fafafa' }}>
                      {this.state.staffCabeceraPlantilla && (
                        <img src={this.state.staffCabeceraPlantilla} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
              */}
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
                    maxHeight: 120, // ← Altura máxima para activar el scroll
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
                              const tpl = String(p.plantilla || '');
                              const withVars = this.applyTemplateVariables(tpl);
                              this.setState({ html: withVars, templateRaw: tpl, lastChangeSource: 'system', initialFromSaved: false }, () => {
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
              const tpl = String((p && p.plantilla) || '');
              const withVars = this.applyTemplateVariables(tpl);
              this.setState({ previewOpen: false, html: withVars, templateRaw: tpl, lastChangeSource: 'system' }, () => { try { if (this.state.editorInst) this.state.editorInst.value = this.state.html; } catch {} });
            }}>Usar esta</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.terminarProcessingOpen} onClose={this.handleCloseTerminarProcessing} maxWidth="sm" fullWidth>
          <DialogTitle>Procesando término</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2">Terminando estudio...</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseTerminarProcessing}>Cerrar</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={3000}
          onClose={this.handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={this.handleCloseSnackbar} severity={this.state.snackbarSeverity} sx={{ width: '100%' }}>
            {this.state.snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export const PdfTools = {
  ensure: async () => {
    if (window.html2pdf) return window.html2pdf;
    return await new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
      s.onload = () => resolve(window.html2pdf || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
  },
  fromHtml: async (html, fileName = 'Informe.pdf', marginPx = 20) => {
    const h2pdf = await PdfTools.ensure();
    if (!h2pdf) throw new Error('lib');
    const mmToPx = (mm) => Math.round(mm * 96 / 25.4);
    const pageWidthPx = mmToPx(210);
    const pageHeightPx = mmToPx(297);
    const container = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `@page{size:A4;margin:0} html,body{margin:0;padding:0} .page{width:${pageWidthPx}px;min-height:${pageHeightPx}px;margin:0 auto;background:#fff;color:#333;padding:${marginPx}px} img{max-width:100%;height:auto;display:block} .page table{border-collapse:collapse;table-layout:fixed;width:100%} .page th,.page td{border:1px solid #999} hr{border:0;border-top:1px solid #999} *{-webkit-print-color-adjust:exact; print-color-adjust:exact} *,*::before,*::after{box-sizing:border-box}`;
    container.appendChild(style);
    const page = document.createElement('div');
    page.className = 'page';
    page.innerHTML = String(html || '');
    container.appendChild(page);
    await new Promise((res) => {
      const imgs = Array.from(container.querySelectorAll('img'));
      if (imgs.length === 0) return res();
      let pending = imgs.length;
      imgs.forEach((img) => {
        if (img.complete) { if (--pending === 0) res(); }
        else { img.onload = img.onerror = () => { if (--pending === 0) res(); }; }
      });
    });
    const isSingle = page.scrollHeight <= pageHeightPx;
    const pdf = await h2pdf().from(container).set({
      margin: 0,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css','legacy'] }
    }).toPdf().get('pdf');
    if (isSingle && pdf.internal && typeof pdf.internal.getNumberOfPages === 'function') {
      const n = pdf.internal.getNumberOfPages();
      if (n > 1 && typeof pdf.deletePage === 'function') pdf.deletePage(n);
    }
    return pdf.output('datauristring');
  },
  download: (dataUrlOrBase64, fileName = 'Informe.pdf') => {
    let url = String(dataUrlOrBase64 || '');
    if (!url) return;
    if (!url.startsWith('data:')) url = 'data:application/pdf;base64,' + url;
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};