import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import CustomRoutes from './route/Route';
import store from './redux';
import { ThemeProvider } from './theme/ThemeContext';
import { GlobalStyles } from './theme/GlobalStyles';
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyles />
        <Router>
          <CustomRoutes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
