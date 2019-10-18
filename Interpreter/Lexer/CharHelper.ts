
/** Karakter függvények **/

export function isAlpha(char: string): boolean {
    return 'qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM'.indexOf(char) >= 0;
}

export function isNum(char: string): boolean {
    return '0123456789'.indexOf(char) >= 0;
}

export function isAlphaNum(char: string): boolean {
    return isAlpha(char) || isNum(char);
}

export function isWhite(char: string): boolean {
    return ' \t\n\r'.indexOf(char) >= 0;
}
