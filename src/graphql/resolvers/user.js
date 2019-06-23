import { tryLogin } from '../../auth';
import { formatErrors } from '../../utils';

export default {
  Query: {
    getUser: (_parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (_parent, _args, { models }) => models.User.findAll(),
    doesUserExists: async (_parent, { username }, { models }) => {
      const response = await models.User.findOne({ where: { username } });
      if (response === null) {
        return false;
      }
      return true;
    },
  },
  Mutation: {
    register: async (_parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
    login: async (
      _parent,
      { password, username },
      { models, SECRET, SECRET2 }) => tryLogin(username, password, models, SECRET, SECRET2),
  },
};
