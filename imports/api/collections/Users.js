Accounts.onCreateUser(function (options, user) {
  user.roles = {};
  return user;
});
