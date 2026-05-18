import { Link } from 'react-router-dom';
import { FaInstagram,FaFacebook, FaYoutube, FaWhatsapp  } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className='footer relative w-screen flex flex-col gap-10 bg-black border-t-slate-800 border-t-2 border-solid p-10 select-none z-9995'>
      <div className='w-full flex flex-col items-center justify-center gap-5'>
        <img className='w-20 object-cover' src="/assets/logoen.png" alt="logo" />
        <div className='text-primary text-center'>
          <div className='text-[2rem]/[2rem] font-black'>SatyaBolpu</div>
          <div className='italic'>Tuluva Satya Chitta</div>
        </div>
      </div>

      <div className='w-full flex flex-col items-center justify-center gap-3 text-center text-white'>
        <div className='w-full flex gap-5 justify-center items-center flex-wrap text-[1rem] sm:text-[1.25rem] [font-style:oblique]'>
          <Link className='hover:text-primary' to={'/'}>Daivaradhane</Link>&#8226;
          <Link className='hover:text-primary' to={'/'}>Nagaradhane</Link>&#8226;
          <Link className='hover:text-primary' to={'/'}>Yakshagana</Link>&#8226;
          <Link className='hover:text-primary' to={'/'}>Kambala</Link>&#8226;
          <Link className='hover:text-primary' to={'/'}>Map</Link>
        </div>
        <div className='flex text-[1.5rem] gap-5'>
          <Link to={'/'}><FaInstagram color='white'/></Link>
          <Link to={'/'}><FaFacebook color='white'/></Link>
          <Link to={'/'}><FaXTwitter color='white'/></Link>
          <Link to={'/'}><FaYoutube color='white'/></Link>
          <Link to={'/'}><FaWhatsapp color='white'/></Link>
        </div>
        <div className='flex text-[0.85rem] sm:text-[1ren] gap-5'>
          <Link className='hover:text-primary' to={'/'}>Contact Us</Link>|
          <Link className='hover:text-primary' to={'/'}>About Us</Link>|
          <Link className='hover:text-primary' to={'/'}>FAQs</Link>
        </div>
      </div>

      <div className='w-full text-center text-[0.75rem] sm:text-[1ren] flex flex-col items-center justify-center gap-3'>
        <div className='text-slate-400'>
          Copyright &#169; 2025 SatyaBolpu. All Rights Reserved TGA
        </div>
        <div className='flex text-slate-600 gap-2'>
        <Link className='hover:underline' to={'/'}>Cookies Policy</Link>|
        <Link className='hover:underline' to={'/'}>Privacy Policy</Link>|
        <Link className='hover:underline' to={'/'}>Legal Terms</Link>
        </div>
      </div>

    </div>
  )
}

export default Footer;
