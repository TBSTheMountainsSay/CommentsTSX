import React, { useCallback, useState } from 'react';
import 'src/css/reset.scss';
import 'src/css/global.scss';
import 'src/css/color.scss';
import './App.scss';
import Comments from './features/comments/Comments';
import { messages } from './Languages/Languages';
import { IntlProvider } from 'react-intl';

export type TLanguage = 'ru' | 'en';

function App() {
  const [language, setLanguage] = useState<TLanguage>('ru');

  const handleChangeLanguage = useCallback(() => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  }, [language]);

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
}

export default App;
