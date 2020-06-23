import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import {Switch, Route} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import config from './config';

import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Nav from './components/Nav'
import Signin from './components/Signin'
import Signup from './components/Signup'
import UserMain from './components/UserMain'
import CreateGame from './components/CreateGame'
import GameDetail from './components/GameDetail'
import TeamsInfo from './components/TeamsInfo'
import TeamDetail from './components/TeamDetail'








class App extends React.Component {


  state = {
    loggedInUser: null,
    games:[]
  }

  getUser(){
    axios.get(`${config.API_URL}/user`, {withCredentials: true})
    .then((res) => {
      this.setState({
        loggedInUser: res.data
      })
    })
      
  }

  getGames = () => {
    axios.get(`${config.API_URL}/user-main`)
      .then((res) => {
        this.setState({
          games: res.data
        })
      })
      .catch((err) => {
        if(err.response.status === 401) {
          this.props.history.push('/')
        }
      })  
  }

  componentDidMount(){
    this.getGames();
    if (!this.state.loggedInUser) {
      this.getUser();
    }
  }

  handleSignUp = (e) => {
    e.preventDefault()
    let email = e.target.email.value;
    let username = e.target.username.value
    let password = e.target.password.value
    let location = e.target.location.value
    axios.post(`${config.API_URL}/sign-up`, { //FROM CONFIG.JS
      email: email,
      username: username,
      password: password,
      location: location
      
    }, { withCredentials: true}) //CHECKS COOKIES
    .then((res) => {
      console.log('Working')
      console.log(this.props)
        this.setState({
          loggedInUser: res.data
        }, () => {
          this.props.history.push('/user-main')
        })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleSignIn = (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value
    
    axios.post(`${config.API_URL}/sign-in`, {
      email: email,
      password: password
    }, {withCredentials: true})
    .then((res) => {
      this.setState({
        loggedInUser: res.data
      }, () => {
        this.props.history.push('/user-main')
      })
    })
  }

  handleLogout = () => {
    console.log(document.cookie)
    axios.post(`${config.API_URL}/logout`, {}, { withCredentials: true})
    .then((res) => {
      // console.log(res)
      this.setState({
        loggedInUser: null
      }, () => {
        this.props.history.push('/')
      })
    })
  }


  handleAddGame = (e) => {
    e.preventDefault()
    let date = e.target.date.value
    let location = e.target.location.value
    let maxPlayers = e.target.maxPlayers.value

    axios.post(`${config.API_URL}/create-game`, {
      date: date,
      location: location,
      maxPlayers: maxPlayers,
      createdBy: this.state.loggedInUser.username
    }, {withCredentials: true})
    .then((res) => {
      this.setState({
        games: [...this.state.games, res.data]
      }, () => {
        this.props.history.push('/user-main')
      })
      // this.setState({} , function)
    })
    .catch((err) => {
      if(err.response.status === 401) {
        console.log(err.response.status)
      }
    })
}

// handleJoinGame = () => {
  
//   this.setState({

//   })
//     }





  render() {
    const {loggedInUser} = this.state
    return (
      <div >
      <Nav 
      loggedInUser={this.state.loggedInUser}
      onLogout={this.handleLogout}
       />
        <Switch>
          <Route exact path="/"  render={() => {
                return <Home />
              }}/>
          <Route path="/sign-in"  render={() => {
              return <Signin 
              onSignIn={this.handleSignIn} />
            }}/>    
          <Route path="/sign-up"  render={() => {
              return <Signup onSignUp = {this.handleSignUp} />
            }}/>  
          <Route path="/user-main"  render={() => {
              return <UserMain 
              loggedInUser={loggedInUser}
              games={this.state.games}
              onJoinGame={this.handleJoinGame}
              />
            }}/>  
          <Route path="/team-info"  render={() => {
              return <TeamsInfo 
              loggedInUser={loggedInUser} />
            }}/> 
          <Route path="/create-game"  render={() => {
              return <CreateGame 
              loggedInUser={loggedInUser} 
              onAddGame={this.handleAddGame}  
              />
            }}/>  
           <Route path="/:gameId"  render={(routeProps) => {
              return <GameDetail 
              loggedInUser={loggedInUser} 
              {...routeProps}
               
              />
            }}/>   

        </Switch>
      </div>
    );

  }
  
}

export default withRouter(App)
