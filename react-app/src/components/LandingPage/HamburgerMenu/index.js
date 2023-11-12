import React, { useState, useEffect, useRef } from 'react';
import OpenModalButton from '../../OpenModalButton';
import SignupFormModal from '../../SignupFormModal';
import LoginFormModal from '../../LoginFormModal';
import { RxHamburgerMenu } from 'react-icons/rx';


function HamburgerMenu() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const hamburgerRef = useRef();

    const openMenu = () => {
        if (toggleMenu) return;
        setToggleMenu(true);
    };

    useEffect(() => {
        if (!toggleMenu) return;

        const closeMenu = (e) => {
            if (!hamburgerRef.current.contains(e.target)) {
                setToggleMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [toggleMenu]);

    const hamburgerClass = "hamburger-dropdown" + (toggleMenu ? "" : " hidden");
    const closeMenu = () => setToggleMenu(false);
    
    return (
        <>
            <button onClick={openMenu}>
                <RxHamburgerMenu style={{ backgroundColor: "black", color: "#dcdbcb" }} />
            </button>
            <div className={hamburgerClass} ref={hamburgerRef}>
                <OpenModalButton
                    buttonText={"Sign Up"}
                    onButtonClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                />
                <OpenModalButton
                    buttonText={"Log In"}
                    onButtonClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                />
            </div>
        </>
    )
}

export default HamburgerMenu;
