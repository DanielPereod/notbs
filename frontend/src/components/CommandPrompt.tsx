import { ChangeEvent, useContext, useState } from "react";
import { GlobalInput } from "./GlobalInput";
import { NoteContext } from "../App";
import { Note } from "../types/Note";
import { commands } from "../helpers/commands";
import { AppCommand } from "../types/AppCommand";
import { hotkeysDict } from "../config/hotkeys";


export function CommandPrompt() {
  const [isActive, setIsActive] = useState(false);
  const [foundCommands, setFoundCommands] = useState<AppCommand[]>([])

  const handleActivate = () => setIsActive(true);
  const handleDeactivate = () => setIsActive(false);

  async function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const inputCmd = e.target.value;
    const foundCommands = commands.filter((cmd: AppCommand) =>  cmd.name.toLowerCase().includes(inputCmd.toLowerCase()))
    setFoundCommands(() => foundCommands)
  }

  async function handleCommandClick(id: string) {
    setIsActive(false);
  }

  function renderItem(cmd: AppCommand, key: number) {
    return (
      <li key={key} onClick={() => handleCommandClick(cmd.id)} id={cmd.id}>
        {cmd.name}
      </li>
    );
  }

  return (
    <GlobalInput<AppCommand>
      openHotkey={hotkeysDict.open_command_prompt}
      onActivate={handleActivate}
      onDeactivate={handleDeactivate}
      onChange={handleInputChange}
      renderItem={renderItem}
      items={foundCommands}
      isActive={isActive}
      inputPlaceholder="Enter a command..."
    />
  );
}
