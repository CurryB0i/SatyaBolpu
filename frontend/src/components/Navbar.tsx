import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDropdownCircle } from 'react-icons/io';

const Navbar = () => {
  const [isCollapsed,setCollapsed] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navbarRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { state } = useAuth();
  const { pathname } = useLocation();
  const [navbarStyles,setNavbarStyles] = useState<CSSProperties>({
    position: 'relative',
    backgroundColor: 'black',
  });

  useLayoutEffect(() => {
    if(pathname === '/' || pathname.startsWith('/cultures')) {
      setNavbarStyles({
        position: 'fixed',
        backgroundColor: 'transparent',
      })
    } else {
      setNavbarStyles({
        position: 'relative',
        backgroundColor: 'black',
      })
    }
  },[pathname]);

  useEffect(() => {
    if(!navbarRef.current) return;

    if(pathname.startsWith('/cultures')) {
      setCollapsed(true);
      return;
    }

    if(pathname !== "/") {
      setCollapsed(false);
      return;
    };

    const handleScroll = () => {
      if(window.scrollY > 30) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navbarRef, pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    return () => {
      document.body.style.height = '';
      document.body.style.overflowY = '';
    };
  }, [isMenuOpen]);

  const AuthLinks = ({ extraClass = '' }: { extraClass?: string }) => {
    if(!state.token) {
        return (
          <div
            className={`flex rounded-3xl overflow-hidden cursor-pointer text-sm p-0.75 sm:p-0 sm:text-xl
              ${pathname !== '/' ? 'bg-white text-black' : 'bg-black text-white'}
              ${extraClass}`}
          >
            <NavLink to="/login" className="hover:bg-primary p-1 sm:p-2">
              Log In
            </NavLink>
            <NavLink to="/signup" className="hover:bg-primary p-1 sm:p-2">
              Sign Up
            </NavLink>
          </div>
        )
    } else {
        return (
          <NavLink to={'/profile'} onClick={() => setIsMenuOpen(false)} className={`text-[2rem] cursor-pointer hover:text-primary hover:scale-110
            transition-all duration-200 ${pathname === '/profile' ? 'text-primary' : ''}`}>
            <CgProfile />
          </NavLink>
        )
    }
  };

  const NavLinks = () => (
    <div
      className={`flex flex-col text-xl font-semibold absolute lg:relative top-0 
                       lg:flex-row items-center justify-center h-screen lg:h-auto gap-5`}
    >
      <NavLink
        style={{ textShadow: '1px 1px 6px black' }}
        className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${pathname === '/' ? 'text-primary' : ''}`}
        to="/"
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </NavLink>
      {
        state.token &&
        <NavLink
          style={{ textShadow: '1px 1px 6px black' }}
          className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${pathname === '/dashboard' ? 'text-primary' : ''}`}
          to="/dashboard"
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </NavLink>
      }
      {
        state.token && state.user?.role === 'admin' &&
        <NavLink
          style={{ textShadow: '1px 1px 6px black' }}
          className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${pathname === '/create' ? 'text-primary' : ''}`}
          to="/create"
          onClick={() => setIsMenuOpen(false)}
        >
          Create
        </NavLink>
      }
      <NavLink
        style={{ textShadow: '1px 1px 6px black' }}
        className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${pathname === '/explore' ? 'text-primary' : ''}`}
        to="/explore"
        onClick={() => setIsMenuOpen(false)}
      >
        Explore
      </NavLink>
      <NavLink
        style={{ textShadow: '1px 1px 6px black' }}
        className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${pathname === '/map' ? 'text-primary' : ''}`}
        to="/map"
        onClick={() => setIsMenuOpen(false)}
      >
        Map
      </NavLink>
    </div>
  );

  return (
    <>
      <nav
        className={`z-[9999] text-white w-screen flex p-3 md:p-7 items-center justify-between transition-transform duration-500
          ${isCollapsed ? '-translate-y-full' : 'translate-y-0'}`}
        style={navbarStyles}
        ref={navbarRef}
      >
        <div className="flex gap-1 md:gap-2 items-center justify-center">
          <NavLink to="/">
            <img src="/assets/logoen.png" alt="logo" className="logo w-10 sm:w-14 aspect-square" />
          </NavLink>
          <NavLink to="/" style={{ textShadow: '1px 1px 6px black' }}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">SatyaBolpu</h1>
          </NavLink>
        </div>

        <div className="flex gap-1 sm:gap-3 font-semibold items-center justify-center">
          <div className="lg:hidden">
            <AuthLinks 
              extraClass={`${
                pathname !== '/' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            />
          </div>

          {isMenuOpen ? (
            <MdOutlineHorizontalRule
              size="35px"
              className="lg:hidden hover:text-primary cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          ) : (
            <MdOutlineMenu
              size="35px"
              className="lg:hidden hover:text-primary cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          )}
        </div>

        <div className="hidden links lg:flex gap-5 font-semibold items-center justify-center text-xl">
          <NavLinks />
          <AuthLinks
            extraClass={`hidden lg:flex ${
              pathname !== '/' ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          />
        </div>
      </nav>

      <div
        className={`links lg:hidden text-xl font-semibold text-white text-center bg-black w-screen
            overflow-hidden flex flex-col items-center justify-center gap-3 fixed top-0 right-0 z-[9998]
            transition-all duration-500 ${isMenuOpen ? 'h-screen' : 'h-0'}`}
        ref={menuRef}
      >
        <NavLinks />
      </div>

      {
        isCollapsed &&
          <div
            className='fixed bg-primary w-full h-4 z-[9999] flex justify-center'
            onClick={() => setCollapsed(false)}
          >
            <IoIosArrowDropdownCircle size={'30px'} className='bg-primary rounded-full cursor-pointer'/>
          </div>
      }

    </>
  );
};

export default Navbar;

