import { Outlet } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css"

function App() {
  
  return (
    <>
    <ToastContainer/>
    <main >
     <Outlet/>
    </main>
    </>
    
  );
}

export default App;