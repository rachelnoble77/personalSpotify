import React, { Component } from 'react';
import './Login.css';

export default class Login extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                <h2>Welcome to my Spotify Playlist App, focused on BPM</h2>
                </div>
                <p className="App-intro">
                To get started, continue building out...
                </p>
                <a href={ process.env.REACT_APP_LOGIN }>
                    <button>Login</button></a>
                    <iframe src="https://open.spotify.com/embed?uri=spotify:track:6V3cRxxIGT5mOJX0xjjjqn" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
            </div>
        )
    }
}