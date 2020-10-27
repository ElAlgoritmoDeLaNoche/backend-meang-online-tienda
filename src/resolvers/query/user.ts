import { IResolvers } from 'graphql-tools';
import UseersService from '../../services/users.service';

const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, context){
      return new UseersService(_, __, context).items();
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