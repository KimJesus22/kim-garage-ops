import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useStorage = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file, path = 'vehicles') => {
        try {
            setUploading(true);
            setError(null);

            if (!file) throw new Error('No file selected');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${path}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('garage-files')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('garage-files')
                .getPublicUrl(filePath);

            return data.publicUrl;

        } catch (err) {
            setError(err.message);
            console.error('Error uploading image:', err.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading, error };
};
