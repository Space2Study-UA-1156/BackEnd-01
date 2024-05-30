const { ref, uploadString, getDownloadURL, deleteObject, getStorage } = require('firebase/storage')
const storage = require('~/initialization/firebaseStorage')

const uploadService = {
  uploadFile: async (file, containerName) => {
    const metadata = {
      contentType: file.type
    }

    const name = `${Date.now()}-${file.name}`
    const storageRef = ref(storage, `${containerName}/${name}`)

    const snapshot = await uploadString(storageRef, file.src, 'data_url', metadata)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  },

  deleteFile: async (fileName) => {
    const storage = getStorage()
    const httpsReference = ref(storage, fileName)
    await deleteObject(httpsReference)
  }
}

module.exports = uploadService
