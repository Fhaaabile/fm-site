import { load } from '@/sanity/live';
import { homeQuery } from '@/sanity/queries';
import type { HomeQueryResult } from '@/sanity/sanity.types';
import { isHome } from '@/sanity/clean';
import { HomeView } from '@/views/HomeView';

export default async function HomePage() {
  const data = await load<HomeQueryResult>(homeQuery, { locale: 'fr' });
  return <HomeView home={isHome(data) ? data : null} />;
}
