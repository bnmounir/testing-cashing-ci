const puppeteer = require('puppeteer');
const sessionFactory = require('../factory/session');
const userFactory = require('../factory/user');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        // for debugging use: {headless: false} on the launch browser ^
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property) {
                return customPage[property] || page[property];
            }
        });
    }
    constructor(page) {
        this.page = page;
    }
    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor("a[href='/auth/logout']");
    }

    async getContentOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }
    async method(_path, _method, _body) {
        return this.page.evaluate(
            async (path, method, body = null) => {
                return fetch(path, {
                    method: method,
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body
                }).then(res => res.json());
            },
            _path,
            _method,
            _body
        );
    }
}
module.exports = CustomPage;
