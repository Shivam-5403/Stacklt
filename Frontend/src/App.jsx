
import './App.css'
import ListTodoComponent from './components/ListTodoComponent'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TodoComponent from './components/TodoComponent'
import RegisterComponent from './components/RegisterComponent'
import LoginComponent from './components/LoginComponent'
import { isUserLoggedIn } from './services/AuthService'
import HomePage from './components/HomeComponent'
import AskQuestion from './components/AskComponent'
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

        {/* http://localhost:8080  */}
        <Route path='/todos' element={ 
          <AuthenticateRoute>
            <ListTodoComponent/>
          </AuthenticateRoute>
           }>


        </Route>
        <Route path='/' element={ 
            <HomePage/>
           }>
        </Route>

        <Route path='/ask-question' element={ 
            <AskQuestion/>
           }>
        </Route>

        {/* http://localhost:8080/add-todo */}
        <Route path='/add-todo' element = {
          <AuthenticateRoute>
            <TodoComponent/>

          </AuthenticateRoute>
             }></Route>

        {/* http://localhost:8080/update-todo */}
        <Route path='/update-todo/:id' element = { <AuthenticateRoute>
            <TodoComponent/>
 
          </AuthenticateRoute> }></Route>

        {/* http://localhost:8080/register */}
        <Route path='/register' element = { <RegisterComponent/> }></Route>

        {/* http://localhost:8080/login */}
        <Route path='/login' element={ <LoginComponent/> }></Route>
      </Routes>

      <FooterComponent/>

    </BrowserRouter>

    </>
  )
}

export default App
