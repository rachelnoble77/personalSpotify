import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/users';

class Private extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }

    componentDidMount() {
        this.props.getUser();
    }
    render() {
        return (
            <div className=''>
                <h1>beginning of Spotify App...</h1><hr />
                <p>Username: { this.props.user ? this.props.user.user_name : null }</p>
                <p>Email: { this.props.user ? this.props.user.email : null }</p>
                <p>ID: { this.props.user ? this.props.user.auth_id : null }</p>
                <a href='http://localhost:3030/auth/logout'><button>Logout</button></a>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, {getUser} )(Private)