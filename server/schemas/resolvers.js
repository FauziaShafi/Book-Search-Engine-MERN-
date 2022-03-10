const { AuthenticationError, UserInputError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const foundUser = await User.findOne({ _id: context.user._id });

      if (!foundUser) {
        throw new AuthenticationError( 'Cannot find a user with this id!');
      }

      return foundUser;
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
     try {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
       
     } catch (error) {

       throw new UserInputError("Username and email is invalid");
     }
    },



    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No User with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { bookData }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        {
          $addToSet: { savedBooks: bookData },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedUser) {
        throw new AuthenticationError("Can't save the book, please save the book");
      }
      return updatedUser; 

    },

    removeBook: async (parent, { bookId }, context) => {
     const updatedUser= await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: {  savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError("Can't delete the book, please login");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;
