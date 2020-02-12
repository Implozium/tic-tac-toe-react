import React, { Component } from "react";
import Grid from './Grid';
import GridU from './GridU';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div>
            <Grid size={ 3 }></Grid>
            <Grid size={ 4 }></Grid>
            <Grid size={ 5 } length={ 4 }></Grid>
            <GridU size={ 5 } length={ 4 }></GridU>
        </div>;
    }
}