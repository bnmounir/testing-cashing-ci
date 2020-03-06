const CustomPage = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await CustomPage.build();
    await page.goto('http://localhost:3000');
});
afterEach(async () => {
    await page.browser().close();
});

describe('When logged in', () => {
    beforeEach(async () => {
        await page.login();
        await page.click("a[href='/blogs/new']");
    });
    it('can take you to the blog form', async () => {
        const text = await page.getContentOf('form label');
        expect(text).toEqual('Blog Title');
    });
    describe('using invalid inputs', () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        it('shows an error message', async () => {
            const titleError = await page.getContentOf('.title .red-text');
            const contentError = await page.getContentOf('.content .red-text');
            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
    describe('using valid inputs', () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('button');
        });
        it('takes you to submitting screen', async () => {
            const text = await page.getContentOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });
        it('it submits and redirect to blogs', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContentOf('.card-title');
            const content = await page.getContentOf('p');
            expect(title).toEqual('My Title');
            expect(content).toEqual('My Content');
        });
    });
});

describe('when not logged in, ', () => {
    const args = [];

    test('user cannot post blog', async () => {
        const body = JSON.stringify({
            title: 'test submit will not logged in',
            content: 'better not get this seen by anyone'
        });
        const res = await page.method('/api/blogs', 'POST', body);
        expect(res).toEqual({ error: 'You must log in!' });
    });
    test('user cannot get blogs', async () => {
        const res = await page.method('/api/blogs', 'GET');
        expect(res).toEqual({ error: 'You must log in!' });
    });
});
