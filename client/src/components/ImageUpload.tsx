"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface ImageUploadProps {
    onUploadComplete: (urls: string[]) => void;
    existingImages?: string[];
}

export default function ImageUpload({ onUploadComplete, existingImages = [] }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(existingImages);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const files = Array.from(event.target.files);
            const newImageUrls: string[] = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('property-images')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage.from('property-images').getPublicUrl(filePath);
                newImageUrls.push(data.publicUrl);
            }

            const updatedImages = [...images, ...newImageUrls];
            setImages(updatedImages);
            onUploadComplete(updatedImages);

        } catch (error) {
            alert('Error uploading avatar!');
            console.log(error);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);
        onUploadComplete(updatedImages);
    }

    return (
        <div>
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image
                            src={url}
                            alt={`Uploaded ${index}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}

                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-gray-500 text-sm">{uploading ? '업로드 중...' : '+ 이미지 추가'}</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={uploadImage}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
}
