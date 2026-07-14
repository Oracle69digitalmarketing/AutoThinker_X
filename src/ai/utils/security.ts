/**
 * security.ts
 * Phase 11 — Security
 */

export function sanitizePrompt(text: string): string {
  if (!text) return "";
  // Remove potentially malicious characters or script tags
  return text.replace(/[<>]/g, "").trim();
}

export function validateVentureRequest(req: any): { valid: boolean; error?: string } {
  const { idea, branding } = req;
  if (!idea || typeof idea !== "string" || idea.length < 10) {
    return { valid: false, error: "Idea must be a string of at least 10 characters." };
  }
  if (branding && !["tech-bold", "corporate-clean", "playful-modern"].includes(branding)) {
    return { valid: false, error: "Invalid branding style." };
  }
  return { valid: true };
}
