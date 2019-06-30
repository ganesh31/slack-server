import { formatErrors } from '../../utils';
import { requiresAuth } from '../../permissions';
export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) =>
        await models.Team.findAll(
          {
            where: { owner: user.id }
          },
          { raw: true }
        )
    )
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const team = await models.Team.create({ ...args, owner: user.id });
          await models.Channel.create({
            name: 'general',
            public: true,
            teamId: team.id
          });
          return {
            ok: true,
            team
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
