import { BaseScreen } from './BaseScreen.ts';

/**
 * Screen object for the stock Android Settings app (the default app under test).
 * Labels differ slightly between Android versions and manufacturers, so
 * adjust the text here and every test picks it up.
 */
export class SettingsScreen extends BaseScreen {
  async openItem(label: string): Promise<void> {
    const item = this.scrollTo(label);
    await item.waitForDisplayed({ timeout: 10_000 });
    await item.click();
  }

  async isItemVisible(label: string): Promise<boolean> {
    return this.scrollTo(label).isDisplayed();
  }
}
