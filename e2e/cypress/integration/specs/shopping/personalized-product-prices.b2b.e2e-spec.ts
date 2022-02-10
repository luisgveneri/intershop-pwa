import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { HomePage } from '../../pages/home.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  product: '201807181',
  price: ' $21,999.00 ',

  name: 'Neil Brightstrong',
  email: 'nbrightstrong@test.intershop.de',
  password: '!InterShop00!',
  personalizedPrice: ' $21,500.00 ',
};

describe('Personalized Prizes', () => {
  before(() => HomePage.navigateTo());

  it('should navigate to product from featured products', () => {
    at(HomePage, page => page.gotoFeaturedProduct(_.product));
    at(ProductDetailPage);
  });

  it('should see product with non personalized price on product detail page', () => {
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.product);
      page.price.should('have.text', _.price);
    });
  });

  it('should login with credentials', () => {
    at(ProductDetailPage, page => page.header.gotoLoginPage());
    at(LoginPage, page => {
      page.fillForm(_.email, _.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(MyAccountPage, page => {
      page.header.myAccountLink.should('have.text', _.name);
    });
  });

  it('should go back to product detail page', () => {
    at(MyAccountPage, page => page.header.gotoHomePage());
    at(HomePage, page => page.gotoFeaturedProduct(_.product));
    at(ProductDetailPage);
  });

  it('should see product with personalized price', () => {
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.product);
      page.price.should('have.text', _.personalizedPrice);
    });
  });
});
