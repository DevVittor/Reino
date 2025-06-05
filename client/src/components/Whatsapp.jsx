import { IoLogoWhatsapp } from "react-icons/io";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
export default function Whatsapp({ contact, title, message }) {
  const encodedMessage = encodeURIComponent(message); // Codifica a mensagem para URL
  const whatsappUrl = `https://wa.me/55${contact}?text=${encodedMessage}`;
  return (
    <Link
      to={whatsappUrl}
      target="_blank"
      className="fixed bottom-0 right-0 m-5 flex items-center gap-2 bg-white z-40 hover:bg-zinc-50/90 transition-colors ease-linear duration-150 border border-zinc-200 rounded-full px-3 py-1 shadow-sm hover:cursor-pointer"
    >
      <span className="font-medium text-sm">{title}</span>
      <IoLogoWhatsapp className="text-green-500 text-4xl" />
    </Link>
  );
}
Whatsapp.propTypes = {
  contact: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
