import React from 'react';
import './Footer.css';

function Footer() {

    return (
        <>
            <div className='footer-heading'>
                <h4>
                    Contributors
                </h4>
            </div>
            <div className='footer-content'>
                <div className='shell'>
                    <div className='details'>
                        <p className='name'>
                            Dylan McDougall
                        </p>
                        <p className='links'>
                            Github: <a href='https://github.com/dylan-mcdougall'>https://github.com/dylan-mcdougall</a>
                            See more: <a href='https://para-social.onrender.com'>https://para-social.onrender.com</a>
                        </p>
                        <div className='contributions'>
                            <p className='heading'>
                                Contributions:
                            </p>
                            <ul className='contribution-list'>
                                <li>
                                    Backend
                                </li>
                                <li>
                                    Styling
                                </li>
                                <li>
                                    Landing/Navigation
                                </li>
                                <li>
                                    Search
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='shell'>
                    <div className='details'>
                        <p className='name'>
                            Emily Norman
                        </p>
                        <p className='links'>
                            Github: <a href='https://github.com/eanorman'>https://github.com/eanorman</a>
                            See more: <a href='https://stellarsociety.onrender.com/'>https://stellarsociety.onrender.com/</a>
                        </p>
                        <div className='contributions'>
                            <p className='heading'>
                                Contributions:
                            </p>
                            <ul className='contribution-list'>
                                <li>
                                    Portfolio
                                </li>
                                <li>
                                    Orders
                                </li>
                                <li>
                                    Transactions
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='shell'>
                    <div className='details'>
                        <p className='name'>
                            Charles Carroll
                        </p>
                        <p className='links'>
                            Github: <a href='#'></a>
                            See more: <a href='#'></a>
                        </p>
                        <div className='contributions'>
                            <p className='heading'>
                                Contributions:
                            </p>
                            <ul className='contribution-list'>
                                <li>
                                    Stock Details
                                </li>
                                <li>
                                    Watchlists
                                </li>
                                <li>
                                    OAuth
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer
