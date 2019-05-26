import React from 'react';
import ReactDOM from 'react-dom'
import { Route, Link, HashRouter as Router, Switch, Redirect } from 'react-router-dom'

import './main.css';
import CreateProfile from './components/CreateProfile';

const routing = (
	<Router>
		<div className="container">
			<Switch>
				{/* {
					navLinks.map((link) => {
						return (
							link.link === '/' ?
								<Route exact path={link.link} key={link.link} component={link.component} />
								:
								<Route path={link.link} key={link.link} component={link.component} />
						)
					})
				} */}
				<Route exact path='/' component={CreateProfile} />
			</Switch>
		</div>
	</Router>
)

ReactDOM.render(routing, document.getElementById('main'));
