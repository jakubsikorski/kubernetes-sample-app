import React, {Component } from 'react'
import axios from 'axios';

class Prime extends Component {
	constructor(props){
		super(props)

		this.state = {
			num: '',
			result: 0
		}
	};

	handleNumChange = (event) => {
		this.setState({ num: event.target.value })
	};

	handleSubmit = async (event) => {
		event.preventDefault();
		const response = await axios.get(`/api/${this.state.num}`);
		this.state.result = response.data;
		this.setState({ result: this.state.result })
		console.log(response);
	};

	render() {
		const {result} = this.state
		return(
			<form onSubmit={this.handleSubmit}>
				<label>Number: </label>
				<input type="text" value={this.state.num} onChange={this.handleNumChange}/>
				<button style= {{marginLeft :15}} type="submit"> Prime? </button>
				<br/>
				{result}
			</form>
		)
	}
}

export default Prime
