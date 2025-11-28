import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-border group-[.toaster]:shadow-large group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:min-h-[70px] group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-base group-[.toast]:mt-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-semibold group-[.toast]:px-4 group-[.toast]:py-2",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-primary group-[.toaster]:bg-primary/5 group-[.toaster]:shadow-[0_0_20px_rgba(43,171,156,0.15)]",
          error: "group-[.toaster]:border-destructive group-[.toaster]:bg-destructive/5 group-[.toaster]:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
          warning: "group-[.toaster]:border-accent group-[.toaster]:bg-accent/5 group-[.toaster]:shadow-[0_0_20px_rgba(251,146,120,0.15)]",
          info: "group-[.toaster]:border-primary group-[.toaster]:bg-primary/5 group-[.toaster]:shadow-[0_0_20px_rgba(43,171,156,0.15)]",
          title: "group-[.toast]:text-lg group-[.toast]:font-semibold",
        },
        style: {
          fontSize: '15px',
          fontWeight: '500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
