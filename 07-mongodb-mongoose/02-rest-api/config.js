module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test') ?
      'mongodb://localhost/6-module-2-task' :
      'mongodb+srv://user:testuser@cluster0.0ob8k.mongodb.net/module_7?retryWrites=true&w=majority',
  },
};
