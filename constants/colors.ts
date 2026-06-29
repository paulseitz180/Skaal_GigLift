/**
 * GigLift brand color palette.
 * Source of truth for all colors used across the app.
 */
export const colors = {
  // Brand
  primary: '#6B21A8',
  primarySoft: '#F3E8FF',
  accent: '#EC4899',

  // Surfaces
  background: '#FFFFFF',
  surface: '#FFFFFF',

  // Text
  text: '#111827',
  muted: '#6B7280',
  onPrimary: '#FFFFFF',

  // UI
  border: '#E5E7EB',
  disabled: '#D1D5DB',
  danger: '#DC2626',
  transparent: 'transparent',

  // Status accents
  info: '#2563EB',
  success: '#16A34A',

  // Overlays / immersive surfaces
  scrim: 'rgba(17, 24, 39, 0.5)',
  recordingBackground: '#0B0B0F',

  // Social platform brand accents
  instagram: '#E1306C',
  facebook: '#1877F2',
  x: '#111827',
} as const;

export type ColorToken = keyof typeof colors;
