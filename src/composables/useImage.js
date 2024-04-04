import { ref, computed } from 'vue'
import { useFirebaseStorage } from "vuefire"
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { uid } from "uid"

export default function useImage() {

    const url = ref('')
    // Conect to Firebase service
    const storage = useFirebaseStorage()

    const onFileChange = e => {
        // Get file
        const file = e.target.files[0]
        const fileName = uid() + '.jpg'
        // Ubi image storage
        const sRef = storageRef(storage, '/products/' + fileName)
        // Sube el archivo
        const uploadTask = uploadBytesResumable(sRef, file)

        uploadTask.on('state_changed',
            () => {},
            (error) => console.log(error),
            () => {
                // Upload is complete
                // Promise
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        url.value = downloadURL
                    })
            }
        )
    }

    const isImageUploaded = computed(() => {
        return url.value ? url.value : null
    })

    return {
        url,
        onFileChange,
        isImageUploaded,
    }
}