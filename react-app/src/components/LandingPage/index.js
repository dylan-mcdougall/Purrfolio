import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';



function LandingPage() {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();

    if (sessionUser) return history.push('/portfolio');
    else {

        return (
            <div className='page-wrapper'>
            <div className='landing-navigation-wrapper'>
                <div className='landing-navigation-left'>
                    <h1 className='title'>Purrfolio</h1>
                </div>
                <div className='landing-navigation-right'>
                    <OpenModalButton
                     buttonText={"Sign Up"}
                     modalComponent={<SignupFormModal />}
                    />
                    <OpenModalButton
                     buttonText={"Log In"}
                     modalComponent={<LoginFormModal />}
                    />
                </div>
            </div>
            <div className='landing-content-wrapper'>
                <div className='landing-content'>
                    <div className='landing-content-text'>
                        <h2 className='landing-story-1'>Grow your wealth.</h2>
                        <h2 className='landing-story-2'>Build your portfolio.</h2>
                        <h2 className='landing-story-3'>Track your favorite stocks.</h2>
                    </div>
                    <div className='landing-content-image'>
                        <div className='shadow'></div>
                        <img src='https://aaprojectbucket.s3.us-west-1.amazonaws.com/midjourney-stock-image.png' />
                    </div>
                </div>

                <div className='landing-signup-section'>
                    <div className='landing-signup-statement'>
                        <p>
                            Afford the life your cat deserves
                        </p>
                        <p>
                            Invest Today
                        </p>
                    </div>
                    <OpenModalButton
                     buttonText={"Sign Up"}
                     modalComponent={<SignupFormModal />}
                     />
                </div>
            </div>
        </div>
    )
    }
}

export default LandingPage;
