// ============================================================
// lib/storageAudio.ts — Firebase Storage audio upload helper
// ============================================================
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload an audio Blob to Firebase Storage.
 *
 * @param uid       Current user's uid (used for path namespacing)
 * @param blob      The audio Blob from MediaRecorder
 * @param pathType  'profile' for voice intro, 'message' for chat audio
 * @returns         Public download URL
 */
export async function uploadAudio(
  uid: string,
  blob: Blob,
  pathType: 'profile' | 'message' = 'message',
): Promise<string> {
  const ext = blob.type.includes('mp4') ? 'm4a' : 'webm'
  const timestamp = Date.now()
  const path = pathType === 'profile'
    ? `audio/profiles/${uid}/intro_${timestamp}.${ext}`
    : `audio/messages/${uid}/${timestamp}.${ext}`

  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, blob, { contentType: blob.type })
  return getDownloadURL(storageRef)
}
