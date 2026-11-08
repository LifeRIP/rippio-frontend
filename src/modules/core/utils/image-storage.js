// Keep storage operations injectable so tests never contact a real Firebase bucket.
export function createImageStorage(storage, { ref, uploadBytes, getDownloadURL, deleteObject }, fetchFile = globalThis.fetch) {
  function requireStorage() {
    if (!storage) throw new Error('La subida de imágenes no está disponible: falta configurar el almacenamiento.');
    return storage;
  }
  return {
    async uploadFile(file, to, name) {
      const target = ref(requireStorage(), `${to}/${name}`);
      await uploadBytes(target, file);
      return getDownloadURL(target);
    },
    async renameFile(oldPath, newPath) {
      const instance = requireStorage();
      const oldRef = ref(instance, oldPath);
      const newRef = ref(instance, newPath);
      const response = await fetchFile(await getDownloadURL(oldRef));
      if (!response.ok) throw new Error('No se pudo descargar la imagen original.');
      await uploadBytes(newRef, await response.blob());
      await deleteObject(oldRef);
      return getDownloadURL(newRef);
    },
  };
}
