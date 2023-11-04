import React from 'react';
import { useHistory } from 'react-router-dom';

function Footer() {
    const history = useHistory();

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
                            Github: https://github.com/dylan-mcdougall
                            See more: https://para-social.onrender.com
                        </p>
                    </div>
                </div>
                <div className='shell'>

                </div>
                <div className='shell'>

                </div>
            </div>
        </>
    )
}
