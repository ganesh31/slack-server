import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Username already taken',
      },
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'The username can only contain letters and numbers',
        },
        len: {
          args: [3, 25],
          msg: 'The user name must be of length between 3 chars to 25 chars',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid Email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: 'The password must be of at least 5 chars of length',
        },
      },
    },
  }, {
    hooks: {
      afterValidate: async (user) => {
        // eslint-disable-next-line no-param-reassign
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: 'userId',
    });

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: 'userId',
    });
  };

  return User;
};
