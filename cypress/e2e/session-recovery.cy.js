describe('Home with incomplete stored sessions', () => {
    for (const session of [
        { name: 'invalid JSON', user: '{invalid', label: 'Ingresa' },
        { name: 'an HTML character saved as the user', user: JSON.stringify('<'), label: 'Ingresa' },
        { name: 'a profile without a name', user: JSON.stringify({ id: 20, tipo_usuario: 1 }), label: 'Mi perfil' },
    ]) {
        it(`renders with ${session.name} and rejects an invalid profile response`, () => {
            cy.intercept({ method: 'GET', pathname: '/api/**' }, req => {
                if (new URL(req.url).pathname.includes('/most_request/')) {
                    req.reply([{ category: 'Pizza' }]);
                } else {
                    req.reply([]);
                }
            });
            cy.intercept('GET', '**/api/user_data/getById/*', {
                headers: { 'content-type': 'text/html' },
                body: '<html>Vite fallback</html>',
            }).as('profile');
            cy.visit('/', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('fix6', 'true');
                    win.localStorage.setItem('token', 'test-session-token');
                    win.localStorage.setItem('user', session.user);
                    Object.defineProperty(win.navigator, 'geolocation', { configurable: true, value: {
                        getCurrentPosition: (_success, failure) => failure({ code: 1 }),
                    } });
                },
            });
            if (session.label === 'Mi perfil') cy.wait('@profile');
            cy.get('.mainContent-headerPrincipalPage .userText').should('have.text', `${session.label}`);
            cy.get('.route-error').should('not.exist');
        });
    }
});
