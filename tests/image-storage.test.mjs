import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createImageStorage } from '../src/modules/core/utils/image-storage.js';

function fixture({ failUpload = false, failDownload = false } = {}) {
  const events = [];
  const storage = createImageStorage({}, {
    ref: (_, path) => path,
    uploadBytes: async (path, file) => { events.push(['upload', path, file.size]); if (failUpload) throw new Error('upload failed'); },
    getDownloadURL: async path => `https://storage.example.test/${path}`,
    deleteObject: async path => { events.push(['delete', path]); },
  }, async () => new Response('fixture image', { status: failDownload ? 404 : 200 }));
  return { storage, events };
}

test('upload returns the download URL using the existing folder/name contract', async () => {
  const { storage, events } = fixture();
  assert.equal(await storage.uploadFile(new Blob(['image']), 'products', '123'), 'https://storage.example.test/products/123');
  assert.deepEqual(events, [['upload', 'products/123', 5]]);
});
test('rename uploads the new file before deleting the old one', async () => {
  const { storage, events } = fixture();
  assert.equal(await storage.renameFile('old', 'new'), 'https://storage.example.test/new');
  assert.deepEqual(events.map(event => event.slice(0, 2)), [['upload', 'new'], ['delete', 'old']]);
});
test('a failed download or upload never deletes the original object', async () => {
  for (const options of [{ failDownload: true }, { failUpload: true }]) {
    const { storage, events } = fixture(options);
    await assert.rejects(storage.renameFile('old', 'new'));
    assert.equal(events.some(([action]) => action === 'delete'), false);
  }
});
test('missing Firebase configuration produces a clear error without network calls', async () => {
  const storage = createImageStorage(null, {});
  await assert.rejects(storage.uploadFile(new Blob(), 'products', '1'), /configurar/);
  await assert.rejects(storage.renameFile('old', 'new'), /configurar/);
});
