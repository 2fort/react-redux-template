import React from 'react';
import { Link } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signOut } from '../ducks/auth';

const useStyles = createUseStyles(() => ({
  header: {
    height: 40,
    marginBottom: 50,
    display: 'flex',
    alignItems: 'center',

    '& > *': {
      marginRight: 35,
    },
  },

  loginButton: {
    marginRight: 0,
    marginLeft: 'auto',
  },
}));

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  return (
    <div className={classes.header}>
      <Link to="/">Main</Link>
      <Link to="/protected">Protected Page</Link>

      {accessToken
        ? (
          <button type="button" onClick={() => { dispatch(signOut()); }} className={classes.loginButton}>
            Sign Out
          </button>)
        : (
          <button type="button" onClick={() => { dispatch(signIn('1234')); }} className={classes.loginButton}>
            Sign In
          </button>)}
    </div>
  );
};

export default Header;
