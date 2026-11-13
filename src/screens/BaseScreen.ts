import { $, driver } from '@wdio/globals';

/** Shared helpers for every screen object. */
export abstract class BaseScreen {
  /** Android UiSelector lookup by (partial) visible text. */
  protected byText(text: string) {
    return $(`android=new UiSelector().textContains("${text}")`);
  }

  /** Scroll a scrollable list until an element with the text is visible. */
  protected scrollTo(text: string) {
    return $(
      `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("${text}"))`,
    );
  }

  async back(): Promise<void> {
    await driver.back();
  }

  async pageSource(): Promise<string> {
    return driver.getPageSource();
  }
}
