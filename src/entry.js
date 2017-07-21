import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'


import sw from "!!file?publicPath=/&name=offline.js!babel!./offline";
import manifest from "!!file?publicPath=/&name=manifest.json!./manifest.json";

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register(sw).catch(err => {
		console.error("Could not register service worker",err)
	});
} else {
	console.error("Service workers are not supported")
}

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tacos:[]
		};
	}
	componentDidMount(){
		axios.get('json/data.json').then(data=>{
			this.setState({
				tacos: data.data
			})
		});
	}
	render() {
		return (
			<section className="container">
				<h1>Today tacos</h1>
				<div>
				{this.state.tacos.map(t=>(
					<div key={t.id}>
						<h2>{t.name}</h2>
						<span style={{color:'grey'}}>Price: ${t.price}</span>
						<p>{t.description}</p>
					</div>
				))}
				</div>
			</section>
		)
	}
}

render((<Main/>), document.getElementById('app'))


