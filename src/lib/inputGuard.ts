type ValidationOptions = {
  maxLength?: number;
  allowEmpty?: boolean;
};

const MALICIOUS_PATTERNS: RegExp[] = [
  /<\s*script\b/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /document\.cookie/i,
  /\b(union\s+select|drop\s+table|truncate\s+table|alter\s+table)\b/i,
  /--|\/\*|\*\//,
];

export type ModerationResult = {
  allowed: boolean;
  reason?: string;
};

export type ModerationHandler = (value: string) => Promise<ModerationResult>;

function normalizeText(value: string, maxLength: number): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, maxLength);
}

export function validateSafeTextInput(
  value: string,
  options: ValidationOptions = {},
): { value: string; error: string | null } {
  const maxLength = options.maxLength ?? 140;
  const sanitized = normalizeText(value, maxLength);
  const normalized = sanitized.trim().toLowerCase();

  if (!options.allowEmpty && normalized.length === 0) {
    return { value: sanitized, error: "This field cannot be empty." };
  }

  if (MALICIOUS_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return {
      value: sanitized,
      error: "This input appears unsafe and cannot be used.",
    };
  }

  return { value: sanitized, error: null };
}

export async function validateWithModeration(
  value: string,
  moderationHandler: ModerationHandler,
): Promise<{ value: string; error: string | null }> {
  const base = validateSafeTextInput(value, { allowEmpty: false });
  if (base.error) {
    return base;
  }

  const result = await moderationHandler(base.value);
  if (!result.allowed) {
    return {
      value: base.value,
      error: result.reason ?? "This input violates content policy.",
    };
  }

  return { value: base.value, error: null };
}

export function validateEmailInput(value: string): { value: string; error: string | null } {
  const base = validateSafeTextInput(value.trim(), { maxLength: 320, allowEmpty: false });
  if (base.error) {
    return base;
  }

  const email = base.value.toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { value: email, error: "Enter a valid email address." };
  }

  return { value: email, error: null };
}
