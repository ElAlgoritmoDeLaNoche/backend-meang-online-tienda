import resolversUserMutation from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers');

const mutationResolvers = GMR.merge([
  resolversUserMutation
]);

export default mutationResolvers;