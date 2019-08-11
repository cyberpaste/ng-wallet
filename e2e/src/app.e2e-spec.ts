import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { Constants } from './app.po';
describe('workspace-project App', () => {
  let page: AppPage;
  let constants: Constants;

  beforeEach(() => {
    page = new AppPage();
    constants = new Constants();
  });

  it('should see the login page', () => {
    page.navigateTo();
    expect(page.getElementTextBySelector('app .form-signin mat-card-title')).toEqual('Login');
  });

  it('login', () => {
    login(page, constants);
    expect(page.getElementTextBySelector('app h1')).toEqual('Current Balance: 0$');
  });

  /*it('logout', () => {
    login(page, constants);
    page.getElementBySelector('app button.menu').click();
    page.getElementBySelector('app a.logout').click();
    expect(page.getElementTextBySelector('app .form-signin mat-card-title')).toEqual('Login');
  });
*/

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

function login(page, constants) {
  page.navigateToRoute('/login');
  let loginSelector = 'app .form-signin input[formcontrolname="username"]';
  let passwordSelector = 'app .form-signin input[formcontrolname="password"]';
  page.getElementBySelector(loginSelector).sendKeys(constants.getTestCredentials().login);
  page.getElementBySelector(passwordSelector).sendKeys(constants.getTestCredentials().password);
  let loginButton = 'app .form-signin button';
  page.getElementBySelector(loginButton).click();
}