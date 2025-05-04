import { useState } from 'react';
import { Link } from 'react-router-dom';

import { SearchDialog } from '../../search-dialog/SearchDialog';
import { DrawerLateral } from './DrawerLateral';

import LogoDesktop from '../../../../assets/svg/HOME logo TELMA BARCELLOS modacad.svg';
import LogoMobile from '../../../../assets/svg/MOBILE Logo TELMA BARCELLOS modacad.svg';
import { useUser } from '../../../../shared/contexts';
import { FaUserCircle } from 'react-icons/fa';
import { UserProfileCard } from '../../user-card-information/userProfileCard';

export const PublicHeader = () => {
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  
  const [isCardOpen, setIsCardOpen] = useState(false);
  const toggleProfile = () => setIsCardOpen((prev) => !prev);

  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const toggleDialog = () => setIsOpenSearch((prev) => !prev);

  return (
    <div className="flex lg:items-center w-full h-24 border-b-[1px] border-l-[1px] border-r-[1px] border-[#202020] bg-[#f1ece8] shadow-read fixed top-0 left-0 z-10">
      <div className="flex w-screen justify-between ">
        {/* Logo */}
        <div className="flex-1 justify-center items-center flex px-2">
          <Link to={'/'} className="h-14 lg:h-auto">
            <img src={LogoDesktop} className="hidden lg:block h-full" alt="Logo Desktop" />
            <img src={LogoMobile} className="block lg:hidden h-full" alt="Logo Mobile" />
          </Link>
        </div>
        {/* Menu */}
        <nav className="flex font-medium font-montserrat ">
          <button
            className="font-medium text-sm border flex items-center justify-center border-r-0 border-b-0 border-t-0 border-zinc-950 w-24 h-24 px-6 py-8 hover:bg-[#dcdf1e]"
            onClick={toggleDialog}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
          {user ? (
            <button
              className="hidden lg:flex font-medium text-sm border items-center justify-center border-r-0 border-b-0 border-t-0 border-zinc-950 w-24 h-24 px-6 py-8 hover:bg-[#dcdf1e]"
              onClick={toggleProfile}
            >
              <FaUserCircle size={35}/>
            </button>
          ) : null }
          <button
            className="font-medium text-sm border border-r-0 border-b-0 border-t-0 border-zinc-950 w-24 h-24 px-6 py-7 hover:bg-[#dcdf1e] flex items-center justify-center"
            onClick={toggleDrawer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
            </svg>
          </button>
        </nav>
      </div>
      <DrawerLateral isOpen={isOpen} toggleDrawer={toggleDrawer} />
      <SearchDialog isOpen={isOpenSearch} toggleDialog={toggleDialog} isDashboard={false} />
      {
        user && isCardOpen ? <UserProfileCard isOpen={isCardOpen} toggleDialog={toggleProfile} /> : null
      }
    </div>
  );
};
