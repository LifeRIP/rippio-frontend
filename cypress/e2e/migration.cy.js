import { visitPage, userFor } from '../support/app-fixtures';

describe('Dependency migration: checkout, management and real chat', () => {
  it('renders the updated charts and exports a PDF', () => {
    const paths = ['getMostPopularRestaurants', 'getMostRequestedDays', 'getAverageSpending', 'getMostSoldProducts', 'getMostRequested'];
    const handlers = Object.fromEntries(paths.map(path => [
      `GET /api/statistics/${path}`,
      req => req.reply({ xvalues: ['Fixture A', 'Fixture B'], yvalues: [10, 20], ylabel: 'Fixture values' }),
    ]));
    visitPage('/adminProfile/graphs', 2, handlers);
    cy.get('.graph canvas').should('have.length', 5);
    cy.get('.download_pdf_button').first().click();
    cy.readFile('cypress/downloads/Restaurantes populares hoy.pdf', 'binary', { timeout: 15000 }).should('include', '%PDF-');
  });
  it('submits checkout with the existing REST payload', () => {
    visitPage('/checkout', 1, {
      'POST /api/order/add': req => {
        req.alias = 'createOrder';
        req.reply({ message: 'Pedido creado correctamente', id: 1 });
      },
      'POST /api/chat/createchat_order': req => {
        req.alias = 'createChat';
        req.reply({ id: 1 });
      },
      'POST /api/cart/add': req => req.reply({ message: 'Fixture cart cleared' }),
      'DELETE /api/cart/empty': req => req.reply({ message: 'Fixture cart cleared' }),
    });
    cy.get('.CheckoutPage-Select').first().click();
    cy.get('[id*="option"]').first().click();
    cy.get('.CheckoutPage-Select').last().click();
    cy.get('[id*="option"]').first().click();
    cy.get('.CheckoutPage-content-item-content-button').click();
    cy.wait('@createOrder').its('request.body').should('include', {
      id_payment_method: 1, id_address: 1, use_credits: false, shipping_cost: 3000,
    });
    cy.wait('@createChat').its('request.body').should('include', { id_pedido: 1 });
    cy.location('pathname').should('equal', '/profile/orders');
  });

  it('keeps restaurant product nodes stable and edits without contacting Firebase', () => {
    visitPage('/restaurantProfile/menu', 3);
    cy.get('.RestaurantProfileMenu-manage-ddZone-product').should('have.length', 4);
    cy.get('.RestaurantProfileMenu-manage-ddZone-product').first().then($node => {
      cy.wrap($node).find('button').click();
      cy.get('.ReactModal__Content').should('contain', 'Pizza de queso');
      cy.get('.AddProductMenuModal-form-inputImage-Btn').trigger('mouseenter', { force: true });
      cy.get('[data-tippy-root]').should('contain', 'Intentaremos dar la mejor');
      cy.get('.RestaurantProfileMenu-manage-ddZone-product').first().then($current => {
        expect($current[0]).to.equal($node[0]);
      });
    });
  });

  it('updates restaurant hours through the migrated MUI Switch', () => {
    visitPage('/restaurantProfile/horarios', 3, {
      'POST /api/schedule/addSchedule': req => { req.alias = 'saveSchedule'; req.reply({ message: 'Saved' }); },
    });
    cy.get('input[type="checkbox"]').first().check({ force: true });
    cy.get('#openingTime input').clear().type('08');
    cy.contains('[id*="option"]', '08:00').click();
    cy.get('#closingTime input').clear().type('22');
    cy.contains('[id*="option"]', '22:00').click();
    cy.contains('button', 'Establecer horario').click();
    cy.wait('@saveSchedule').its('request.body').should(body => {
      expect(body.hora_inicio[0]).to.equal('08:00');
      expect(body.hora_fin[0]).to.equal('22:00');
    });
  });

  it('connects Apollo 4 to GraphQL 17 over HTTP and WebSocket for both roles', () => {
    cy.request('http://127.0.0.1:4010/api/__test__/session').then(({ body: session }) => {
      const order = {
        id: 1, nombre: 'Fixture restaurant', cliente: 'Fixture customer', estado: 'Pendiente',
        fecha: new Date().toISOString(), costo_total: 28000, creditos_usados: 0, costo_envio: 3000,
        productos: [{ nombre: 'Pizza de queso', cantidad: 1 }], img_icon: '/media/illustrations/restaurant.svg',
      };
      const handlers = {
        'GET /api/order/getByUserID': req => req.reply([order]),
        'GET /api/order/restaurant': req => req.reply([order]),
        'GET /api/order/getDetail': req => req.reply([{
          nombre: 'Pizza de queso', cantidad_prod: 1, costo_unit: 25000, numero: '4111111111111111',
          ciudad: 'Fixture city', barrio: 'Centro', tipo_via: 'Calle', numero_via: '1', numero_uno: '2', numero_dos: '3',
        }]),
      };
      visitPage('/profile/orders', 1, handlers, {
        user: { ...userFor(1), id: session.customer }, token: session.customerToken,
      });
      cy.contains('button', 'Ver detalles').click();
      cy.contains('button', 'Abrir chat').click();
      cy.get('.ChatModal-footer_input').type('Client migration message');
      cy.get('.ChatModal-footer form').submit();
      cy.get('.ChatModal-body').should('contain', 'Client migration message');
      cy.request({
        method: 'POST', url: 'http://127.0.0.1:4010/graphql',
        body: {
          query: 'mutation($token:String!){insertchat_order(id_pedido:"1",mensaje:"Restaurant realtime message",token:$token){id}}',
          variables: { token: session.restaurantToken },
        },
      }).its('body.errors').should('not.exist');
      cy.get('.ChatModal-body', { timeout: 5000 }).should('contain', 'Restaurant realtime message');
      visitPage('/restaurantProfile/orders', 3, handlers, {
        user: { ...userFor(3), id: session.restaurant }, token: session.restaurantToken,
      });
      cy.contains('button', 'Abrir chat').click();
      cy.get('.ChatModal-body').should('contain', 'Client migration message').and('contain', 'Restaurant realtime message');
      cy.get('.ChatModal-footer_input').type('Restaurant UI message');
      cy.get('.ChatModal-footer form').submit();
      cy.get('.ChatModal-body').should('contain', 'Restaurant UI message');
    });
  });
});
