import React from 'react';
import { connect } from 'react-redux';

import './App.scss';
import Minesweeper from '../Minesweeper/Minesweeper';
import Scoreboard from '../Scoreboard/Scoreboard';

const App = ({ flags, gameState, minefield, mines, moves, statemap }) => (
  <div className="app">
    <div className="minefield-wrapper">
      <Scoreboard flags={flags} gameState={gameState} mines={mines} moves={moves} />

      <Minesweeper
        gameState={gameState}
        minefield={minefield}
        statemap={statemap}
      />
    </div>
  </div>
);

const mapStateToProps = state => ({
  flags: state.flags,
  gameState: state.gameState,
  minefield: state.minefield,
  mines: state.mines,
  moves: state.moves,
  statemap: state.statemap
});

export default connect(mapStateToProps)(App);
