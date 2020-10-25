import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Route404 from './components/Route404';
import Main from './pages/Main';
import ProtectedPage from './pages/ProtectedPage';

const ProtectedRoute = ({
  component: Component,
  authorized,
  ...routeProps
}) => (
  <Route
    {...routeProps}
    render={(props) => {
      if (authorized) {
        return <Component {...props} />;
      }

      return <Redirect to={{ pathname: '/', state: { from: props.location } }} />; // eslint-disable-line
    }}
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authorized: PropTypes.bool.isRequired,
};

const Entrance = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  return (
    <Fragment>
      <Header />
      <Switch>
        <Route path="/" exact component={Main} />
        <ProtectedRoute path="/protected" exact component={ProtectedPage} authorized={!!accessToken} />
        <Route component={Route404} />
      </Switch>
    </Fragment>
  );
};

export default Entrance;
