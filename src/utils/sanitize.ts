'use client';

import DOMPurify from 'dompurify';

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
};

export const sanitizeInput = (input: string): string => {
  // Strip all HTML tags/attributes to reduce XSS payloads in user input.
  return DOMPurify.sanitize(input, PURIFY_CONFIG);
};
