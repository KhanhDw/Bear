declare module "user/UserApp" {
  export function mount(el: HTMLElement): void;
}
declare module "post/PostApp" {
  import type { Root } from "react-dom/client";
  export function mount(el: HTMLElement, props?: Record<string, any>): void;
  export function unmount(): void;
}
