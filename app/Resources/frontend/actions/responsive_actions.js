export const SHOW_MENU = "SHOW_MENU";
export const HIDE_MENU = "HIDE_MENU";

export function showMenuAction() {
    return { type: SHOW_MENU };
}

export function hideMenuAction() {
    return { type: HIDE_MENU };
}