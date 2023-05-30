import React from 'react';
import 'src/css/reset.scss';
import 'src/css/global.scss';
import 'src/css/color.scss';
import './App.css';
import Comments from './features/comments/Comments';

function App() {
  return (
    <div className="App">
      <Comments />
    </div>
  );
}

export default App;
