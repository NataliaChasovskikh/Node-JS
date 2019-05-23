import React, { Component} from 'react';
import NoteEditor from './NoteEditor';
import NoteList from './NoteList';
import axios from 'axios';
import './App.css';

export default class App extends Component {
  state = {  
    notes: [],
  };

  handleAddNote(text){
    axios.post("localhost:3001\notes")
    .then(data => this.setState(prevState => ({
      notes:[data, ...prevState.notes]
    })))
  };

  render() {
    const {notes} = this.state
    return (
      <>
      <h2>Notes App</h2>
      <NoteEditor onSubmit={this.handleAddNote}/>
      <NoteList notes={notes}/>
      </>
    );
  }
};

