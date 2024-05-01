import { Provider } from 'react-redux';

import { store } from './redux/store';
import { Router } from './router';



/**
 * Komponen yang membungkus Provider dan Router.
 * 
 * @returns {JSX.Element} Komponen React
 */
const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};



export { App };

