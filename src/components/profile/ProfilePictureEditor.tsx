import { useRef } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfilePictureAvatar } from './ProfilePictureAvatar';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProfilePictureEditorProps {
  userName?: string;
}

export function ProfilePictureEditor({ userName }: ProfilePictureEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    profilePictureUrl, 
    isUploading, 
    isLoading,
    uploadProfilePicture, 
    deleteProfilePicture 
  } = useProfilePicture();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePicture(file);
    }
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ProfilePictureAvatar 
          profilePictureUrl={profilePictureUrl}
          userName={userName}
          size="xl"
          className="border-4 border-background shadow-lg"
        />
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={isUploading || isLoading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Camera className="h-4 w-4 mr-2" />
          )}
          {profilePictureUrl ? 'Alterar foto' : 'Adicionar foto'}
        </Button>

        {profilePictureUrl && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isUploading || isLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover foto de perfil?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Sua foto de perfil será removida permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteProfilePicture}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Formatos aceitos: JPG, PNG, WebP, GIF (máx. 5MB)
      </p>
    </div>
  );
}
