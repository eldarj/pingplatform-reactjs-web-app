import React, { Component } from 'react'
import { connect } from 'react-redux'

class DataSpaceSearch extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="search d-flex align-items-center">
                <span>Search</span>
            </div>
        );
    }
}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(DataSpaceSearch)