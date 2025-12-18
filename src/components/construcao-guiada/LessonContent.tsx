import { Video } from "lucide-react";

interface LessonContentProps {
  title: string;
  children: React.ReactNode;
}

const LessonContent = ({ title, children }: LessonContentProps) => {
  return (
    <div className="space-y-6">
      {/* Video Placeholder */}
      <div className="aspect-video bg-muted/50 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-3">
        <Video className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Vídeo aula em breve</p>
      </div>
      
      {/* Content */}
      <div className="prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
};

export default LessonContent;
