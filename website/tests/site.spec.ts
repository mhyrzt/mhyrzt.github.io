import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('static content, navigation, Fourier rendering, theme, and layout', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
  const response = await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Mahyar Riazati.' })).toBeVisible();
  await page.locator('.fourier').scrollIntoViewIfNeeded();
  await expect(page.locator('.fourier')).toHaveAttribute('data-animation', 'running');
  await page.screenshot({path:`test-results/${info.project.name}-initial.png`});
  await expect(page.locator('.fourier button, .fourier select, .fourier summary')).toHaveCount(0);
  await expect(page.locator('canvas')).toBeVisible();
  const ink = await page.locator('canvas').evaluate((c: HTMLCanvasElement) => {
    const data = c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;
    let count = 0; for (let i=3;i<data.length;i+=4) if (data[i]! > 0) count++;
    return count;
  });
  expect(ink).toBeGreaterThan(1000);
  await page.locator('.about-portrait img').scrollIntoViewIfNeeded();
  await expect(page.locator('.about-portrait img')).toHaveJSProperty('complete',true);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo({top:0,behavior:'instant'}); });
  await page.screenshot({ path: `test-results/${info.project.name}-dark.png`, fullPage: true });
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-webtui-theme','light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-webtui-theme','light');
  await page.locator('.about-portrait img').scrollIntoViewIfNeeded();
  await expect(page.locator('.about-portrait img')).toHaveJSProperty('complete',true);
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({ path: `test-results/${info.project.name}-light.png`, fullPage: true });
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((el,t) => el.setAttribute('data-webtui-theme',t),theme);
    const audit = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
  await page.getByRole('navigation', {name:'Main navigation'}).getByRole('link',{name:'Work',exact:true}).click();
  await expect(page).toHaveURL(/#work$/);
  // Scroll well beyond the adjacent work panel so no glyph pixels remain visible.
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect(page.locator('.fourier')).toHaveAttribute('data-animation','suspended');
  const broken = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => { const id=a.getAttribute('href')!.slice(1);return id && !document.getElementById(id); }).length);
  expect(broken).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('narrow phones and tablets have no horizontal overflow', async ({page}) => {
  for (const width of [320,375,768,1024]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('reduced motion has a static glyph', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.fourier')).toHaveAttribute('data-animation','reduced');
  await expect(page.locator('.glyph-fallback')).toBeVisible();
  await expect(page.locator('canvas')).toBeHidden();
  await expect(page.locator('.fourier button, .fourier select, .fourier summary')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('.fourier').scrollIntoViewIfNeeded();
  await expect(page.locator('.fourier')).toHaveAttribute('data-animation','running');
});

test('works without JavaScript and offers keyboard navigation', async ({browser, page}) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const staticPage = await context.newPage();
  await staticPage.goto('http://127.0.0.1:4173/');
  await staticPage.evaluate(() => document.fonts.ready);
  await expect(staticPage.getByRole('heading',{name:'XRAT',exact:true})).toBeVisible();
  await expect(staticPage.locator('.glyph-fallback')).toBeVisible();
  await expect(staticPage.locator('.fourier button, .fourier select, .fourier summary')).toHaveCount(0);
  await staticPage.locator('.project summary').first().click();
  await expect(staticPage.getByText(/I develop the Rust CLI/)).toBeVisible();
  await expect(staticPage.getByRole('link',{name:'$ wget mhyrzt-cv.pdf'})).toBeVisible();
  await staticPage.close(); await context.close();
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('SEO and static endpoints refer to the current domain', async ({request}) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('rel="canonical" href="https://mhyrzt.github.io/"');
  expect(html).toContain('application/ld+json');
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)![1]!);
  expect(schema['@type']).toBe('ProfilePage');
  expect(schema.mainEntity['@type']).toBe('Person');
  expect(schema.mainEntity.name).toBe('Mahyar Riazati');
  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  expect(html).toContain('property="og:image" content="https://mhyrzt.github.io/social.png"');
  expect(html).toContain('rel="describedby" href="https://mhyrzt.github.io/llms.txt"');
  expect(html).not.toContain('mhyrzt.me');
  expect(html).not.toContain('googletagmanager');
  expect(html).toContain('releases/latest/download/mahyar-riazati-cv.pdf');
  for (const path of ['/robots.txt','/sitemap.xml','/favicon.svg','/portrait.webp','/social.png','/404.html','/llms.txt','/index.md']) {
    expect((await request.get(path)).status()).toBe(200);
  }
  const image = await (await request.get('/social.png')).body();
  expect(image.readUInt32BE(16)).toBe(1200);
  expect(image.readUInt32BE(20)).toBe(630);
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms.startsWith('# Mahyar Riazati')).toBe(true);
  expect(llms).toContain('https://mhyrzt.github.io/index.md');
  const markdown = await (await request.get('/index.md')).text();
  expect(markdown).toContain('https://github.com/mhyrzt/xrat');
  expect(markdown).toContain('https://doi.org/10.1016/j.ins.2024.121479');
});


test('offers one direct CV download', async ({page}) => {
  await page.route('https://api.github.com/repos/mhyrzt/mhyrzt.github.io/releases/latest', route =>
    route.fulfill({json: {published_at: '2026-10-28T18:08:00Z'}}));
  await page.goto('/');
  const download = page.getByRole('link', {name:'$ wget mhyrzt-cv.pdf'});
  await expect(download).toHaveCount(1);
  await expect(download).toHaveAttribute('href', 'https://github.com/mhyrzt/mhyrzt.github.io/releases/latest/download/mahyar-riazati-cv.pdf');
  await expect(page.locator('#cv-profile')).toHaveCount(0);
  await expect(page.locator('#cv-updated')).toHaveText('Last updated: 28 Oct 2026');
  await expect(page.locator('#cv-updated')).toBeVisible();
  await expect(page.locator('#cv-updated time')).toHaveAttribute('datetime', '2026-10-28T18:08:00.000Z');
});

test('CV download works when release metadata is unavailable', async ({page}) => {
  await page.route('https://api.github.com/repos/mhyrzt/mhyrzt.github.io/releases/latest', route =>
    route.fulfill({status: 403, json: {message: 'API rate limit exceeded'}}));
  await page.goto('/');
  await expect(page.getByRole('link', {name:'$ wget mhyrzt-cv.pdf'})).toBeVisible();
  await expect(page.locator('#cv-updated')).toBeHidden();
});

test('scroll motion respects reduced motion and keeps content readable', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  expect(await page.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior)).toBe('smooth');
  const about = page.locator('#about');
  await about.scrollIntoViewIfNeeded();
  await expect.poll(()=>about.evaluate(el=>el.getAnimations().length)).toBeGreaterThan(0);
  expect(await about.evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>about.evaluate(el=>el.getAnimations().length)).toBe(0);
  expect(await page.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior)).toBe('auto');
  await page.locator('#research').scrollIntoViewIfNeeded();
  expect(await page.locator('#research').evaluate(el=>el.getAnimations().length)).toBe(0);
});

test('contact remains a visitor-solved puzzle without publishing the address', async ({page,request}) => {
  await page.goto('/');
  await expect(page.getByText('uniq(FIRST_NAME + LAST_NAME − vowels)', {exact:true})).toBeVisible();
  await expect(page.locator('#copy-email')).toHaveCount(0);
  for (const path of ['/','/index.md','/llms.txt']) {
    const text = await (await request.get(path)).text();
    expect(text).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
    expect(text).not.toContain('mailto:');
  }
});
