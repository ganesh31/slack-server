import { formatErrors } from '../../utils';
import { requiresAuth } from '../../permissions';
import { async } from 'rxjs/internal/scheduler/async';
export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) =>
        await models.Team.findAll({
          where: { owner: user.id },
          raw: true
        })
    )
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          await models.Team.create({ ...args, owner: user.id });
          return {
            ok: true
          };
        } catch (error) {
          console.log(error);
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },
  Team: {
    channels: async ({ id }, args, { models, user }) =>
      await models.Channel.findAll({ where: { teamId: id }, raw: true })
  }
};
