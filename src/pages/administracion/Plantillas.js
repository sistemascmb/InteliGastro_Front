import React, { useState, useCallback, memo, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Search,
  Visibility,
  Description,
  Assignment,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import 'jodit/es2018/jodit.min.css';
import { staffService } from '../../services/staffService';
import { plantillaService }from '../../services/plantillasService';
import { estudiosService } from '../../services/estudiosService';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// Componente de header de sección
const SectionHeader = ({ title }) => (
  <Box
    sx={{
      backgroundColor: '#2184be',
      color: 'white',
      padding: '12px 20px',
      marginBottom: 0,
      borderRadius: '8px 8px 0 0'
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
  </Box>
);

// Componente ResponsiveField memoizado
const ResponsiveField = memo(({ label, children, required = false, sx = {} }) => (
  <Box sx={{ flex: 1, ...sx }}>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 'bold',
        color: '#333',
        mb: 1
      }}
    >
      {label}{required && ' *'}
    </Typography>
    <Box sx={{ width: '100%' }}>
      {children}
    </Box>
  </Box>
));

// Agregar displayName para mejor debugging
ResponsiveField.displayName = 'ResponsiveField';

// Componente FieldRow memoizado
const FieldRow = memo(({ children }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      mb: 3,
      width: '100%'
    }}
  >
    {children}
  </Box>
));

// Agregar displayName para mejor debugging
FieldRow.displayName = 'FieldRow';

const DEFAULT_TEMPLATE_HTML = `<table style="border-collapse: collapse; width: 763px; height: 136px;"><tbody>
<tr>
	<td style="width: 100%; text-align: center; line-height: 1;">{{cabecera}}<br></td></tr></tbody></table><p style="text-align: center; line-height: 1;"><span style="font-size: 16px;"><strong>{{titulo}}</strong></span></p><table style="border-collapse: collapse; width: 100%; line-height: 1;"><tbody>
<tr>
	<td style="width: 62.5%; line-height: 1.1;"><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"> <span style="font-size: 14px;"><strong>Exame</strong><strong>n: </strong>{{numeroEstudio}} <br>   <strong>Instrument</strong>o: {{instrumento}} <br>   <strong>Preparacion</strong>:&nbsp;{{preparacion}}<br>  <strong>Nombre</strong>: {{nombres}}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;      <br> <strong>Edad</strong>: {{edad}}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;    <br> <strong>Asegurador</strong>a: {{aseguradora}} <br>   <strong>Motivo:&nbsp;</strong><br>   <strong>Fecha:</strong> {{fechaEstudio}}</span><br></span></td><td style="width: 37.367%; line-height: 1.1;"><span style="font-family: Arial, Helvetica, sans-serif; font-size: 14px;"><br><br><br><strong>HCL: </strong>{{historiaClinica}}<br><strong>Sexo:</strong>&nbsp;{{sexo}}<br></span></td></tr></tbody></table><br><table style="border-collapse: collapse; width: 762px; height: 220px;"><tbody>
<tr>
	<td style="width: 33.3333%;"><br></td>
	<td style="width: 33.3333%;"><br></td>
	<td style="width: 33.3333%;"><br></td></tr></tbody></table><br><br><table style="border-collapse: collapse; width: 100%; text-align: justify;"><tbody>
<tr>
	<td style="width: 66.3564%; border-color: rgb(61, 133, 198); line-height: 1;"><span style="font-size: 14px;"><strong style="font-family: Arial, Helvetica, sans-serif;">TITULO 1: <br></strong><span style="font-family: Arial, Helvetica, sans-serif;">Texto de contenido para plantillas generales.</span><strong style="font-family: Arial, Helvetica, sans-serif;"><br>TITULO 2: <br></strong><span style="font-family: Arial, Helvetica, sans-serif;">Texto de contenido para plantillas generales.</span><strong style="font-family: Arial, Helvetica, sans-serif;"><br> TITULO 3: Texto de contenido para plantillas generales.<br></strong><strong style="font-family: Arial, Helvetica, sans-serif;"> <br>DIAGNÓSTICO XXXXXXX: <br>  1.ABC&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <br> 2.DEF<br>  3.GHI</strong></span><br></td><td style="width: 33.5106%; text-align: center; vertical-align: middle;">&nbsp;&nbsp;<span style="color: rgb(71, 139, 147); font-size: 14pt;"><strong><span style="color: #000000;"><span style="font-size: 14pt;">[##FIRMA_MEDICO##]</span></span></strong></span><br></td></tr></tbody></table><p>Av. Hoyos Rubio 2397, Cajamarca</p>`;

