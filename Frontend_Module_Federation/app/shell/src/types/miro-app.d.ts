declare module "user/UserApp" {
  export function mount(el: HTMLElement): void;
}
declare module "post/PostApp" {
  export function mount(
    el: HTMLElement,
    props?: {
      initialPath?: string;
      basename?: string;
      [key: string]: any;
    }
  ): void;

  export function unmount(): void;
}
