import React from 'react';
import renderer from 'react-test-renderer';
import App from './App'

it('renders App', () => {
  const renderedApp = renderer.create(<App/>).toJSON();
  expect(renderedApp).toMatchSnapshot();
});
