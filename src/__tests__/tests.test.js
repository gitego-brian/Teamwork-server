import appTests from './index/app.test';
import adminTests from './users/admin.test';
import loginTests from './users/login.test';
import signupTests from './users/signup.test';
import createArticleTests from './articles/create.test';
import deleteArticleTests from './articles/delete.test';
import getArticleTests from './articles/get.test';
import updateArticleTests from './articles/update.test';
import createCommentTests from './comments/create.test';
import deleteCommentTests from './comments/delete.test';

appTests();
signupTests();
loginTests();
adminTests();
createArticleTests();
getArticleTests();
updateArticleTests();
deleteArticleTests();
createCommentTests();
deleteCommentTests();
