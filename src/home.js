import React from 'react'
import Login from './Login'
import 'bootstrap/dist/css/bootstrap.css';

class Home extends React.Component {

    render() {

        return (
            <div className="col-md-10 noPadding">
                <div className="row">
                    <Login />
                </div>
            </div>
        );
    }
}

export default Home;




