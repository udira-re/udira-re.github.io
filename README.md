# Amshu Pokharel – portfolio

Personal site at **https://udira-re.github.io**, built with Next.js 16 (App Router, TypeScript) and exported as static HTML.

## Run locally

```bash
npm install
npm run dev
```

## Update content

Everything on the page comes from [`src/content/site.ts`](src/content/site.ts): projects, experience, skills and links. Edit it, push to `main`, and GitHub Actions rebuilds and deploys the site.

To replace the CV, overwrite `public/Amshu_Pokharel_CV.pdf`. When you change content, also bump `updated` in `site.ts` so the sitemap date moves.

## SEO built in

- Title, description, canonical URL, Open Graph and Twitter cards (`src/app/layout.tsx`)
- Structured data for Google (`ProfilePage`, `Person`, `WebSite` JSON-LD)
- `sitemap.xml`, `robots.txt`, web manifest, social preview image, and `llms.txt` for AI search
- Static HTML, self-hosted fonts and minimal JavaScript for fast Core Web Vitals

## Google Search Console

1. Add `https://udira-re.github.io/` as a URL-prefix property and choose the **HTML tag** method.
2. Copy only the `content` value from the tag.
3. In this repo: Settings → Secrets and variables → Actions → New secret named `GOOGLE_SITE_VERIFICATION` with that value.
4. Re-run the "Deploy to GitHub Pages" workflow, then click **Verify** in Search Console.
5. Submit `sitemap.xml` and request indexing for the home page.
