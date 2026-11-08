import { visitPage } from '../support/app-fixtures';
describe('Search and cart with local fixtures', () => {
 it('renders an empty search without stale products', () => {
  visitPage('/searchpage/no-match', null, { 'GET /api/search': req => req.reply([]) });
  cy.get('.searchPage-title').should('contain', 'No encontramos resultados');
  cy.get('.restaurantInformation-item-products-product-img').should('not.exist');
 });
 it('renders search results and restaurant products', () => {
  visitPage('/searchpage/pizza');
  cy.get('.restaurantInformation-item-products-product-img').should('have.length',4);
  visitPage('/restaurant/10');
  cy.get('.RestaurantPage-content-main-content-articleCard').first().click();
  cy.get('.ReactModal__Content').should('contain','Pizza de queso');
 });
 it('adds a product to the guest cart with a stable UUID', () => {
  visitPage('/restaurant/10');
  cy.get('.RestaurantPage-content-main-content-articleCard').first().click();
  cy.get('.ProductModal').contains('button', /Agregar|A?adir/).click();
  cy.window().should(win => {
   const cart=JSON.parse(win.localStorage.getItem('cart'));
   expect(cart.items).to.have.length(1);
   expect(cart.items[0].uniqueKey).to.match(/^[0-9a-f-]{36}$/);
   expect(cart.total).to.equal(25000);
  });
 });
});
