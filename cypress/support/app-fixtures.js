const legacy = 'https://firebasestorage.googleapis.com/v0/b/rippio.appspot.com/o/missing.png?alt=media';
const broken = '/__missing_media__/photo.webp';
const restaurant = { id: 10, nombre: 'Pizza de la casa', img_icon: legacy, img_banner: legacy, calificacion: 4.7 };
const products = [
    { id: '101', nombre: 'Pizza de queso', img_product: legacy, descripcion: 'Queso y tomate en masa artesanal.', costo_unit: 25000, disponible: true },
    { id: '102', nombre: 'Ensalada fresca', img_product: broken, descripcion: 'Vegetales frescos para acompañar.', costo_unit: 18000, disponible: true },
    { id: '103', nombre: 'Arroz especial', img_product: '', descripcion: 'Arroz con vegetales.', costo_unit: 19000, disponible: true },
    { id: '104', nombre: 'Hamburguesa de la casa', img_product: '/media/food/burger.webp', descripcion: 'Con queso y vegetales.', costo_unit: 22000, disponible: true },
];
const menu = { 1: { nombre: 'Más pedidas', productos: Object.fromEntries(products.map(p => [p.id, p])) } };
const payment = { id: 1, id_metodo_pago: 1, numero: '4111111111111111', expiracion: '12/29', cvv: '123', nombre: 'Cliente', apellido: 'Prueba' };
const banks = [{ id: 1, nombre: 'Banco de ejemplo', card_icon: legacy }, { id: 2, nombre: 'Otro banco', card_icon: broken }, { id: 3, nombre: 'Banco local', card_icon: '/media/illustrations/payment-card.svg' }];
export const userFor = role => ({ id: role === 3 ? 10 : 20, tipo_usuario: role, nombre: role === 3 ? restaurant.nombre : 'Cliente Prueba', apellido: 'Prueba', email: 'demo@example.test', telefono: '3000000000', estado: true, creditos: 0, img_icon: legacy, img_banner: legacy });

export function visitPage(route, role, handlers = {}, session = {}) {
    const user = session.user || userFor(role || 1);
    const retiredRequests = [];
    cy.intercept('https://firebasestorage.googleapis.com/**', req => {
        retiredRequests.push(req.url);
        req.reply({ statusCode: 404 });
    });
    cy.wrap(retiredRequests).as('retiredRequests');
    cy.intercept('**/__missing_media__/**', { statusCode: 404 });
    cy.intercept('**/reverse-geocode-client*', { city: 'Tuluá', principalSubdivision: 'Valle del Cauca' });
    cy.intercept('**/colombia.min.json', [{ id: 1, departamento: 'Valle del Cauca', ciudades: ['Tuluá'] }]);
    cy.intercept({ pathname: '/api/**' }, req => {
        const pathname = new URL(req.url).pathname;
        const handler = handlers[req.method + ' ' + pathname];
        if (handler) { handler(req); return; }
        if (req.method !== 'GET') throw new Error('Unexpected mutation: ' + req.method + ' ' + pathname);
        let body = [];
        if (pathname.includes('/user_data/getById/')) body = [user];
        else if (pathname.includes('/getCatAndProdByResId/')) body = menu;
        else if (pathname.includes('/getProfileById/')) body = { ...restaurant, direccion: 'Tuluá, centro', horario: [{ day: 'Lunes', open: '08:00:00', close: '22:00:00' }] };
        else if (pathname.includes('/restaurant/PageRestaurant')) body = [restaurant, { ...restaurant, id: 11, nombre: 'Comida Asiática', img_icon: '', img_banner: broken }, { ...restaurant, id: 12, nombre: 'La Huerta', img_banner: '/media/food/salad.webp' }];
        else if (pathname.includes('/restaurant/getTopByCity')) body = [restaurant, { ...restaurant, id: 11 }, { ...restaurant, id: 12 }];
        else if (pathname === '/api/search') body = [{ ...restaurant, productos: products }];
        else if (pathname.includes('/category/getAll')) body = [{ id: 1, nombre: 'Comida rápida' }, { id: 2, nombre: 'Asiática' }];
        else if (pathname.includes('/most_request/')) body = [{ category: 'Pizza' }, { category: 'Ensaladas' }, { category: 'Hamburguesas' }];
        else if (pathname.includes('/plan/getAll')) body = [1, 2, 3].map(id => ({ id, nombre: ['Básico', 'Plus', 'Premium'][id - 1], precio: id * 5000, descripcion: 'Descubre nuevos sabores,Disfruta tus favoritos' }));
        else if (pathname.includes('get_type_payment_methods')) body = banks;
        else if (pathname.includes('get_payment_methods')) body = [payment];
        else if (pathname.includes('get_address_by_id')) body = [{ id: 1, ciudad: 'Test City', barrio: 'Centro', tipo_via: 'Calle', numero_via: '1', numero_uno: '2', numero_dos: '3', observaciones: 'Fixture only' }];
        else if (pathname.includes('/cart/get')) body = [{ ...products[0], id_producto: 101, cost_unit: 25000, cantidad_prod: 1, id_restaurante: 10, nombre_restaurante: restaurant.nombre, observacion: 'N/A' }];
        req.reply({ statusCode: 200, body });
    });
    cy.visit(route, {
        onBeforeLoad(win) {
            win.localStorage.clear();
            win.localStorage.setItem('fix6', 'true');
            win.localStorage.setItem('location', JSON.stringify({ city: 'Tuluá', principalSubdivision: 'Valle del Cauca' }));
            if (role) {
                win.localStorage.setItem('token', session.token || 'visual-test-token');
                win.localStorage.setItem('user', JSON.stringify(user));
            }
            Object.defineProperty(win.navigator, 'geolocation', { configurable: true, value: {
                getCurrentPosition: success => success({ coords: { latitude: 4.08, longitude: -76.19 } }),
            } });
        },
    });
}

export function checkImages() {
    // Query again on retries: React can replace menu nodes while its requests settle.
    cy.get('img').should($images => {
        expect($images.length).to.be.greaterThan(0);
        for (const image of $images) {
            expect(image.complete, image.src).to.equal(true);
            expect(image.naturalWidth, image.src).to.be.greaterThan(0);
        }
    });
    cy.get('@retiredRequests').should('have.length', 0);
}
