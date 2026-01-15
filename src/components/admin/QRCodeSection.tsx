import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, Download, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const QRCodeSection = () => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  
  // URL da página inicial publicada
  const landingUrl = "https://pdicarreiraevida.lovable.app";

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(landingUrl);
      setCopied(true);
      toast.success("URL copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar URL");
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    // Criar um canvas para converter SVG em PNG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    // Tamanho do QR Code para download
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (ctx) {
        // Fundo branco
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        // Download
        const link = document.createElement("a");
        link.download = "qrcode-pdi-carreira-vida.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("QR Code baixado com sucesso!");
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyQRAsImage = async () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      const size = 512;
      canvas.width = size;
      canvas.height = size;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
          }
          resolve();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob })
            ]);
            toast.success("QR Code copiado para a área de transferência!");
          } catch {
            // Fallback: download if copy fails
            handleDownloadQR();
          }
        }
      }, "image/png");
    } catch (err) {
      toast.error("Erro ao copiar QR Code. Tente baixar.");
    }
  };

  return (
    <Card className="shadow-medium border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          QR Code para Divulgação
        </CardTitle>
        <CardDescription>
          Use este QR Code para divulgar o PDI Carreira & Vida. Ele direciona para a página inicial.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* QR Code */}
          <div 
            ref={qrRef}
            className="bg-white p-4 rounded-lg shadow-md border"
          >
            <QRCodeSVG 
              value={landingUrl}
              size={180}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">URL de destino:</p>
              <p className="text-sm font-medium break-all">{landingUrl}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar URL"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyQRAsImage}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar QR Code
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar PNG
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(landingUrl, "_blank")}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir Link
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              💡 Dica: Use o QR Code em materiais impressos, apresentações, 
              redes sociais ou qualquer outro material de divulgação.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeSection;
