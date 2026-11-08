import { visitPage, userFor } from '../support/app-fixtures';
const handlers = {
 'POST /api/auth/login': req => { req.alias='login'; req.reply({token:'test-only-token', id:20}); },
 'POST /api/auth/register': req => { req.alias='register'; req.reply({statusCode:201, body:{message:'Registered'}}); },
 'POST /api/profile/add_payment_method': req => req.reply({message:'Fixture payment'}),
 'GET /api/user_data/getById/20': req => req.reply([userFor(1)]),
};
describe('Registration and login with isolated REST fixtures', () => {
 it('signs in and persists the authenticated session', () => {
  visitPage('/login', null, handlers);
  cy.get('.loginPage-form input[type="text"]').type('demo@example.test');
  cy.get('.loginPage-form input[type="password"]').type('test-password');
  cy.get('.loginPage-form').submit();
  cy.wait('@login').its('request.body').should('deep.equal',{email:'demo@example.test',password:'test-password'});
  cy.location('pathname').should('include','/profile');
  cy.window().its('localStorage').invoke('getItem','token').should('equal','test-only-token');
 });
 it('registers a customer and signs in after registration', () => {
  visitPage('/login', null, handlers);
  cy.get('#registerPage-button').click();
  const inputs={FirstName:'Migration',LastName:'Customer',Id:'12345678',Tel:'3000000000',Email:'migration@example.test',Pass:'test-password'};
  for(const [field,value] of Object.entries(inputs)) cy.get('#registerInput'+field).type(value);
  cy.get('.registerPage-form').submit();
  cy.wait('@register').its('request.body').should('include',{tipo_usuario:1,email:'migration@example.test'});
  cy.wait('@login');
  cy.location('pathname').should('include','/profile');
 });
});
