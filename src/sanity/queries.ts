// Requêtes GROQ du site. Elles rendent des textes déjà résolus dans la langue demandée ($locale, repli sur le français)
// et des formes proches des props des composants : les pages n'ont plus qu'à brancher.
// `npm run typegen` en tire les types TypeScript (sanity.types.ts).
import { defineQuery } from 'groq';

/** Texte bilingue → texte de la langue demandée, ou le français. Écrit avec `select` plutôt qu'un accès
 * par paramètre, pour que la génération de types sache qu'il en sort une chaîne. Une langue de plus = une ligne ici. */
const t = (field: string) => `select($locale == "en" => coalesce(${field}.en, ${field}.fr), ${field}.fr)`;
/** Liste de textes bilingues → liste de chaînes. */
const tList = (field: string) => `${field}[]{ "v": ${t('@')} }.v`;
const image = (field: string) => `${field}{ "src": asset->url, "alt": ${t('alt')}, "lqip": asset->metadata.lqip, "hotspot": hotspot, "crop": crop }`;
const category = `{ "label": ${t('title')}, swatch, "slug": slug.current }`;
const card = `{
  "title": ${t('title')},
  "slug": slug.current,
  "href": "/projets/" + slug.current,
  client,
  "clientLogo": clientLogo.asset->url,
  year,
  featured,
  "intro": ${t('intro')},
  "skills": ${tList('skills')},
  "cover": ${image('cover')},
  coverRatio,
  "categories": categories[]->${category}
}`;

export const settingsQuery = defineQuery(`*[_id == "settings"][0]{
  name,
  "role": ${t('role')},
  "avatar": ${image('avatar')},
  "disciplines": ${tList('disciplines')},
  city,
  timeZone,
  email,
  socials[]{ network, "href": url },
  "cta": cta{ "label": ${t('label')}, href },
  "availability": { "status": availabilityStatus, "label": ${t('availabilityLabel')}, "detail": ${t('availabilityDetail')} },
  "footer": { "description": ${t('footerDescription')}, "columns": footerColumns[]{ "title": ${t('title')}, "links": links[]{ "label": ${t('label')}, href } } },
  "seo": seo{ "title": ${t('title')}, "description": ${t('description')}, "image": image.asset->url, noIndex }
}`);

export const homeQuery = defineQuery(`*[_id == "settings"][0]{
  "title": ${t('heroTitle')},
  "words": ${tList('heroWords')},
  "intro": ${t('heroIntro')},
  "projects": coalesce(featuredProjects[]->${card}, *[_type == "project" && featured == true] | order(order asc, year desc) ${card}),
  "latest": *[_type == "project" && defined(slug.current)] | order(order asc, year desc)[0...3] ${card},
  "skillRows": skillRows[]{ "items": items[]{ "label": ${t('label')}, tone } }.items,
  "manifesto": manifesto[]{ "title": ${t('title')}, "description": ${t('description')} },
  "clients": clients[]{ name, "logo": logo.asset->url },
  "services": *[_type == "service"] | order(order asc){ "title": ${t('title')}, "description": ${t('description')}, "details": ${tList('details')}, icon, "preview": ${image('preview')} },
  "testimonials": *[_type == "testimonial"] | order(order asc){ "quote": ${t('quote')}, name, "role": ${t('role')}, company, "avatar": avatar.asset->url },
  "lab": *[_type == "lab"] | order(order asc){ "title": ${t('title')}, "kind": ${t('kind')}, year, tone, url, "media": media{ kind, ratio, "image": ${image('image')}, "video": video{ "src": file.asset->url, "poster": poster.asset->url, "label": ${t('label')} } } },
  "faq": *[_type == "faq"] | order(order asc){ "title": ${t('question')}, "content": ${t('answer')}, topic }
}`);

export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(order asc, year desc) ${card}`);

export const projectSlugsQuery = defineQuery(`*[_type == "project" && defined(slug.current)].slug.current`);

export const projectQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  ...${card},
  "intro": ${t('intro')},
  "role": ${t('role')},
  "skills": ${tList('skills')},
  tools,
  "meta": meta[]{ "label": ${t('label')}, "value": ${t('value')} },
  "heroCover": coalesce(heroCover.asset->url, cover.asset->url),
  "thumbnail": ${image('thumbnail')},
  "liveLink": liveLink{ "label": ${t('label')}, href },
  "figures": figures[]{ value, "label": ${t('label')}, "description": ${t('description')}, "media": ${image('media')} },
  "chapters": chapters[]{
    "id": _key,
    "label": ${t('label')},
    "title": ${t('title')},
    "body": ${t('body')},
    "media": media[]{ kind, ratio, framed, scrollZoom, "caption": ${t('caption')}, "image": ${image('image')}, "video": video{ "src": file.asset->url, "poster": poster.asset->url, "label": ${t('label')} } },
    "figures": figures[]{ value, "label": ${t('label')}, "description": ${t('description')} }
  },
  "testimonial": testimonial->{ "quote": ${t('quote')}, name, "role": ${t('role')}, company, "avatar": avatar.asset->url },
  "seo": seo{ "title": ${t('title')}, "description": ${t('description')}, "image": image.asset->url, noIndex },
  "pagination": {
    "previous": *[_type == "project" && defined(slug.current) && ((^.order != null && order < ^.order) || (^.order == null && year > ^.year))] | order(order desc, year asc)[0]${card},
    "next": *[_type == "project" && defined(slug.current) && ((^.order != null && order > ^.order) || (^.order == null && year < ^.year))] | order(order asc, year desc)[0]${card}
  }
}`);