// Componente Editor de Texto con Jodit
const RichTextEditor = memo(({ value, onChange, placeholder = "Escriba aquí..." }) => {
  const editorRef = React.useRef(null);
  const headerInputRef = React.useRef(null);
  const footerInputRef = React.useRef(null);
  const mmToPx = (mm) => Math.round(mm * 96 / 25.4);
  const pageWidthPx = mmToPx(210);
  const pageHeightPx = mmToPx(297);
  const [pageMargin, setPageMargin] = useState(20);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewHeader, setPreviewHeader] = useState('');
  const [previewFooter, setPreviewFooter] = useState('');
  const [singlePage, setSinglePage] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState(14);

  const variableList = React.useMemo(() => [
    { label: 'Título', value: '{{titulo}}' },
    { label: 'N° Estudio', value: '{{numeroEstudio}}' },
    { label: 'Nombres', value: '{{nombres}}' },
    { label: 'Edad', value: '{{edad}}' },
    { label: 'Sexo', value: '{{sexo}}' },
    { label: 'Instrumento', value: '{{instrumento}}' },
    { label: 'Médico', value: '{{medico}}' },
    { label: 'Historia Clínica', value: '{{historiaClinica}}' },
    { label: 'Aseguradora', value: '{{aseguradora}}' },
    { label: 'Fecha de Estudio', value: '{{fechaEstudio}}' },
    { label: 'Motivo', value: '{{motivo}}' },
    { label: 'Cabecera', value: '{{cabecera}}' },
    { label: 'Pie de Página', value: '{{pie}}' },
    { label: 'Preparación', value: '{{preparacion}}' }
  ], []);

  

  const joditConfig = React.useMemo(() => ({
    readonly: false,
    height: singlePage ? pageHeightPx + pageMargin * 2 : 500,
    width: pageWidthPx,
    toolbar: true,
    toolbarAdaptive: true,
    toolbarSticky: true,
    toolbarButtonSize: 'large',
    buttons: [
      'undo', 'redo', '|',
      'cut', 'copy', 'paste', '|',
      'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'align', 'outdent', 'indent', '|',
      'ul', 'ol', '|',
      'link', 'image', 'video', 'table', 'symbols', 'emoji', '|',
      'hr', 'cleanHtml', 'find', 'selectall', '|',
      'source', 'preview', 'print', 'fullsize'
    ],
    showCharsCounter: true,
    showWordsCounter: true,
    uploader: {
      insertImageAsBase64URI: true
    },
    placeholder,
    language: 'es',
    style: `body{font-family:${fontFamily}; font-size:${fontSize}px; color:#333} h1,h2,h3{color:#1976d2} a{color:#1976d2} blockquote{border-left:4px solid #1976d2; padding-left:8px; color:#555}`,
    iframe: true,
    iframeStyle: `@page{size:A4;margin:${pageMargin}px} html{margin:0;padding:0;min-height:100%;} body{box-sizing:border-box;line-height:1.6;background:#fff;color:#333;position:relative;z-index:2;user-select:auto;outline:none;max-width:${pageWidthPx}px;min-height:${pageHeightPx}px;margin:0 auto;padding:${pageMargin}px;overflow:auto;} @media print{html,body{max-width:none!important;width:auto!important;padding:0!important;margin:0!important;min-height:auto!important;overflow:visible!important;} body::before{display:none!important;}} table{width:100%;border-collapse:collapse;empty-cells:show;max-width:100%;table-layout:fixed;border:1px solid #999;} th,td{vertical-align:top;border:1px solid #999;padding:0;} td p, th p{margin:0;} p:empty{display:none;} p:has(> img:only-child){line-height:0;margin:0;} img+br{display:none;} figure{margin:0;display:flex;justify-content:center;align-items:center;} img{max-width:100%;height:auto;display:block;object-fit:contain;margin:0 auto;} td img, th img{max-width:100%;height:auto;margin:0 auto;} ${showGuides ? `body::before{content:'';position:fixed;z-index:2147483647;top:${pageMargin}px;left:calc(50% - ${pageWidthPx / 2 - pageMargin}px);width:${pageWidthPx - pageMargin * 2}px;height:${pageHeightPx - pageMargin * 2}px;border:1px dashed #999;background:transparent;pointer-events:none;}` : ''}`
  }), [pageMargin, singlePage, showGuides, fontFamily, fontSize]);

  useEffect(() => {
    const inst = editorRef.current?.editor;
    if (!inst) return;

    const removeEnterAfterImage = (node) => {
      try {
        const img = node && (node.tagName === 'IMG' ? node : node.querySelector && node.querySelector('img'));
        if (!img) return;
        img.style.display = 'block';
        img.style.margin = '0 auto';
        img.style.objectFit = 'contain';
        img.style.height = 'auto';
        img.style.maxWidth = '100%';

        const wrap = img.parentElement;
        if (wrap && (wrap.tagName === 'P' || wrap.tagName === 'FIGURE')) {
          if (wrap.childElementCount === 1) {
            wrap.style.lineHeight = '0';
            wrap.style.margin = '0';
          }
        }

        let next = img.nextSibling;
        while (next && (next.nodeName === 'BR' || (next.nodeName === 'P' && next.textContent.trim() === ''))) {
          const rem = next;
          next = next.nextSibling;
          rem.parentNode && rem.parentNode.removeChild(rem);
        }

        const closestCell = img.closest ? img.closest('td,th') : (function (n) {
          while (n && n.nodeType === 1 && n.tagName !== 'TD' && n.tagName !== 'TH') {
            n = n.parentElement;
          }
          return n;
        })(img);
        if (closestCell) {
          const cw = closestCell.clientWidth || 0;
          const ch = closestCell.clientHeight || 0;
          if (cw > 0) img.style.maxWidth = `${cw}px`;
          if (ch > 0) img.style.maxHeight = `${ch}px`;
        }
        let targetCell = closestCell && closestCell.nextElementSibling;
        if (!targetCell && closestCell) {
          const row = closestCell.parentElement;
          if (row && row.nextElementSibling) {
            targetCell = row.nextElementSibling.querySelector('td,th');
          }
        }
        if (targetCell) {
          try {
            if (inst.s && typeof inst.s.setCursorIn === 'function') {
              inst.s.setCursorIn(targetCell, true);
            } else {
              const doc = inst.ownerDocument || document;
              const range = doc.createRange();
              range.selectNodeContents(targetCell);
              range.collapse(true);
              const sel = doc.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } catch {}
        }
      } catch {}
    };

    const normalizeTableInsertion = (node) => {
      try {
        const table = node && (node.tagName === 'TABLE' ? node : node.querySelector && node.querySelector('table'));
        if (!table) return;
        let next = table.nextSibling;
        while (next && (next.nodeName === 'BR' || (next.nodeName === 'P' && next.textContent.trim() === ''))) {
          const rem = next;
          next = next.nextSibling;
          rem.parentNode && rem.parentNode.removeChild(rem);
        }
        table.querySelectorAll('td,th').forEach((cell) => {
          const kids = Array.from(cell.childNodes);
          kids.forEach((ch) => {
            if (ch.nodeType === 1 && ch.nodeName === 'P' && ch.textContent.trim() === '') {
              ch.remove();
            } else if (ch.nodeType === 1 && ch.nodeName === 'BR') {
              ch.remove();
            } else if (ch.nodeType === 3 && ch.textContent.trim() === '') {
              ch.remove();
            }
          });
        });
        const firstCell = table.querySelector('td,th');
        if (firstCell) {
          try {
            if (inst.s && typeof inst.s.setCursorIn === 'function') {
              inst.s.setCursorIn(firstCell, true);
            } else {
              const doc = inst.ownerDocument || document;
              const range = doc.createRange();
              range.selectNodeContents(firstCell);
              range.collapse(true);
              const sel = doc.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } catch {}
        }
      } catch {}
    };

    inst.events && inst.events.on('afterInsertImage', removeEnterAfterImage);
    inst.events && inst.events.on('afterInsertNode', removeEnterAfterImage);
    inst.events && inst.events.on('afterInsertNode', normalizeTableInsertion);

    return () => {
      inst.events && inst.events.off('afterInsertImage', removeEnterAfterImage);
      inst.events && inst.events.off('afterInsertNode', removeEnterAfterImage);
      inst.events && inst.events.off('afterInsertNode', normalizeTableInsertion);
  };
  }, []);

  useEffect(() => {
    const inst = editorRef.current?.editor;
    if (!inst) return;
    if (typeof value === 'string' && value !== inst.value) {
      try {
        const sel = inst.iframe?.contentWindow?.getSelection ? inst.iframe.contentWindow.getSelection() : window.getSelection();
        const anchor = sel && sel.anchorNode;
        const isInside = inst.editor && typeof inst.editor.contains === 'function' ? inst.editor.contains(anchor) : false;
        if (!isInside) {
          inst.value = value || '';
        }
      } catch {
        inst.value = value || '';
      }
    }
  }, [value]);

  const previewHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>@page{size:A4;margin:${pageMargin}px}body{font-family:Arial, sans-serif;color:#333} .page{width:${pageWidthPx}px;min-height:${pageHeightPx}px;margin:0 auto;background:white} .header{margin-bottom:16px;text-align:center} .content{min-height:${pageHeightPx - pageMargin * 2 - 80}px} .footer{position:fixed;bottom:0;left:0;right:0;text-align:center;border-top:1px solid #ddd;padding-top:8px;background:white} table{width:100%;border-collapse:collapse;table-layout:fixed;border:1px solid #999} th,td{vertical-align:top;border:1px solid #999;padding:0} td p, th p{margin:0;} p:empty{display:none;} p:has(> img:only-child){line-height:0;margin:0;} img+br{display:none} figure{margin:0;display:flex;justify-content:center;align-items:center} img{max-width:100%;height:auto;object-fit:contain;display:block;margin:0 auto} @media print{.page{width:auto;min-height:auto;box-shadow:none}} </style></head><body><div class="page"><div class="header">${previewHeader || ''}</div><div class="content">${value || ''}</div></div><div class="footer">${previewFooter || ''}</div></body></html>`;

  const handlePrint = () => {
    const win = window.open('');
    if (!win) return;
    win.document.write(previewHtml);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          show = "false"
          size="small"
          type="number"
          label="Margen"
          value={pageMargin}
          disabled
          sx={{ width: 60 }}
        />
        {/*<Button variant="outlined" size="small" onClick={() => setOpenPreview(true)}>Vista previa</Button>*/}
        <FormControlLabel control={<Checkbox checked={singlePage} onChange={(e) => setSinglePage(e.target.checked)} disabled />} label="" />
        {/*  Una página
        <FormControlLabel control={<Checkbox checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} />} label="Guías" />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} displayEmpty>
            <MenuItem value={'Arial, sans-serif'}>Arial</MenuItem>
            <MenuItem value={'Roboto, Arial, sans-serif'}>Roboto</MenuItem>
            <MenuItem value={'"Times New Roman", serif'}>Times New Roman</MenuItem>
            <MenuItem value={'Calibri, Arial, sans-serif'}>Calibri</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} displayEmpty>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={14}>14</MenuItem>
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={18}>18</MenuItem>
          </Select>
        </FormControl>*/}
        {variableList.map((v) => (
          <Chip
            key={v.value}
            label={v.label}
            size="small"
            color="secondary"
            onClick={() => {
              try {
                const active = document.activeElement;
                if (headerInputRef.current && active === headerInputRef.current) {
                  const el = headerInputRef.current;
                  const start = typeof el.selectionStart === 'number' ? el.selectionStart : (previewHeader?.length || 0);
                  const end = typeof el.selectionEnd === 'number' ? el.selectionEnd : start;
                  const newVal = (previewHeader || '').slice(0, start) + v.value + (previewHeader || '').slice(end);
                  setPreviewHeader(newVal);
                  setTimeout(() => {
                    el.focus();
                    const pos = start + v.value.length;
                    if (typeof el.setSelectionRange === 'function') el.setSelectionRange(pos, pos);
                  }, 0);
                  return;
                }
                if (footerInputRef.current && active === footerInputRef.current) {
                  const el = footerInputRef.current;
                  const start = typeof el.selectionStart === 'number' ? el.selectionStart : (previewFooter?.length || 0);
                  const end = typeof el.selectionEnd === 'number' ? el.selectionEnd : start;
                  const newVal = (previewFooter || '').slice(0, start) + v.value + (previewFooter || '').slice(end);
                  setPreviewFooter(newVal);
                  setTimeout(() => {
                    el.focus();
                    const pos = start + v.value.length;
                    if (typeof el.setSelectionRange === 'function') el.setSelectionRange(pos, pos);
                  }, 0);
                  return;
                }
                const inst = editorRef.current?.editor;
                if (!inst) return;
                if (inst.s && typeof inst.s.focus === 'function') inst.s.focus();
                else if (typeof inst.focus === 'function') inst.focus();
                setTimeout(() => {
                  try {
                    if (inst.s && typeof inst.s.insertHTML === 'function') {
                      inst.s.insertHTML(v.value);
                      return;
                    }
                    if (inst.selection && typeof inst.selection.insertHTML === 'function') {
                      inst.selection.insertHTML(v.value);
                      return;
                    }
                    if (typeof inst.execCommand === 'function') {
                      inst.execCommand('insertHTML', v.value);
                      return;
                    }
                    const doc = inst.editorDocument || inst.ownerDocument || document;
                    const sel = doc.getSelection();
                    if (sel && sel.rangeCount) {
                      const range = sel.getRangeAt(0);
                      range.deleteContents();
                      range.insertNode(doc.createTextNode(v.value));
                    } else {
                      inst.value = (inst.value || '') + v.value;
                    }
                  } catch {}
                }, 0);
              } catch {}
            }}
            sx={{ cursor: 'pointer' }}
          />
        ))}
        
      </Box>
      <Box sx={{ width: `${pageWidthPx}px`, minHeight: `${pageHeightPx}px`, bgcolor: 'white', mx: 'auto', boxShadow: 2, p: 0 }}>
        <JoditEditor
          ref={editorRef}
          config={joditConfig}
          onChange={(content) => onChange?.(content)}
        />
      </Box>
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Vista previa</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField label="Cabecera" value={previewHeader} onChange={(e) => setPreviewHeader(e.target.value)} fullWidth size="small" inputRef={headerInputRef} />
            <TextField label="Pie de página" value={previewFooter} onChange={(e) => setPreviewFooter(e.target.value)} fullWidth size="small" inputRef={footerInputRef} />
          </Box>
          <Box sx={{ border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
            <iframe title="preview" srcDoc={previewHtml} style={{ width: '100%', minHeight: `${pageHeightPx + pageMargin * 2}px`, border: 'none' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Cerrar</Button>
          <Button onClick={handlePrint} variant="contained">Imprimir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

const Plantillas = () => {
  const navigate = useNavigate();

  // Lista de personal para asignaciones
  const [personalList] = useState([
    { id: 1, name: 'Dr. Juan Pérez' },
    { id: 2, name: 'Dra. María García' },
    { id: 3, name: 'Dr. Carlos López' },
    { id: 4, name: 'Dra. Ana Martínez' }
  ]);

  // Lista de plantillas de procedimientos
  const [procedimientosPlantillas] = useState([
    'Videoendoscopia digestiva alta',
    'Colonoscopia corta',
    'Colonoscopia completa',
    'Rectosigmoidoscopia',
    'Endoscopia terapéutica',
    'Polipectomía',
    'Biopsia endoscópica'
  ]);

  // Estado para la lista de plantillas
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [PersonalD, setPersonalCargados] = useState([]);
  const [EstudiosD, setEstudiosCargados] = useState([]);
  const [filteredPlantillasN, setFilteredPlantillas] = useState([]);

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);

const cargarPersonal = async () => {
          try {
            const responseSystemParameter = await staffService.getAll();
            console.log('✅ Respuesta de Personal:', responseSystemParameter);
            setPersonalCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Personal:', error);
            setError(`Error al cargar Personal: ${error.message}`);
          }
        };

  const cargarEstudios = async () => {
          try {
            const responseSystemParameter = await estudiosService.getAll();
            console.log('✅ Respuesta de Estudios:', responseSystemParameter);
            setEstudiosCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Estudios:', error);
            setError(`Error al cargar Estudios: ${error.message}`);
          }
        };

  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    plantilla: '',
    personalId : '',
    examsId: '',
    status: true,
    allPersonalMed: '',

    tipo: 'plantilla',
    asignadoA: 'todos',
    personalSeleccionado: [],
    plantillaProcedimiento: '',
    plantillaCabecera: '',
  });

  const [editFormData, setEditFormData] = useState({
      name: '',
      description: '',
      plantilla: '',
      personalId : '',
      examsId: '',
      status: true,
      allPersonalMed: '',

      asignadoA: 'todos',
      tipo: 'cabecera',
      personalSeleccionado: [],
      plantillaProcedimiento: '',
      plantillaCabecera: '',
    });

  const [errors, setErrors] = useState({});
  const [selectAllPersonal, setSelectAllPersonal] = useState(false);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Estado para subtabs de creación
  const [createTab, setCreateTab] = useState(0);

  const [useDefaultTemplateCreate, setUseDefaultTemplateCreate] = useState(false);
  const [useDefaultTemplateEdit, setUseDefaultTemplateEdit] = useState(false);

  const loadPlantillas = async () => {
      try {
        setLoading(true);
        setError('');
  
        console.log('🔄 Cargando Plantillas desde el backend...');
        const response = await plantillaService.getAll();
        
        if (!response || !response.data) {
          throw new Error('No se recibieron datos de plantillas válidos');
        }
  
        const plantillasListCarga = await Promise.all(
          (response.data || []).map(async (plantillas) => {
            try {
              if (plantillas?.personalId && plantillas.personalId !== -1) {
                const personalDatos = await staffService.getById(plantillas.personalId);
                const estudios = await estudiosService.getById(plantillas.examsId);

                return {
                  ...plantillas,
                  nombrePersonal: personalDatos?.data?.nombres && personalDatos?.data?.apellidos
                    ? `${personalDatos.data.nombres} ${personalDatos.data.apellidos}`
                    : 'Sin asignar',
                  nombreEstudios: estudios?.data?.name 
                    ? `${personalDatos.data.name}`
                    : 'Sin asignar',
                    fechaCreacion: plantillas.createdAt
                };
              }
              return {
                ...plantillas,
                nombrePersonal: plantillas.personalId === -1 ? 'Todos' : 'Sin asignar',
                nombreEstudios: plantillas.examsId === -1 ? 'Todos' : 'Sin asignar',
              };
            } catch (error) {
              console.error(`Error al obtener personal ${plantillas?.personalId}:`, error);
                              return {
                                 ...(plantillas || {}),
                                 nombrePersonal: 'Error al cargar personal',
                                 nombreEstudios: 'Error al cargar estudios',
                              };
                            }
                          })
                        );
  
  
        setPlantillas(plantillasListCarga);
        setFilteredPlantillas(plantillasListCarga);
        console.log('✅ Plantillas cargados:', plantillasListCarga);
      } catch (error) {
        console.error('❌ Error al cargar Plantillas:', error);
        setError(`Error al cargar Plantillas: ${error.message}`);
        setPlantillas([]);
        setFilteredPlantillas([]);
      } finally {
        setLoading(false);
      }
          };
    useEffect(() => {
  const cargarDatosIniciales = async () => {
        setLoading(true);
        try {
          await Promise.all([
            loadPlantillas(),
            cargarPersonal(),
            cargarEstudios(),

          ]);
          
        } catch (error) {
          console.error('❌ Error al cargar datos iniciales:', error);
          setError(`Error al cargar datos iniciales: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };
  
      cargarDatosIniciales();
    }, []);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      name: '',
      description: '',
      plantilla: '',
      personalId : '',
      examsId: '',
      status: true,
      allPersonalMed: '',

      asignadoA: 'todos',
      tipo: 'cabecera',
      personalSeleccionado: [],
      plantillaProcedimiento: '',
      plantillaCabecera: '',
    });
    setErrors({});
    setSelectAllPersonal(false);

  };

  

  // Función genérica para manejar cambios en campos de texto
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleEditInputChange = useCallback((field, value) => {
            setEditFormData(prev => ({ ...prev, [field]: value }));
            // Limpiar error si existe
            if (errors[field]) {
              setErrors(prev => ({ ...prev, [field]: '' }));
            }
    }, [errors]);

    const MemoizedTextField = memo(({
        value,
        onChange,
        error,
        helperText,
        ...props
      }) => (
        <TextField
          {...props}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          size="small"
        />
      ));
    
     MemoizedTextField.displayName = 'MemoizedTextField';

  // Función para manejar cambios en asignación de personal
  const handlePersonalChange = useCallback((personalId) => {
    setFormData(prev => ({
      ...prev,
      personalSeleccionado: prev.personalSeleccionado.includes(personalId)
        ? prev.personalSeleccionado.filter(id => id !== personalId)
        : [...prev.personalSeleccionado, personalId]
    }));
        setSelectAllPersonal(value.length === personales.length);

  }, []);

  // Función para seleccionar/deseleccionar todo el personal
  //const handleSelectAllPersonal = useCallback((selectAll) => {
  //  setFormData(prev => ({
  //    ...prev,
  //    personalSeleccionado: selectAll ? personalList.map(p => p.id) : []
  //  }));
  //}, [personalList]);

  const handleSelectAllPersonal = (event) => {
    const checked = event.target.checked;
    setSelectAllPersonal(checked);

    if (checked) {
      // Si se marca "Seleccionar todos", limpiamos la selección de personal y establecemos selectAll en true
      setFormData(prev => ({
        ...prev,
        asignadoIds: [],
        personalId: '',
        allPersonalMed: true
      }));
    } else {
      // Si se desmarca, solo reseteamos selectAll
      setFormData(prev => ({
        ...prev,
        allPersonalMed: false
      }));
    }

    // Limpiar error si existe
    if (errors.asignadoIds) {
      setErrors(prev => ({ ...prev, asignadoIds: '' }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre es obligatorio';
    }

    //if (formData.tipo === 'plantilla') {
      if (!formData.description.trim()) {
        newErrors.description = 'Descripción es obligatoria';
      }
     
      if (!formData.plantilla.trim()) {
        newErrors.plantilla = 'Contenido de la plantilla es obligatorio';
      }
    //} else {
    //  if (!formData.plantillaCabecera.trim()) {
    //    newErrors.plantillaCabecera = 'Contenido de la cabecera es obligatorio';
    // }
    

    //if (formData.asignadoA === 'seleccionar' && formData.personalSeleccionado.length === 0) {
    // newErrors.personalSeleccionado = 'Debe seleccionar al menos un miembro del personal';
    //}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.name.trim()) {
      newErrors.name = 'Nombre es obligatorio';
    }

    //if (formData.tipo === 'plantilla') {
      if (!editFormData.description.trim()) {
        newErrors.description = 'Descripción es obligatoria';
      }
      
      if (!editFormData.plantilla.trim()) {
        newErrors.plantilla = 'Contenido de la plantilla es obligatorio';
      }
    //} else {
    //  if (!formData.plantillaCabecera.trim()) {
    //    newErrors.plantillaCabecera = 'Contenido de la cabecera es obligatorio';
    // }
    

    //if (formData.asignadoA === 'seleccionar' && formData.personalSeleccionado.length === 0) {
    //  newErrors.personalSeleccionado = 'Debe seleccionar al menos un miembro del personal';
    //}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  // Funciones para manejar modales
  const handleOpenEditModal = (plantilla) => {
    setSelectedPlantilla(plantilla);

    const allPersonalMed = plantilla.personalId === -1;
    const initialFormData = {
      name: plantilla.name,
      description: plantilla.description,
      personalId: allPersonalMed ? '' : plantilla.personalId,
      plantilla: plantilla.plantilla,
      allPersonalMed: allPersonalMed,
      examsId: plantilla.examsId,
    };
    setEditFormData(initialFormData);
    setSelectAllPersonal(allPersonalMed);
    setOpenEditModal(true);


    {/*setFormData({
      tipo: plantilla.tipo,
      name: plantilla.name,
      description: plantilla.description || '',
      asignadoA: plantilla.asignadoA === 'todos' ? 'todos' : 'seleccionar',
      personalSeleccionado: Array.isArray(plantilla.asignadoA) ? plantilla.asignadoA : [],
      plantillaProcedimiento: plantilla.plantillaProcedimiento || '',
      plantillaCabecera: plantilla.plantillaCabecera || '',
      plantilla: plantilla.plantilla || ''
    });
    setOpenEditModal(true);*/}
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedPlantilla(null);
    setSelectAllPersonal(false);
    setEditFormData({
      templatesid: '',
      name: '',
      description: '',
      personalId: '',
      plantilla: '',
      allPersonalMed: false,
      examsId:'',
    });
    setErrors({});
  };

  const handleOpenDeleteConfirm = (plantilla) => {
    setSelectedPlantilla(plantilla);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedPlantilla(null);
  };

  const handleOpenDetailsModal = (plantilla) => {
    setSelectedPlantilla(plantilla);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedPlantilla(null);
  };

  // Función para crear plantilla
  const handleCreatePlantilla = async (e) => {
    //if (e && typeof e.preventDefault === 'function') e.preventDefault();
              e.preventDefault();
    
            if (validateForm()) {
              try {
                setLoading(true);
                console.log('📤 Creando Plantilla...');
        
                // Asegurarse de que estado sea un ID numérico
                const plantillaData = {
                  ...formData,
                  personalId: formData.personalId === "" ? -1 : formData.personalId 
                };
        
                const nuevoPlantilla = await plantillaService.create(plantillaData);
                console.log('✅ Plantilla creado:', nuevoPlantilla);
        
                // Recargar la lista de Plantilla
                await loadPlantillas();
        
                clearForm();
                // Cambiar automáticamente al tab de lista
                setActiveTab(0);
        
              } catch (error) {
                console.error('❌ Error al crear Plantilla:', error);
                setError(`Error al crear Plantilla: ${error.message}`);
              } finally {
                setLoading(false);
              }
            }
          };
  {/*
  const handleCreatePlantilla = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newPlantilla = {
        id: Math.max(...plantillas.map(p => p.id)) + 1,
        tipo: formData.tipo,
        name: formData.name.trim(),
        description: formData.description.trim(),
        asignadoA: formData.asignadoA === 'todos' ? 'todos' : formData.personalSeleccionado,
        plantillaProcedimiento: formData.plantillaProcedimiento,
        plantillaCabecera: formData.plantillaCabecera,
        plantilla: formData.plantilla,
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'Sistema'
      };

      setPlantillas(prev => [...prev, newPlantilla]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };
*/}
  // Función para editar plantilla
  const handleEditPlantilla = async (e) => {
            e.preventDefault();
        
            if (validateEditForm()) {
              try {
                setLoading(true);
                console.log('📤 Editando Plantilla...');
        
                // Asegurarse de que estado sea un booleano
                const formDataToSend = {
                  ...editFormData,
                  personalId: editFormData.allPersonalMed === true ? -1 : editFormData.personalId 
                };
                const salaActualizado = await plantillaService.update(selectedPlantilla.id, formDataToSend);
                console.log('✅ Plantilla actualizado:', salaActualizado);
        
                // Recargar la lista de Plantilla
                await loadPlantillas();
        
                handleCloseEditModal();
        
              } catch (error) {
                console.error('❌ Error al editar Plantilla:', error);
                setError(`Error al editar Plantilla: ${error.message}`);
              } finally {
                setLoading(false);
              }
            }
          };
  
  {/*const handleEditPlantilla = (e) => {
    e.preventDefault();

    if (validateEditForm()) {
      setPlantillas(prev => prev.map(p =>
        p.id === selectedPlantilla.id
          ? {
              ...p,
              tipo: formData.tipo,
              name: formData.name.trim(),
              description: formData.description.trim(),
              asignadoA: formData.asignadoA === 'todos' ? 'todos' : formData.personalSeleccionado,
              plantillaProcedimiento: formData.plantillaProcedimiento,
              plantillaCabecera: formData.plantillaCabecera,
              plantilla: formData.plantilla,
            }
          : p
      ));
      handleCloseEditModal();
    }
  };
*/}
  // Función para eliminar plantilla
  const handleDeletePlantilla = async () => {
            try {
              setLoading(true);
              console.log('📤 Eliminando Plantilla...');
        
              await plantillaService.delete(selectedPlantilla.id);
              console.log('✅ Plantilla eliminado');
        
              // Recargar la lista de Plantilla
              await loadPlantillas();
        
              handleCloseDeleteConfirm();
        
            } catch (error) {
              console.error('❌ Error al eliminar Plantilla:', error);
              setError(`Error al eliminar Plantilla: ${error.message}`);
            } finally {
              setLoading(false);
            }
          };

  // Filtrar plantillas basado en la búsqueda
  const filteredPlantillas = plantillas.filter(plantilla =>
    plantilla.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plantilla.description && plantilla.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para obtener el color del tipo
  const getTipoColor = (tipo) => {
    return tipo === 'cabecera' ? 'warning' : 'success';
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener texto de asignación
  const getAsignacionTexto = (asignadoA) => {
    if (asignadoA === 'todos') {
      return 'Todos';
    } else if (Array.isArray(asignadoA)) {
      const nombres = asignadoA.map(id => personalList.find(p => p.id === id)?.name || 'Desconocido');
      return nombres.join(', ');
    }
    return 'No asignado';
  };

  // Función para cambiar tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Función para cambiar subtab de creación
  const handleCreateTabChange = (event, newValue) => {
    setCreateTab(newValue);
    setFormData(prev => ({
      ...prev,
      tipo: newValue === 0 ? 'cabecera' : 'plantilla'
    }));
    setErrors({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1, px: 2, maxWidth: '100% !important' }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          Inicio
        </Link>
        <Typography color="text.primary">Plantillas</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none' }}
        >
          Regresar
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Plantillas
        </Typography>
      </Box>

      {/* Tabs Deslizables */}
      <Paper sx={{ boxShadow: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              minHeight: '60px'
            }
          }}
        >
          <Tab
            label="Lista de Plantillas"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab
            label="Crear Plantilla"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Plantilla */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            {/* Subtabs para tipos de plantilla */}
            {/*<Paper sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
              <Tabs
                value={createTab}
                onChange={handleCreateTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'bold',
                    minHeight: '50px'
                  }
                }}
              >
                <Tab
                  label="Crear Cabecera de Reporte"
                  icon={<Description />}
                  iconPosition="start"
                />
                <Tab
                  label="Crear Plantilla"
                  icon={<Assignment />}
                  iconPosition="start"
                />
              </Tabs>
            </Paper>*/}

            <form onSubmit={handleCreatePlantilla}>
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  {createTab === 1 ? 'Información de Cabecera de Reporte' : 'Información de Plantilla'}
                </Typography>

                {/* Campos comunes */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder={createTab === 1 ? "Ej: Cabecera CMB Gastroenterología" : "Ej: Plantilla Endoscopia"}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Campo descripción solo para plantillas */}
                {createTab === 0 && (
                  <FieldRow>
                    <ResponsiveField label="Descripción" required>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={2}
                        placeholder="Descripción de la plantilla"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                        size="small"
                      />
                    </ResponsiveField>
                  </FieldRow>
                )}

                <FieldRow>
                  <ResponsiveField label="Asignar a Personal" required sx={{ flex: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={formData.allPersonalMed}
                            checked={selectAllPersonal}
                            onChange={handleSelectAllPersonal}
                            
                            color="primary"
                          />
                        }
                        label="Seleccionar todos"
                      />
                    </Box>

                    <FormControl fullWidth required error={!!errors.personalId} size="small">
                      <Select
                        value={formData.personalId}
                        onChange={(e) => handleInputChange('personalId', e.target.value)}
                        disabled={selectAllPersonal}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                          color: formData.personalId ? '#000' : '#999'
                          }
                        }}
                      >
                      <MenuItem value="">Seleccionar personal</MenuItem>
                      {Array.isArray(PersonalD) && PersonalD.map(personal => (
                        <MenuItem key={personal.id} value={personal.id}>
                          {personal.nombres + ' ' + personal.apellidos || ''}
                        </MenuItem>
                      ))}
                      </Select>
                    </FormControl>
                     
                    {errors.asignadoIds && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.asignadoIds}
                      </Typography>
                    )}
                  </ResponsiveField>
                </FieldRow>

                {/* Asignación de personal 
                <FieldRow>
                  <ResponsiveField label="Asignar a" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.nombrePersonal}
                        onChange={(e) => handleInputChange('asignadoA', e.target.value)}
                      >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="seleccionar">Seleccionar personal</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                
                {/* Selección de personal específico 
                {formData.asignadoA === 'seleccionar' && (
                  <FieldRow>
                    <ResponsiveField label="Personal seleccionado" required>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, maxHeight: '200px', overflow: 'auto' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.personalSeleccionado.length === personalList.length}
                              indeterminate={formData.personalSeleccionado.length > 0 && formData.personalSeleccionado.length < personalList.length}
                              onChange={(e) => handleSelectAllPersonal(e.target.checked)}
                            />
                          }
                          label="Seleccionar todos"
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        />
                        {personalList.map((personal) => (
                          <FormControlLabel
                            key={personal.id}
                            control={
                              <Checkbox
                                checked={formData.personalSeleccionado.includes(personal.id)}
                                onChange={() => handlePersonalChange(personal.id)}
                              />
                            }
                            label={personal.name}
                            sx={{ display: 'block', ml: 2 }}
                          />
                        ))}
                      </Box>
                      {errors.personalSeleccionado && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.personalSeleccionado}
                        </Typography>
                      )}
                    </ResponsiveField>
                  </FieldRow>
                )}*/}

                {/* Campo plantilla de procedimiento solo para plantillas 
                {createTab === 0 && (*/}
                  <FieldRow>
                    <ResponsiveField label="Plantilla por defecto del Procedimiento" required>
                      <FormControl fullWidth size="small" error={!!errors.examsId}>
                        <Select
                          value={formData.examsId}
                          onChange={(e) => handleInputChange('examsId', e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">Seleccionar procedimiento para plantilla.</MenuItem>
                          {Array.isArray(EstudiosD) && EstudiosD.map(plantilla => (
                              <MenuItem key={plantilla.id} value={plantilla.id}>
                              {plantilla.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                    </ResponsiveField>
                  </FieldRow>
                

                {/*{createTab === 0 && (*/}
                  <FieldRow>
                    <FormControlLabel
                      control={<Switch checked={useDefaultTemplateCreate} onChange={(e) => {
                        const checked = e.target.checked;
                        setUseDefaultTemplateCreate(checked);
                        handleInputChange('plantilla', checked ? DEFAULT_TEMPLATE_HTML : '');
                      }} />}
                      label="Plantilla predeterminada"
                    />
                  </FieldRow>
                {/*)}*/}

                {/* Editor de texto rico */}
                <FieldRow>
                  <ResponsiveField
                    label={createTab === 1 ? "Plantilla de cabecera del Reporte" : "Contenido de la Plantilla"}
                    required
                  >
                    <RichTextEditor
                      value={createTab === 1 ? formData.plantillaCabecera : formData.plantilla}
                      onChange={(value) => handleInputChange(createTab === 1 ? 'plantillaCabecera' : 'plantilla', value)}
                      placeholder={createTab === 1 ? "Diseñe la cabecera del reporte..." : "Diseñe el contenido de la plantilla..."}
                    />
                    {((createTab === 1 && errors.plantillaCabecera) || (createTab === 1 && errors.plantilla)) && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {createTab === 1 ? errors.plantillaCabecera : errors.plantilla}
                      </Typography>
                    )}
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Botón de Crear */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  size="large"
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    },
                    minWidth: '200px',
                    py: 1.5
                  }}
                >
                  {createTab === 1 ? 'Crear Cabecera' : 'Crear Plantilla'}
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Plantillas */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por name, descripción o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: '#666', mr: 1 }} />
                  ),
                }}
                sx={{
                  maxWidth: '500px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                    }
                  }
                }}
              />
              {searchTerm && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {filteredPlantillas.length} resultado(s) de {plantillas.length} plantillas
                </Typography>
              )}
            </Box>

            {/* Tabla de Plantillas */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Plantillas" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Asignado a</strong></TableCell>
                      <TableCell><strong>Fecha de Creación</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPlantillas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron plantillas que coincidan con la búsqueda' : 'No hay plantillas registradas'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlantillas.map((plantilla) => (
                      <TableRow key={plantilla.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {plantilla.name}
                          </Typography>
                          {plantilla.description && (
                            <Typography variant="caption" color="text.secondary">
                              {plantilla.description.length > 50
                                ? `${plantilla.description.substring(0, 50)}...`
                                : plantilla.description
                              }
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={plantilla.tipo === 'cabecera' ? 'Cabecera' : 'Plantilla'}
                            color={getTipoColor(plantilla.tipo)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {plantilla?.personalId === -1 ? (
                              <Chip
                                label="Todos"
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              ) : (
                                <Chip
                                  label={plantilla?.nombrePersonal || 'Sin asignar'} 
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(plantilla.fechaCreacion)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailsModal(plantilla)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(plantilla)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(plantilla)}
                            title="Eliminar"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Modal para Editar Plantilla */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2184be',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight="bold">Editar Plantilla</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditPlantilla}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información de la Plantilla
              </Typography>

              {/* Campos del formulario de edición 
              <FieldRow>
                <ResponsiveField label="Tipo">
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.tipo}
                      onChange={(e) => handleInputChange('tipo', e.target.value)}
                    >
                      <MenuItem value="cabecera">Cabecera de Reporte</MenuItem>
                      <MenuItem value="plantilla">Plantilla</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>*/}

              <FieldRow>
                <ResponsiveField label="Nombre" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Nombre de la plantilla"
                    value={editFormData.name}
                    onChange={(e) => handleEditInputChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Descripción" required>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={2}
                      placeholder="Descripción de la plantilla"
                      value={editFormData.description}
                      onChange={(e) => handleEditInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
              
              <FieldRow>
                                <ResponsiveField label="Asignar a Personal" required sx={{ flex: 1 }}>
                                  <Box sx={{ mb: 1 }}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={editFormData.allPersonalMed || false}
                                          onChange={(e) => {
                                            setEditFormData({
                                              ...editFormData,
                                              allPersonalMed: e.target.checked,
                                              personalId: e.target.checked ? '' : editFormData.personalId
                                            });
                                            setSelectAllPersonal(e.target.checked);
                                          }}
                                          color="primary"
                                        />
                                      }
                                      label="Seleccionar todos"
                                    />
                                  </Box>
              
                                  <FormControl fullWidth required error={!!errors.personalId} size="small">
                                    <Select
                                      value={editFormData.personalId}
                                      onChange={(e) => handleEditInputChange('personalId', e.target.value)}
                                      disabled={selectAllPersonal}
                                      displayEmpty
                                      sx={{
                                        '& .MuiSelect-select': {
                                        color: editFormData.personalId ? '#000' : '#999'
                                        }
                                      }}
                                    >
                                    <MenuItem value="">Seleccionar personal</MenuItem>
                                    {Array.isArray(PersonalD) && PersonalD.map(personal => (
                                      <MenuItem key={personal.id} value={personal.id}>
                                        {personal.nombres + ' ' + personal.apellidos || ''}
                                      </MenuItem>
                                    ))}
                                    </Select>
                                  </FormControl>
              
                                  {errors.asignadoIds && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                      {errors.asignadoIds}
                                    </Typography>
                                  )}
                                </ResponsiveField>
                              </FieldRow>

              {/*
              <FieldRow>
                <ResponsiveField label="Asignar a" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.asignadoA}
                      onChange={(e) => handleInputChange('asignadoA', e.target.value)}
                    >
                      <MenuItem value="todos">Todos</MenuItem>
                      <MenuItem value="seleccionar">Seleccionar personal</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              {formData.asignadoA === 'seleccionar' && (
                <FieldRow>
                  <ResponsiveField label="Personal seleccionado" required>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, maxHeight: '200px', overflow: 'auto' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.personalSeleccionado.length === personalList.length}
                            indeterminate={formData.personalSeleccionado.length > 0 && formData.personalSeleccionado.length < personalList.length}
                            onChange={(e) => handleSelectAllPersonal(e.target.checked)}
                          />
                        }
                        label="Seleccionar todos"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      />
                      {personalList.map((personal) => (
                        <FormControlLabel
                          key={personal.id}
                          control={
                            <Checkbox
                              checked={formData.personalSeleccionado.includes(personal.id)}
                              onChange={() => handlePersonalChange(personal.id)}
                            />
                          }
                          label={personal.name}
                          sx={{ display: 'block', ml: 2 }}
                        />
                      ))}
                    </Box>
                  </ResponsiveField>
                </FieldRow>
              )}
                */}

                <FieldRow>
                  <ResponsiveField label="Plantilla por defecto del Procedimiento" required>
                    <FormControl fullWidth required error={!!errors.examsId} size="small">
                                          <Select
                                            value={editFormData.examsId}
                                            onChange={(e) => handleEditInputChange('examsId', e.target.value)}
                                            displayEmpty
                                            sx={{
                                              '& .MuiSelect-select': {
                                              color: editFormData.examsId ? '#000' : '#999'
                                              }
                                            }}
                                          >
                                          <MenuItem value="">Seleccionar plantilla para procedimiento</MenuItem>
                                          {Array.isArray(EstudiosD) && EstudiosD.map(estudio => (
                                            <MenuItem key={estudio.id} value={estudio.id}>
                                              {estudio.name || ''}
                                            </MenuItem>
                                          ))}
                                          </Select>
                                        </FormControl>
                  </ResponsiveField>
                </FieldRow>
                {/*
                <FieldRow>
                  <FormControlLabel
                    control={<Switch checked={useDefaultTemplateEdit} onChange={(e) => {
                      const checked = false;
                      setUseDefaultTemplateEdit(checked);
                      handleEditInputChange('plantilla', checked ? DEFAULT_TEMPLATE_HTML : '');
                    }} />}
                    label="Plantilla predeterminada"
                  />
                </FieldRow>
                */}
              <FieldRow>
                <ResponsiveField
                  label={editFormData.tipo === 'cabecera' ? "Plantilla de cabecera del Reporte" : "Contenido de la Plantilla"}
                  required
                >
                  <RichTextEditor
                    value={editFormData.tipo === 'cabecera' ? editFormData.plantillaCabecera : editFormData.plantilla}
                    onChange={(value) => handleInputChange(editFormData.tipo === 'cabecera' ? 'plantillaCabecera' : 'plantilla', value)}
                    placeholder="Diseñe el contenido..."
                  />
                </ResponsiveField>
              </FieldRow>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseEditModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal de Detalles de la Plantilla */}
      <Dialog
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2196f3',
            color: 'white',
            '& .MuiTypography-root': {
              fontWeight: 'bold'
            }
          }}
        >
          Detalles de la Plantilla
          <IconButton onClick={handleCloseDetailsModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedPlantilla && (
            <>
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                  Información de la Plantilla
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Nombre:</strong> {selectedPlantilla.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Tipo:</strong> {selectedPlantilla.tipo === 'cabecera' ? 'Cabecera de Reporte' : 'Plantilla'}
                    </Typography>
                  </Grid>
                  {selectedPlantilla.description && (
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Descripción:</strong> {selectedPlantilla.description}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Asignado a:</strong> {selectedPlantilla.nombrePersonal || 'Sin asignar'}
                    </Typography>
                  </Grid>
                  {selectedPlantilla.plantillaProcedimiento && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Plantilla de Procedimiento:</strong> {selectedPlantilla.plantillaProcedimiento}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Fecha de Creación:</strong> {formatDate(selectedPlantilla.fechaCreacion)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Creado por:</strong> {selectedPlantilla.createdBy}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2196f3' }}>
                  Vista previa del contenido
                </Typography>
                <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                  <Box sx={{ maxHeight: 500, overflow: 'auto', backgroundColor: 'white' }}>
                    <style>{`
                      .details-html-preview table{border-collapse:collapse;table-layout:fixed;border:1px solid #999}
                      .details-html-preview th,.details-html-preview td{border:1px solid #999}
                      .details-html-preview img{max-width:100%;height:auto;display:block;object-fit:contain}
                    `}</style>
                    <div
                      className="details-html-preview"
                      dangerouslySetInnerHTML={{ __html: selectedPlantilla.plantilla || '' }}
                    />
                  </Box>
                </Paper>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDetailsModal}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación para Eliminar */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: '#f44336',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">Confirmar Eliminación</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Está seguro de que desea eliminar la plantilla{' '}
            <strong>"{selectedPlantilla?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteConfirm}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeletePlantilla}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Plantillas;