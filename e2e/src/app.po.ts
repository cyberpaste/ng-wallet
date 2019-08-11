import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  navigateToRoute(route) {
    return browser.get(browser.baseUrl + route) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app h1')).getText() as Promise<string>;
  }

  getElementTextBySelector(selector) {
    return element(by.css(selector)).getText() as Promise<string>;
  }

  getElementBySelector(selector) {
    return element(by.css(selector));
  }

  logout(){
    browser.executeScript(`document.querySelector('a.logout').click();`);
  }

}

export class Constants {
  getTestCredentials() {
    return {
      login: 'admin',
      password: 'admin'
    };
  }
}