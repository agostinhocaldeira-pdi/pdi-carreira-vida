import * as React from "react";
import { cn } from "@/lib/utils";
import { VoiceInputButton } from "./voice-input-button";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  enableVoice?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, enableVoice = true, onChange, value, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    const handleVoiceTranscript = React.useCallback((text: string) => {
      if (textareaRef.current) {
        const currentValue = textareaRef.current.value;
        const newValue = currentValue ? `${currentValue} ${text}` : text;

        // Create a synthetic event to trigger onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(textareaRef.current, newValue);
          const event = new Event("input", { bubbles: true });
          textareaRef.current.dispatchEvent(event);
        }
      }
    }, []);

    const showVoiceButton =
      enableVoice && !props.disabled && !props.readOnly;

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            showVoiceButton && "pr-10",
            className
          )}
          ref={textareaRef}
          onChange={onChange}
          value={value}
          {...props}
        />
        {showVoiceButton && (
          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
            disabled={props.disabled}
            className="top-3 -translate-y-0"
          />
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
