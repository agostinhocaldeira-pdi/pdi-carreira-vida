import * as React from "react";
import { cn } from "@/lib/utils";
import { VoiceInputButton } from "./voice-input-button";

export interface InputProps extends React.ComponentProps<"input"> {
  enableVoice?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, enableVoice = true, onChange, value, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleVoiceTranscript = React.useCallback(
      (text: string) => {
        if (inputRef.current) {
          const currentValue = inputRef.current.value;
          const newValue = currentValue ? `${currentValue} ${text}` : text;

          // Create a synthetic event to trigger onChange
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;

          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(inputRef.current, newValue);
            const event = new Event("input", { bubbles: true });
            inputRef.current.dispatchEvent(event);
          }
        }
      },
      []
    );

    const showVoiceButton =
      enableVoice &&
      type !== "password" &&
      type !== "email" &&
      type !== "number" &&
      type !== "date" &&
      type !== "file" &&
      !props.disabled &&
      !props.readOnly;

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            showVoiceButton && "pr-10",
            className
          )}
          ref={inputRef}
          onChange={onChange}
          value={value}
          {...props}
        />
        {showVoiceButton && (
          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
            disabled={props.disabled}
          />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
