declare module 'jest-axe' {
  export function axe(element: Element | Document): Promise<unknown>;
  export function toHaveNoViolations(): unknown;
}
