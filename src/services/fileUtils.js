/**
 * Convierte un item de capturedImages (imagen o video) a Blob.
 * 
 * @param {Object} item - Objeto con propiedades como kind, src, fullSrc, videoBlob, videoSrc
 * @returns {Promise<Blob>} Blob del archivo
 * @throws {Error} Si no se puede obtener el Blob
 */

export async function fileUtils(item) {
  if (!item) throw new Error('Item no definido');

  if (item.kind === 'video') {
    if (item.videoBlob instanceof Blob) {
      return item.videoBlob;
    }
    if (item.videoSrc) {
      const response = await fetch(item.videoSrc);
      if (!response.ok) throw new Error(`No se pudo cargar el video: ${response.status}`);
      return await response.blob();
    }
    throw new Error('Video sin videoBlob ni videoSrc');
  }

  // === IMAGEN ===
  const dataUrl = item.fullSrc || item.src;
  if (!dataUrl) {
    throw new Error('Imagen sin src ni fullSrc');
  }

  // Caso 1: Es un Data URL (ej: "data:image/jpeg;base64,...")
  if (dataUrl.startsWith('data:')) {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error('No se pudo convertir Data URL a Blob');
    return await response.blob();
  }

  // Caso 2: Es un Object URL (ej: "blob:http://...") o URL normal
  // fetch() puede manejar ambos
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error('Respuesta no válida al cargar imagen');
    return await response.blob();
  } catch (err) {
    throw new Error(`No se pudo cargar la imagen desde: ${dataUrl.substring(0, 50)}...`);
  }
}

export default fileUtils;