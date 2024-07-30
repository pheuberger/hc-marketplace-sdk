import { Client } from "@urql/core";
import { graphql } from "gql.tada";

const fractionsByIdQuery = graphql(`
  query fractionsById($fraction_id: String!) {
    fractions(where: { hypercert_id: { eq: $fraction_id } }) {
      data {
        creation_block_timestamp
        fraction_id
        last_update_block_timestamp
        owner_address
        units
      }
    }
  }
`);

export const getFractionsById = async (fractionId: string, client: Client) => {
  const { data, error } = await client
    .query(fractionsByIdQuery, {
      fraction_id: fractionId,
    })
    .toPromise();

  if (error) {
    throw new Error(error.message);
  }

  return data?.fractions.data;
};

const ordersQuery = graphql(`
  query OrdersQuery($chainId: BigInt, $signer: String) {
    orders(where: { chainId: { eq: $chainId }, signer: { eq: $signer } }) {
      count
      data {
        id
        hypercert {
          hypercert_id
          creator_address
          contracts_id
          creation_block_number
          creation_block_timestamp
          id
          last_update_block_number
          last_update_block_timestamp
          metadata {
            allow_list_uri
            contributors
            description
            external_url
            id
            impact_scope
            impact_timeframe_from
            impact_timeframe_to
            name
            properties
            rights
            uri
            work_scope
            work_timeframe_from
            work_timeframe_to
          }
          token_id
          units
          uri
        }
        additionalParameters
        amounts
        chainId
        collection
        collectionType
        createdAt
        currency
        endTime
        globalNonce
        itemIds
        orderNonce
        price
        quoteType
        signature
        signer
        startTime
        strategyId
        subsetNonce
      }
    }
  }
`);

export const getOrders = async ({ chainId, signer }: { chainId?: BigInt; signer?: `0x${string}` }, client: Client) => {
  const { data, error } = await client
    .query(ordersQuery, {
      chainId,
      signer,
    })
    .toPromise();

  if (error) {
    throw new Error(error.message);
  }

  return data?.orders.data;
};
