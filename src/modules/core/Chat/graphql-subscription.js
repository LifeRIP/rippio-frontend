import { gql } from "@apollo/client";

export const SUSCRIBE_BY_ORDER_ID = gql`
  subscription ($idPedido: ID!, $token: String!) {
    listenOrderMessages(id_pedido: $idPedido, token: $token) {
      id
      tipo_usuario
      fecha
      img_icon
      mensaje
    }
  }
`;
