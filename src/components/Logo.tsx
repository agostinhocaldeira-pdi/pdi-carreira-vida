import logoImage from "@/assets/logo_pdi.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 sm:h-7 sm:w-7",
    md: "h-8 w-8 sm:h-10 sm:w-10",
    lg: "h-10 w-10 sm:h-12 sm:w-12"
  };

  const textSizeClasses = {
    sm: "text-sm sm:text-base",
    md: "text-sm sm:text-xl",
    lg: "text-lg sm:text-2xl"
  };

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <img 
        src={logoImage} 
        alt="PDI Logo" 
        className={`${sizeClasses[size]} object-contain flex-shrink-0`}
      />
      {showText && (
        <>
          <span className={`font-bold ${textSizeClasses[size]} whitespace-nowrap`}>PDI</span>
          <span className={`font-bold ${textSizeClasses[size]} hidden sm:inline whitespace-nowrap`}>- Carreira & Vida</span>
        </>
      )}
    </div>
  );
};

export default Logo;
