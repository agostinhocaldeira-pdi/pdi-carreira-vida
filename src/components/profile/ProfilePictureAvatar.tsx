import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfilePictureAvatarProps {
  profilePictureUrl: string | null;
  userName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export function ProfilePictureAvatar({ 
  profilePictureUrl, 
  userName = '',
  size = 'md',
  className 
}: ProfilePictureAvatarProps) {
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {profilePictureUrl && (
        <AvatarImage 
          src={profilePictureUrl} 
          alt={userName || 'Foto de perfil'}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials || <User className={iconSizes[size]} />}
      </AvatarFallback>
    </Avatar>
  );
}
