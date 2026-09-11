import slugifyPkg from 'slugify';

export function createSlug(text: string): string {
  const baseSlug = slugifyPkg(text, {
    lower: true,
    strict: true,
    trim: true,
  });
  return `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
}
