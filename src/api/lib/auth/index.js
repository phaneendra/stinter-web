/*!
 * Module dependencies.
 */
import local from './passport/local';
import facebook from './passport/facebook';
// import google from './passport/google';
// import twitter from './passport/twitter';
// import linkedin from './passport/linkedin';
// import github from './passport/github';

/**
 * Expose
 */
export default function (passport, option) {
  // use these strategies
  passport.use(local(option));
  passport.use(facebook(option));
  // passport.use(google);
  // passport.use(twitter);
  // passport.use(linkedin);
  // passport.use(github);
}
