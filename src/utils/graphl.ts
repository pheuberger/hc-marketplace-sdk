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
