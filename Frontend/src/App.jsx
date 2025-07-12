
import './App.css'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterComponent from './components/RegisterComponent'
import LoginComponent from './components/LoginComponent'
import { isUserLoggedIn } from './services/AuthService'
import HomePage from './components/HomeComponent'
import AskQuestion from './components/AskComponent'
import QuestionPage from './components/Question'
// App is Base or root component
function App() {

  function AuthenticateRoute({children}){

    const isAuth = isUserLoggedIn();
    if(isAuth){
      return children;
    }
    
    return <Navigate to='/'/>
  }
  return (
    <>
    <BrowserRouter>      
    
      <HeaderComponent/>

      <Routes>
        {/* http://localhost:8080  */}
        <Route path='/login' element={ <LoginComponent/> }></Route>

        <Route path='/' element={ 
            <HomePage/>
           }>
        </Route>

        <Route path='/ask-question' element={ 
            <AskQuestion/>
           }>
        </Route>

        {/* http://localhost:8080/register */}
        <Route path='/register' element = { <RegisterComponent/> }></Route>
        <Route path='/question/:id' element = { <QuestionPage/> }></Route>

           
      </Routes>

      <FooterComponent/>

    </BrowserRouter>

    </>
  )
}

export default App
