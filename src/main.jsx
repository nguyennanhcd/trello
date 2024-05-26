import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      allowClose: false,
      dialogProps: { maxWidth: 'sm' },
      confirmationButtonProps: { color: 'warning', variant: 'outlined' },
      cancellationButtonProps: { color: 'info', variant: 'outlined' },
      buttonOrder: ['confirm', 'cancel']
    }}>
      <CssBaseline />
      <App />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </ConfirmProvider>
  </CssVarsProvider>
)
