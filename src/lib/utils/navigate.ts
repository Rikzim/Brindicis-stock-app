import { goto } from "$app/navigation";
import { browser } from "$app/environment";

export function navigateTo(path: string) {
  if (browser) {
    void goto(path);
  }
}
