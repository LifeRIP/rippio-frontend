import { visitPage } from '../support/app-fixtures';
describe('Navigation with local fixtures', () => {
 it('keeps help-page hash navigation working', () => {
  visitPage('/info');
  cy.get('.footer-information-button').click();
  cy.get('a[href="/info#questions"]').first().click();
  cy.location('hash').should('equal', '#questions');
  cy.get('#questions').should('be.visible');
 });
 it('renders the home and navigates to sign in', () => {
  visitPage('/');
  cy.get('.planIcon').should('have.length', 3);
  cy.get('a[href="/login"]').first().click();
  cy.location('pathname').should('equal', '/login');
  cy.get('.loginPage-form').should('exist');
 });
 it('protects checkout and restaurant management from anonymous visitors', () => {
  visitPage('/checkout');
  cy.location('pathname').should('equal', '/login');
  visitPage('/restaurantProfile/menu');
  cy.location('pathname').should('equal', '/login');
 });
 it('renders the 404 page for an unknown route', () => {
  visitPage('/migration-does-not-exist');
  cy.contains('404').should('exist');
 });
});
