import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Page404 } from './Page404';

export function RouteError() {
    const error = useRouteError();

    if (isRouteErrorResponse(error) && error.status === 404) {
        return <Page404 />;
    }

    return (
        <div className="background-container">
            <div className="information-container route-error" role="alert">
                <h2>No pudimos cargar esta página</h2>
                <p>Ocurrió un error al mostrar el contenido. Intenta recargar la página.</p>
                {import.meta.env.DEV && (
                    <pre className="route-error-details">{error?.stack || error?.message || String(error)}</pre>
                )}
                <button type="button" className="information-container-button" onClick={() => window.location.reload()}>
                    Recargar página
                </button>
                <Link to="/">Volver al inicio</Link>
            </div>
        </div>
    );
}
