import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './Navigation.css';
import * as sessionActions from '../../store/session'
import OpenModalButton from '../OpenModalButton';
import AddFundsModal from '../AddFundsModal';

function Navigation() {
	const sessionUser = useSelector(state => state.session.user);
	const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
	const [currentFunds, setCurrentFunds] = useState(0);

	const dispatch = useDispatch();
	const history = useHistory();

	const logout = (e) => {
		e.preventDefault();
		dispatch(sessionActions.logout());
		history.push('/')
		return null
	};
	useEffect(() => {
		if(sessionPortfolio != null){
			setCurrentFunds((sessionPortfolio?.portfolio?.current_funds || 'Loading...').toFixed(2))
		}
	}, [setCurrentFunds])

	if (!sessionUser) return null;
	else return (
		<div className='nav-wrapper'>
			<ul className='navigation-shell'>
				<div className='nav-top'>
					<div className='user-greeting-wrapper'>
						<div className='navigation-layer'>
							<li className='navigation-item'>
								<div className='nav-context'>
									Hello, {sessionUser ? sessionUser.first_name : null} {sessionUser ? sessionUser.last_name : null}
								</div>
							</li>
						</div>
					</div>
					<div className='navigation-layer'>
						<li className='navigation-item'>
							<NavLink to="/portfolio">
								<div className='nav-content-wrapper'>
									<div className='nav-svg'>
										<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill='#FFFFFF' d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" /></svg>
									</div>
									<div className='nav-context'>
										My Purrfolio
									</div>
								</div>
							</NavLink>
						</li>
					</div>
					<div className='navigation-layer'>
						<li className='navigation-item add-funds'>
							<div className='nav-content-wrapper'>
								<div className='nav-svg'>
									<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill='#FFFFFF' d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>
								</div>
								<div className='nav-context'>
									<OpenModalButton
									     buttonText={"Add Funds"}
										 modalComponent={< AddFundsModal />} />
								</div>
							</div>
						</li>
					</div>
					<div className='navigation-layer'>
						<li className='navigation-item'>
							<NavLink to="/watchlists">
								<div className='nav-content-wrapper'>
									<div className='nav-svg'>
										<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill='#FFFFFF' d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H512c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm96 64a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm104 0c0-13.3 10.7-24 24-24H448c13.3 0 24 10.7 24 24s-10.7 24-24 24H224c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24H448c13.3 0 24 10.7 24 24s-10.7 24-24 24H224c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24H448c13.3 0 24 10.7 24 24s-10.7 24-24 24H224c-13.3 0-24-10.7-24-24zm-72-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM96 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
									</div>
									<div className='nav-context'>
										My Watchlists
									</div>
								</div>
							</NavLink>
						</li>
					</div>
					<div className='navigation-layer'>
						<li className='navigation-item current-funds'>
							<p className="current-funds-context">Purrfolio Funds: </p>
							<p className='current-funds-number'>$ {sessionPortfolio ? sessionPortfolio?.portfolio?.current_funds : 'Loading...'}</p>
						</li>
					</div>
				</div>
				<div className='nav-bottom'>
					<div className='navigation-layer'>
						<li className='navigation-item logout'>
								<div className='nav-content-wrapper' onClick={logout}>
									<div className='nav-svg'>
										<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill='#FFFFFF' d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg>
									</div>
									<div className='nav-context'>
										Log Out
									</div>
								</div>
						</li>
					</div>
				</div>
			</ul>
		</div>
	);
}

export default Navigation;
