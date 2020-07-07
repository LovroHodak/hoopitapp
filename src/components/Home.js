import React from 'react';
import Map from './Map'
import axios from 'axios'
import {Link} from 'react-router-dom'

import config from '../config';
import hoopitappLogo from '../images/hoopitapp-logo.png'
import nextButton from '../images/next-button.png'
import userImg from '../images/combined-shape-copy.png'
import dateImg from '../images/combined-shape.png'
import group2 from '../images/group-2.png'
import RadialChart from './RadialChart'

export default class Home extends React.Component {

    state={
        games: []
    }
    
    componentDidMount(){
        this.getGames()
    }
    getGames = () => {
        axios.get(`${config.API_URL}/main`, {withCredentials: true})
          .then((res) => {
            this.setState({
              games: res.data
            })
            console.log('GOT GAMES')
          })
          .catch((err) => {
            if(err.response.status === 401) {
              this.props.history.push('/')
            }
          })  
      }
      
        render(){

            return(

                <div >
                    <div class="jumbotron jumbotron-fluid">
                        <div class="container">
                            <h4 class="display-6 primary-font welcome-text">JOIN A BASKETBALL GAME ANYWHERE YOU ARE</h4>
                            <p class="lead"></p>
                        </div>
                    </div>

                <div className=" page-containers">
                    
                        <h3 class="user-main-header second-font near-you-text">Discover games <br></br>around your area</h3>
                            <p class="lead"></p>
                        
                        
                            <p class="second-font take-part-text">Take part in one of the games played near you, get to meet your team for the match of the day </p>
                            <p class="lead"></p>
                        


                    <div>
                    <div className="game-cards">
                    {       //SHUFFLE GAMES AND GET THE FIRST 3
                        this.state.games.sort(() => 0.5 - Math.random()).slice(0,3).map((el, index) => {
                                
                            return <div class="card each-card">
                                    <div  key={index} id="game">
                                    <img class="card-img-top" src="https://source.unsplash.com/400x250/?basketball,court"  alt="..."></img>
                                    <div className="card-content">
                                        <div className="card-text">
                                        <p className="second-font created-by-name"><img src={userImg}></img>{el.createdBy}</p>
                                            <p className="second-font"><img src={dateImg}></img>{el.date}</p>
                                            <p className="second-font location-text" ><img src={group2}></img>{el.location}</p>
                                        </div>
                                    
                                    <div className="chart-div">
                                    <RadialChart
                                        progress={el.players.length/el.maxPlayers*100}
                                        color="#C9082A"
                                        number={el.players.length+'/'+el.maxPlayers}
                                        text={(el.players.length + 2 === el.maxPlayers) || (el.players.length + 1 === el.maxPlayers) ?  'Almost Full' : 'Full'}
                                    />
                                    </div>
                                    </div>
                                    <br></br>
                                    
                                </div>
                                <Link to={this.props.loggedInUser?`/${el._id}/admin`:`/sign-up`}><button className=" card-buttons">View Details<img className="next-button" src={nextButton}></img></button></Link>
                            </div>
                                  
                            })
                        }

                        </div>

                    </div>

                    </div>
                    

            
                </div>
            )

        }
        

    
    

    
}
