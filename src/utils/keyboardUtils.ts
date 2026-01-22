export function formatShortcut(code: string, modifiers: string[] = []): string {
    const parts = [...modifiers];

    // Normalize code presentation
    let keyDisplay = code;
    if (code.startsWith('Key')) keyDisplay = code.slice(3);
    else if (code.startsWith('Digit')) keyDisplay = code.slice(5);
    else if (code.startsWith('Numpad')) keyDisplay = 'Num ' + code.slice(6);
    else if (code === 'Space') keyDisplay = 'Space';
    // Arrow keys
    else if (code === 'ArrowRight') keyDisplay = 'Right';
    else if (code === 'ArrowLeft') keyDisplay = 'Left';
    else if (code === 'ArrowUp') keyDisplay = 'Up';
    else if (code === 'ArrowDown') keyDisplay = 'Down';

    parts.push(keyDisplay);
    return parts.join('+');
}

export function matchesShortcut(event: KeyboardEvent, shortcutString: string): boolean {
    if (!shortcutString) return false;

    // Parse the stored shortcut string (e.g. "Meta+Space")
    // Note: We need a robust way to match. 
    // The previous implementation stored just "Space". New one stores "Meta+Space".

    const parts = shortcutString.split('+');
    const targetCode = parts[parts.length - 1]; // Last part is the key code/display name
    const requiredModifiers = parts.slice(0, -1);

    // 1. Check Key Code compatibility
    // We stored "Space", "Right", "Left" or "KeyR" or raw "ArrowRight"??
    // In Settings.tsx, we previously stored `e.code` directly (e.g. "ArrowRight", "Space", "KeyR").
    // The formatShortcut function above produces DISPLAY names (e.g. "Right"), but for storage/logic we might want to stick to CODES or standardized logical names.
    // Let's decide: Store as "Meta+ArrowRight" (using Code) or "Meta+Right" (Display)?
    // Plan said: "formatShortcut" for display. "Settings" constructs string. 
    // Let's make storage standardized: "Modifier+Modifier+Code".

    // Let's try to match strict Code first.
    // If the stored string is just "Space", it implies No Modifiers.

    const eventCode = event.code; // e.g., "Space", "ArrowRight", "KeyA"

    // We need to handle the conversion back from "Right" to "ArrowRight" if we stored display names.
    // To avoid ambiguity, let's STORE `e.code` (e.g. "ArrowRight") but DISPLAY "Right".
    // So `shortcutString` in `useShortcuts` will be "Meta+ArrowRight".

    if (targetCode !== eventCode) {
        return false;
    }

    // 2. Check Modifiers
    const eventModifiers: string[] = [];
    if (event.metaKey) eventModifiers.push('Meta');
    if (event.ctrlKey) eventModifiers.push('Ctrl');
    if (event.altKey) eventModifiers.push('Alt');
    if (event.shiftKey) eventModifiers.push('Shift');

    // Check if lengths match
    if (requiredModifiers.length !== eventModifiers.length) return false;

    // Check if all required modifiers are present
    return requiredModifiers.every(m => eventModifiers.includes(m));
}

// Helper to generate the storage string from an event
export function getShortcutFromEvent(event: KeyboardEvent): string {
    const modifiers: string[] = [];
    if (event.metaKey) modifiers.push('Meta');
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey) modifiers.push('Shift');

    return modifiers.length > 0 ? `${modifiers.join('+')}+${event.code}` : event.code;
}

// Helper to format the stored string for display locally
export function getDisplayString(shortcutString: string): string {
    if (!shortcutString) return '';
    const parts = shortcutString.split('+');
    const code = parts.pop() || '';
    const modifiers = parts;

    return formatShortcut(code, modifiers);
}
