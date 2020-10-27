import { IResolvers } from 'graphql-tools';
import UseersService from '../../services/users.service';

const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, { page, itemsPage }, context){
      return new UseersService(_, {
        pagination: { page, itemsPage }
      }, context ).items();
    },

    async login(_, { email, password }, context){
      return new UseersService(_, { user: { email, password } }, context).login();
    },

    me(_, __, { token }){
      return new UseersService(_, __, { token }).auth();
    },

  }
};

export default resolversUserQuery;