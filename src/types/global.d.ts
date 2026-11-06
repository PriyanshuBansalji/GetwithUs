/** The Cloudflare Turnstile browser API, present after its script loads (explicit render mode). */
type TurnstileOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

interface Window {
  turnstile?: {
    render: (container: HTMLElement, options: TurnstileOptions) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId: string) => void;
  };
}
