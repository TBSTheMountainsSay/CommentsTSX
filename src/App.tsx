import React, { useCallback, useState } from 'react';
import 'src/css/reset.scss';
import 'src/css/global.scss';
import 'src/css/color.scss';
import './App.scss';
import Comments from './features/comments/Comments';
import { messages } from './Languages/Languages';
import { injectIntl, IntlProvider } from 'react-intl';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { changeLanguage } from './app.slice';
import moment from 'moment';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.app.language);

  const handleChangeLanguage = useCallback(() => {
    dispatch(changeLanguage());
  }, []);

  return (
    <IntlProvider
      messages={messages[language]}
      locale={language}
      defaultLocale="ru"
    >
      <div className="App">
        <Comments
          language={language}
          handleChangeLanguage={handleChangeLanguage}
        />
      </div>
    </IntlProvider>
  );
};

export default App;
