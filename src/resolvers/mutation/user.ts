import { IResolvers } from 'graphql-tools';
import UseersService from '../../services/users.service';

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, context){
      return new UseersService(_, { user }, context ).register();
    },
    async updateUser(_, { user }, context){
      return new UseersService(_, { user }, context ).modify();
    },
    async deleteUser(_, { id }, context){
      return new UseersService(_, { id }, context ).delete();
    }
  }
};

export default resolversUserMutation;