/** Runs before paint so reduced-motion users never see the intro. */
export const INTRO_BOOT_SCRIPT = `try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="done"}catch(e){document.documentElement.dataset.intro="done"}`;

export const INTRO_NOSCRIPT_STYLE =
  ".intro-overlay{display:none}[data-intro-logo]{transform:none!important;animation:none!important}[data-intro-fade]{opacity:1!important}";
