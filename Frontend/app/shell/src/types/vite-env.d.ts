declare module "user/UserApp" {
  export function mount(el: HTMLElement): void;
}
// sau này using for unmount
// export function mount(el: HTMLElement): () => void;
