import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dmpf39dni',
    api_key: '567911278415154',
    api_secret: 'ndS3k4EEZPSte80jKfRIhl6CDcI'
});

export async function deleteImage(imageUrl) {
    const publicId = imageUrl.split('/').pop().split('.')[0];  
    return cloudinary.uploader.destroy(publicId);
}