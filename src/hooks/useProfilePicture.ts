import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useProfilePicture() {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadProfilePicture = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to get from profiles table first
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_picture_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.profile_picture_url) {
        // Get public URL for the image
        const { data } = supabase
          .storage
          .from('profile-pictures')
          .getPublicUrl(profile.profile_picture_url);

        if (data?.publicUrl) {
          setProfilePictureUrl(data.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
    }
  }, []);

  useEffect(() => {
    loadProfilePicture();
  }, [loadProfilePicture]);

  const uploadProfilePicture = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato de imagem não suportado. Use JPG, PNG, WebP ou GIF.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      // Create a unique filename with timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Update or create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          profile_picture_url: fileName,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (profileError) {
        throw profileError;
      }

      // Get public URL
      const { data } = supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      if (data?.publicUrl) {
        // Add cache buster to force reload
        setProfilePictureUrl(`${data.publicUrl}?t=${Date.now()}`);
      }

      toast.success('Foto de perfil atualizada!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Erro ao enviar foto de perfil');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteProfilePicture = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      // Get current profile to find the file path
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_picture_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.profile_picture_url) {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove([profile.profile_picture_url]);

        if (deleteError) {
          console.error('Error deleting file:', deleteError);
        }
      }

      // Update profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          profile_picture_url: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (profileError) {
        throw profileError;
      }

      setProfilePictureUrl(null);
      toast.success('Foto de perfil removida');
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      toast.error('Erro ao remover foto de perfil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profilePictureUrl,
    isLoading,
    isUploading,
    uploadProfilePicture,
    deleteProfilePicture,
    refreshProfilePicture: loadProfilePicture,
  };
}
