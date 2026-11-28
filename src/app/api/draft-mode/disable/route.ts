import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/** Quitter le mode brouillon et revenir au contenu publié. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL('/', request.url));
}
