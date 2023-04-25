import logo from './logo.svg';
import Button from './Button.js';
import Gamer from './Gamer.js';
import './App.css';
import { Component } from 'react';

const newGamer = {
  name: '',
  number: 0,
  enabled: false,
  steps: 0,
  scores: []
}

const bestScore = {
  name:'', score:0
}

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      gamers: [newGamer],
      displayInput: true,
      startGame: false,
      bestGamers: []
    };
  }

  handleChange = (event) => {
    let gamers = structuredClone(this.state.gamers);
    gamers[gamers.length - 1].name = event.target.value;
    this.setState({ gamers: gamers });
  }

  handlePress = (event) => {
    let type = event.target.value;
    let gamers = structuredClone(this.state.gamers);

    if (type == "Save the Gamer Name") {
      if (gamers[gamers.length - 1].name == '') {
        alert("You did not enter a name!");
        return;
      }
      for (let i = 0; i < gamers.length - 1;i++) {
        if (gamers[i].name == gamers[gamers.length - 1].name) {
          alert("This name already exists.\n Please choose another name");
          return;
        }
      }
      this.setState({ displayInput: false });
    } else if (type == "Add Gamer") {
      gamers.push(newGamer);
      this.setState({ gamers: gamers });
      this.setState( {displayInput: true} );
    } else if (type == "Start game") {
      gamers.forEach(gamer => gamer.number = Math.floor(Math.random() * 100));
      gamers[0].enabled = true;
      this.setState( {startGame: true} );
      this.setState({ gamers: gamers });
    }
    
  }

  handleGameClick = (event, gamerID) => {
    let action = event.target.value;
    let gamers = structuredClone(this.state.gamers);
    let currentGamer = Object.assign({}, gamers[gamerID]);
    if (action == "+1") {
      currentGamer.number += 1;
    } else if (action == "-1"){
      currentGamer.number -= 1; 
    }else if (action == "*2"){
      currentGamer.number *= 2; 
    }else if(action == "/2"){
      currentGamer.number /= 2; 
    } else {
      console.log(currentGamer);
      this.handleEndOfGameClick(event, gamerID);
      return;
    }
    //after the gamer did some action, make him disabled and add a step
    currentGamer.steps++;
    if (currentGamer.number == 100) {
      this.updateBestGamers(currentGamer.name, currentGamer.steps);
      currentGamer.scores.push(currentGamer.steps);
      gamers[gamerID] = Object.assign({}, currentGamer);
    } else {
      currentGamer.enabled = false;
      gamers[gamerID] = Object.assign({}, currentGamer);
      // Advance to the next gamer
      let nextGamerIndex = (gamerID + 1) % gamers.length;
      let nextGamer = Object.assign({}, gamers[nextGamerIndex]);
      nextGamer.enabled = true;
      gamers[nextGamerIndex] = Object.assign({}, nextGamer);
    }
    this.setState({ gamers: gamers });
  }

  handleEndOfGameClick = (event, gamerID) => {
    let action = event.target.value;
    let gamers = structuredClone(this.state.gamers);
    let currentGamer = Object.assign({}, gamers[gamerID]);

    if (action == 'New Game') {
      currentGamer.number = Math.floor(Math.random() * 100);
      currentGamer.enabled = false;
      currentGamer.steps = 0;
      gamers[gamerID] = Object.assign({}, currentGamer);
    } else {
      gamers.splice(gamerID, 1);
      gamerID--;
    }

    // Advance to the next gamer
    let nextGamerIndex = (gamerID + 1) % gamers.length;
    let nextGamer = Object.assign({}, gamers[nextGamerIndex]);
    nextGamer.enabled = true;
    gamers[nextGamerIndex] = Object.assign({}, nextGamer);
    
    this.setState({ gamers: gamers });
    console.log(gamers);
  }
  
  updateBestGamers = (name, score) => {
    let bestGamers = structuredClone(this.state.bestGamers);
    if (bestGamers.length < 3) {
      let index = -1;
      for (let i = 0; i < bestGamers.length; i++){
        if (name == bestGamers[i].name) {
          index = i;
        }
      }
      // if this gamer does not exist in bestGamers, add him
      if (index == -1) {
        let newBs = bestScore;
        newBs.name = name;
        newBs.score = score;
        bestGamers.push(newBs);
      } else {
        if (score < bestGamers[index].score) {
          bestGamers[index].score = score;
        }
      }
    }
    else {
      let scores = [];
      for (let bestGamer in bestGamers) {
        scores.push(bestGamer.score);
      }
      let indexOfMax = -1;
      let done = false;
      for (let i = 0; i < bestGamers.length; i++) {
        if (name == bestGamers[i].name) {
          done = true;
          if (score < bestGamers[i].score) {
            bestGamers[i].score = score;
            break;
          }
        }
      }
      if (!done) {
        for (let i = 0; i < bestGamers.length; i++) {
          if (score < bestGamers[i].score) {
            indexOfMax = scores.indexOf(Math.max(scores));
          }
        }
      }
      
      if (indexOfMax != -1) {
        bestGamers.splice(indexOfMax, 1);
        let newBs = bestScore;
        newBs.name = name;
        newBs.score = score;
        bestGamers.push(newBs);
      }
    }

    bestGamers.sort((a,b) => a.score - b.score); 
    this.setState({ bestGamers: bestGamers }); 
  }

  render() {
    return (
      <div id="gameBoard">
          <h1>GET TO 100</h1>
          {!this.state.startGame &&
          <div id="register">
            <label>Enter the names of the gamers:</label>
            <br></br>
            {this.state.displayInput && <input id='name' onChange={this.handleChange}></input>}
            {this.state.displayInput && <Button value="Save the Gamer Name" onClick={this.handlePress} />}
            <br></br>
            <Button value="Add Gamer" onClick={this.handlePress} disabled={this.state.displayInput} />
            <Button value="Start game" onClick={this.handlePress} disabled={this.state.displayInput}/>
        
          </div>}
        <div id="gamersBoards">
        {this.state.startGame &&
          this.state.gamers.map((gamer, index) => <Gamer key={index} id={index} gamer={gamer} gameFunc={this.handleGameClick} />)}
        </div>
        
        {this.state.startGame &&
          <div className="bestGamersBoard">
            <h2>THE BEST GAMERS:</h2><br></br>
            {this.state.bestGamers.map(gamer =>
            (<div key={gamer.name}>
              <label>name: <span>{gamer.name}</span>
                <label>score: </label><span>{gamer.score}</span></label></div>))}
          </div>}
        
      </div>);
  }
}



export default App;
