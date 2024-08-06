import React from 'react';
import ReactDOM from 'react-dom/client';
import  "core-js/es";
import  "react-app-polyfill/ie9";
import  "react-app-polyfill/stable";
import './reset.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const data: any = localStorage.getItem('themeConfig_honghu');
const themeConfig = JSON.parse(data) || {};

root.render(
	<ConfigProvider
		locale={locale}
		theme={{
			token: themeConfig
		}}
	>
		<App />
	</ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
