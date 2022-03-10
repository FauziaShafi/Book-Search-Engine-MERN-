import { gql } from '@apollo/client';

export const GET_ME = gql`
  query tech {
    me {
      _id
      username
      email
      bookCount
      saveBooks {
          bookId
          authors
          description
          image
          link
          title
      }
    }
  }
`;

