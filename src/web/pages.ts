import { expect, type Locator, type Page } from '@playwright/test';

export const USER = process.env.WEB_USER ?? 'standard_user';
export const PASSWORD = process.env.WEB_PASSWORD ?? 'secret_sauce';

/** Page object for the login screen of the web app under test. */
export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.submit = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async login(user: string = USER, pass: string = PASSWORD): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.tap();
  }
}

/** Page object for the product list after login. */
export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }

  async addToCart(slug: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${slug}`).tap();
  }
}

/** Opens the app and signs in; returns the products page. */
export async function signIn(page: Page): Promise<ProductsPage> {
  const login = new LoginPage(page);
  await login.open();
  await login.login();
  const products = new ProductsPage(page);
  await products.expectLoaded();
  return products;
}
