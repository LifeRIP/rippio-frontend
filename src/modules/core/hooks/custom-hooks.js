import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client/react";
import { useAuth } from "@m/core/hooks/useAuth";
import { useState } from "react";
import { getOrderDetailByID } from "@/api/order";
import { useEffect } from "react";
import { GET_MESSAGES_BY_ORDER_ID } from "../Chat/graphql-queries";
import { POST_MESSAGE_IN_ORDER_ID } from "../Chat/graphql-mutations";
import { SUSCRIBE_BY_ORDER_ID } from "../Chat/graphql-subscription";


import { getUserData } from '@/api/auth.js';
import { useCart } from '@m/core/hooks/useCart';

export const useDetailOrderModal = (order) => {
  //Estado mientras se cargan los productos
  const [loading, setLoading] = useState(true);

  //Estado para guardar los productos
  const [products, setProducts] = useState(null);

  //Estado para la dirección de envío
  const [direction, setDirection] = useState(null);

  //Estado para el método de pago
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(
    () => {
      if (order) {
        getOrderDetailByID(order.id)
          .then((response) => {
            // console.log(response.data)
            response.data.forEach((product) => {
              product.observacionp =
                product.observacionp == "N/A" ||
                product.observacionp == "" ||
                !product.observacionp
                  ? ""
                  : product.observacionp;
              product.observaciond =
                product.observaciond == "N/A" ||
                product.observaciond == "" ||
                !product.observaciond
                  ? ""
                  : product.observaciond;
            });
            const direction = `${response.data[0].ciudad}, ${response.data[0].barrio}, ${response.data[0].tipo_via} ${response.data[0].numero_via} # ${response.data[0].numero_uno} - ${response.data[0].numero_dos}`;
            const observacion_direction = response.data[0].observaciond;
            const newDirection = [direction, observacion_direction];
            setDirection(newDirection);
            const paymentMethod =
              response.data[0].numero.slice(0, 4) +
              " ❋❋❋❋ ❋❋❋❋ " +
              "❋❋" +
              response.data[0].numero.slice(-2);
            setPaymentMethod(paymentMethod);
            setProducts(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
    },
    [order]
  );

  const setNull = () => {
    setProducts(null);
    setDirection(null);
    setPaymentMethod(null);
  };

  return { products, direction, paymentMethod, loading, setNull };
};

function cacheMessage(client, id, token, message) {
  if (!message) return;
  client.cache.updateQuery({
    query: GET_MESSAGES_BY_ORDER_ID,
    variables: { idPedido: id, token },
  }, (data) => ({ getchat_order: [...(data?.getchat_order || []), message] }));
}

export const useChatQuery = (id) => {
  const token = useAuth((state) => state.token);
  return useQuery(GET_MESSAGES_BY_ORDER_ID, {
    variables: { idPedido: id, token },
    skip: !id || !token,
    fetchPolicy: 'cache-and-network',
    // Also recovers any messages missed while the socket was unavailable.
    pollInterval: 15000,
  });
};

export const useChatMutation = (id) => {
  const token = useAuth((state) => state.token);
  const client = useApolloClient();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [createMessage, { loading: sending }] = useMutation(POST_MESSAGE_IN_ORDER_ID);
  const handleChange = (e) => setMessage(e.target.value);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (sending || !text) return;
    setError(null);
    try {
      const result = await createMessage({
        variables: { idPedido: id, mensaje: text, fecha: new Date().toISOString(), token },
      });
      cacheMessage(client, id, token, result.data.insertchat_order);
      setMessage('');
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje. Intenta nuevamente.');
    }
  };
  return { handleSendMessage, error, handleChange, message, sending };
};

export const useChatSubscription = (id) => {
  const client = useApolloClient();
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);
  return useSubscription(SUSCRIBE_BY_ORDER_ID, {
    variables: { idPedido: id, token },
    skip: !id || !token,
    onData: ({ data }) => {
      const message = data.data?.listenOrderMessages;
      cacheMessage(client, id, token, message);
      if (message && message.tipo_usuario !== user?.tipo_usuario &&
          typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('Nuevo mensaje', { body: message.mensaje });
      }
    },
  });
};
export const useStart = () => {
  const userId = useAuth((state) => state.user?.id);
  const token = useAuth((state) => state.token);
  const setUser = useAuth((state) => state.setUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const loadCartFromLocalStorage = useCart((state) => state.loadCartFromLocalStorage);
  const loadCartFromDatabase = useCart((state) => state.loadCartFromDatabase);
  const setTokenInCart = useCart((state) => state.setTokenInCart);

  useEffect(() => {
    if (token) {
      console.log("cargada de database");
      setTokenInCart(token);
      loadCartFromDatabase(token);
    } else {
      setTokenInCart(null);
      loadCartFromLocalStorage();
    }
  }, [token, loadCartFromDatabase, loadCartFromLocalStorage, setTokenInCart]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    let active = true;
    getUserData(userId).then(({ data }) => {
      if (active) setUser(data[0]);
    }).catch(console.error);
    return () => { active = false; };
  }, [isAuthenticated, userId, setUser]);

  useEffect(() => {
    const fix = window.localStorage.getItem('fix6') === 'true';
    const white = window.localStorage.getItem('white') === 'true';
    if (!fix) {
      window.localStorage.clear();
      window.localStorage.setItem("fix6", "true");
      if (white) {
        window.localStorage.setItem("white", "true");
      }
    }
  }, []);
};
