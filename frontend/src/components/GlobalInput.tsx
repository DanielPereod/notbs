import { ChangeEvent, useEffect, useRef, useState, ReactNode } from "react";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";

type GlobalInputProps<T> = {
  onActivate: () => void;
  onDeactivate: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  renderItem: (item: T, key: number) => ReactNode;
  items: T[];
  isActive: boolean;
  inputPlaceholder?: string;
  openHotkey: string;
  Icon?: React.ForwardRefExoticComponent<any>;
};

export function GlobalInput<T>({
  onActivate,
  onDeactivate,
  onChange,
  renderItem,
  items,
  isActive,
  openHotkey,
  inputPlaceholder = "Type here...",
  Icon,
}: GlobalInputProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    openHotkey,
    (e) => {
      e.preventDefault();
      onActivate();
    },
    { enableOnFormTags: true, scopes: ["prompt"] }
  );


  useHotkeys("esc", onDeactivate, { enableOnFormTags: true, scopes: ["prompt"] });


  
  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
    }
  }, [isActive]);

  if (isActive) {
    return (
      <HotkeysProvider initiallyActiveScopes={["prompt"]}>
        <div id="command-prompt-container">
          <div id="command-prompt-box">
            <div id="command-prompt-icon-input">
              {Icon && <Icon />}
              <input
                autoComplete="off"
                ref={inputRef}
                id="command-prompt"
                onChange={onChange}
                placeholder={inputPlaceholder}
              />
            </div>
            <ul id="command-prompt-items">{items.map((item, key) => renderItem(item, key))}</ul>
          </div>
        </div>
      </HotkeysProvider>
    );
  }

  return null;
}
