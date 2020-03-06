const CustomPage = require('./helpers/page');

let page;
beforeEach(async () => {
    page = await CustomPage.build();
    await page.goto('http://localhost:3000');
});
afterEach(async () => {
    await page.browser().close();
});

test('logo text verify', async () => {
    // const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    const text = await page.getContentOf('a.brand-logo');

    expect(text).toEqual('Blogster');
});

test('checks oauth flow button redirects correctly', async () => {
    await page.click('.right li a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in shows logout btn', async () => {
    await page.login();
    const text = await page.getContentOf("a[href='/auth/logout']");
    expect(text).toEqual('Logout');
});
