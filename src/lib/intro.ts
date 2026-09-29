/**
 * Runs before paint so reduced-motion users never see the intro, and so a reload always
 * starts at the top where the intro choreography expects the grid to be.
 */
export const INTRO_BOOT_SCRIPT = `try{history.scrollRestoration="manual";if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="done"}catch(e){document.documentElement.dataset.intro="done"}`;

export const INTRO_NOSCRIPT_STYLE =
  ".intro-overlay{display:none}[data-intro-logo],[data-intro-letter],[data-intro-rise],[data-intro-from]{transform:none!important;animation:none!important}";
