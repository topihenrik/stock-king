import {createRoot} from 'react-dom/client'
import AppRouter from './AppRouter.jsx'
import './i18n.js'

createRoot(document.getElementById('root')).render(<AppRouter/>);
